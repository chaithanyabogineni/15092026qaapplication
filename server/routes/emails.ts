import { Router } from "express";
import { getCurrentAppState, saveAppState } from "../utils/state.ts";
import { getSupabaseServiceKey, getSupabaseUrl, getSupabaseAnonKey } from "../utils/db.ts";
import { getAppCredentialFromDB, setAppCredentialInDB } from "../utils/credentials.ts";
import { generateServerQAChecklistBase64 } from "../utils/excel.ts";
import nodemailer from "nodemailer";
import { 
  emailTemplate, 
  cqaApprovalEmailTemplate, 
  cqaApprovalEmailText,
  formatFriendlyName,
  passwordResetEmailTemplate, 
  passwordSetupEmailTemplate,
  escapeHtml, 
  isPrivateOrInternalUrl 
} from "../utils/helpers.ts";

export const router = Router();

router.post("/api/forgot-password", async (req, res) => {
  const { email, resetUrl, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const gmailUser = (await getAppCredentialFromDB("GMAIL_USER")) || process.env.GMAIL_USER;
    const gmailPass = (await getAppCredentialFromDB("GMAIL_APP_PASSWORD")) || process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPass) {
      return res.status(400).json({ error: "SMTP credentials not configured in database." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass, 
      },
    });

    const targetUrl = resetUrl || `${req.headers.origin || ""}/login?mode=reset&email=${encodeURIComponent(email)}`;

    const mailOptions = {
      from: `"Zeta QA Platform Security" <${gmailUser}>`,
      to: email,
      subject: "Password Reset Request - Zeta QA Platform",
      html: passwordResetEmailTemplate({
        name: name,
        email: email,
        resetUrl: targetUrl
      }),
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Password reset email sent successfully!" });
  } catch (error) {
    console.error("Error sending forgot password email:", error);
    res.status(500).json({ error: "Failed to send reset email." });
  }
});

router.post("/api/send-password-setup", async (req, res) => {
  const { name, email, setupUrl } = req.body || {};

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const gmailUser = (await getAppCredentialFromDB("GMAIL_USER")) || process.env.GMAIL_USER;
    const gmailPass = (await getAppCredentialFromDB("GMAIL_APP_PASSWORD")) || process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPass) {
      return res.status(400).json({ error: "SMTP credentials not configured in database." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass, 
      },
    });

    const targetUrl = setupUrl || `${req.headers.origin || ""}/signup?email=${encodeURIComponent(email)}&type=password-setup`;

    const mailOptions = {
      from: `"Zeta QA Platform Admin" <${gmailUser}>`,
      to: email,
      subject: "Set Up Your Password - Zeta QA Platform",
      html: passwordSetupEmailTemplate({
        name: name,
        email: email,
        setupUrl: targetUrl
      }),
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Password setup email sent successfully!" });
  } catch (error) {
    console.error("Error sending password setup email:", error);
    res.status(500).json({ error: "Failed to send password setup email." });
  }
});

router.post("/api/send-approval-email", async (req, res) => {
  const { 
    to, 
    cc, 
    subject, 
    body, 
    html, 
    senderEmail, 
    senderName, 
    recipientName,
    assignedQaName,
    loggedInUserName,
    campaignName, 
    team, 
    country, 
    versionName, 
    feedback, 
    callouts,
    ownerCallouts,
    clientCallouts,
    isApproved,
    screenshots,
    attachments,
    complianceScore,
    totalCheckpoints,
    passedCheckpoints,
    checklists,
    answers,
    qaType,
    smtpUser,
    smtpPass
  } = req.body;
  
  if (!to) {
    return res.status(400).json({ error: "Recipient email is required" });
  }

  const effectiveQaType = (qaType || "CQA").toUpperCase();

  try {
    if (smtpUser && smtpUser.trim()) {
      await setAppCredentialInDB("GMAIL_USER", smtpUser.trim().toLowerCase(), "Gmail SMTP Sender");
    }
    if (smtpPass && smtpPass.trim()) {
      await setAppCredentialInDB("GMAIL_APP_PASSWORD", smtpPass.trim().replace(/\s+/g, ""), "Gmail App Password");
    }

    const rawGmailUser = (smtpUser || "").trim() || (await getAppCredentialFromDB("GMAIL_USER")) || process.env.GMAIL_USER || "";
    const rawGmailPass = (smtpPass || "").trim() || (await getAppCredentialFromDB("GMAIL_APP_PASSWORD")) || process.env.GMAIL_APP_PASSWORD || "";

    const cleanGmailUser = rawGmailUser.trim().toLowerCase();
    const cleanGmailPass = rawGmailPass.trim().replace(/\s+/g, "").replace(/["']/g, "");

    // Ensure Excel attachment exists; auto-generate on server if not provided
    let finalAttachments: any[] = Array.isArray(attachments) ? [...attachments] : [];
    if (finalAttachments.length === 0 && campaignName) {
      try {
        const generated = generateServerQAChecklistBase64({
          campaignName: campaignName,
          team: team || "Zeta QA",
          country: country || "Global",
          versionName: versionName || "v1",
          userEmail: senderEmail || "qa-lead@zetaglobal.com",
          campaignStatus: "Approved",
          qaType: effectiveQaType,
          checklists: checklists || [],
          answers: answers || {}
        });
        if (generated && generated.base64) {
          finalAttachments.push({
            filename: generated.filename,
            content: generated.base64,
            contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          });
        }
      } catch (excelErr) {
        console.warn("[Server API] Could not auto-generate Excel attachment on server:", excelErr);
      }
    }

    // Helper to extract screenshots from callout bullet arrays
    const extractBulletScreenshots = (bullets: any[], prefix: string) => {
      if (Array.isArray(bullets)) {
        bullets.forEach((c: any, idx: number) => {
          if (c && typeof c === 'object' && c.screenshot && c.screenshot.dataUrl) {
            const matches = c.screenshot.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
            if (matches) {
              const mimeType = matches[1];
              const base64Data = matches[2];
              const ext = mimeType.split("/")[1] || "png";
              finalAttachments.push({
                filename: c.screenshot.name || `${prefix}_Bullet_${idx + 1}_Screenshot.${ext}`,
                content: base64Data,
                contentType: mimeType
              });
            }
          }
        });
      }
    };

    extractBulletScreenshots(ownerCallouts !== undefined ? ownerCallouts : callouts, "OwnerCallout");
    extractBulletScreenshots(clientCallouts, "ClientCallout");

    if (Array.isArray(screenshots)) {
      screenshots.forEach((s: any, idx: number) => {
        if (s && s.dataUrl) {
          const matches = s.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
          if (matches) {
            const mimeType = matches[1];
            const base64Data = matches[2];
            const ext = mimeType.split("/")[1] || "png";
            finalAttachments.push({
              filename: s.name || `Callout_Screenshot_${idx + 1}.${ext}`,
              content: base64Data,
              contentType: mimeType
            });
          }
        }
      });
    }

    const primaryAttachmentFilename = finalAttachments && finalAttachments[0]?.filename 
      ? finalAttachments[0].filename 
      : `ZETA_QA_Checklist_${effectiveQaType.replace(/\s+/g, "_")}_${(campaignName || "Campaign").replace(/[^a-zA-Z0-9_-]/g, "_")}_${new Date().toISOString().slice(0, 10)}.xlsx`;

    const effectiveSenderName = (senderName || "").trim() || "Cbogineni";

    // Dynamically resolve greeting recipient name, strictly replacing static 'QA User' placeholder
    let effectiveRecipientName = (recipientName || "").trim();
    if (!effectiveRecipientName || /^qa\s*user$/i.test(effectiveRecipientName) || /^user$/i.test(effectiveRecipientName)) {
      if (assignedQaName && !/^qa\s*user$/i.test(assignedQaName.trim())) {
        effectiveRecipientName = assignedQaName.trim();
      } else if (loggedInUserName && !/^qa\s*user$/i.test(loggedInUserName.trim())) {
        effectiveRecipientName = loggedInUserName.trim();
      } else if (to) {
        effectiveRecipientName = formatFriendlyName("", to);
      }
    }
    if (!effectiveRecipientName) {
      effectiveRecipientName = "Campaign Reviewer";
    }

    // Build specialized, responsive, clean Zeta QA approval HTML template
    let finalHtml = html;
    if (!finalHtml || campaignName) {
      finalHtml = cqaApprovalEmailTemplate({
        campaignName: campaignName || "Campaign Verification",
        recipientName: effectiveRecipientName,
        senderName: effectiveSenderName,
        assignedQaName: assignedQaName || undefined,
        loggedInUserName: loggedInUserName || undefined,
        team: team || "Zeta QA",
        country: country || "Global",
        versionName: versionName || "v1",
        feedback: feedback || "",
        callouts: callouts || [],
        ownerCallouts: ownerCallouts !== undefined ? ownerCallouts : callouts,
        clientCallouts: clientCallouts || [],
        isApproved: isApproved !== undefined ? Boolean(isApproved) : true,
        screenshots: screenshots || [],
        attachmentFilename: primaryAttachmentFilename,
        complianceScore: complianceScore || "100%",
        totalCheckpoints: totalCheckpoints || 22,
        passedCheckpoints: passedCheckpoints || 22,
        qaType: effectiveQaType
      });
    }

    const dynamicPlainText = cqaApprovalEmailText({
      recipientName: effectiveRecipientName,
      senderName: effectiveSenderName,
      assignedQaName: assignedQaName || undefined,
      loggedInUserName: loggedInUserName || undefined,
      feedback: feedback || "",
      callouts: callouts || [],
      ownerCallouts: ownerCallouts !== undefined ? ownerCallouts : callouts,
      clientCallouts: clientCallouts || [],
      isApproved: isApproved !== undefined ? Boolean(isApproved) : true,
      screenshots: screenshots || [],
      qaType: effectiveQaType
    });

    if (!cleanGmailUser || !cleanGmailPass) {
      return res.status(400).json({ 
        success: false, 
        deliveredVia: "none",
        isConfigured: false,
        error: "Gmail SMTP Dispatcher is not configured yet. Please configure your Gmail sender address and 16-character App Password to send.",
        message: "Gmail Dispatcher not configured.",
        hasAttachment: Boolean(finalAttachments && finalAttachments.length > 0),
        attachmentFilename: primaryAttachmentFilename
      });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: cleanGmailUser,
          pass: cleanGmailPass,
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 15000
      });

      const mailOptions: any = {
        from: `"${effectiveSenderName}" <${cleanGmailUser}>`,
        to: to,
        cc: cc || undefined,
        subject: subject || `${effectiveQaType} Approved | ${campaignName || "Campaign QA Verification"}`,
        text: (body && body.trim()) ? body : dynamicPlainText,
        html: finalHtml,
      };

      if (finalAttachments && finalAttachments.length > 0) {
        mailOptions.attachments = finalAttachments.map((att: any) => ({
          filename: att.filename,
          content: Buffer.from(att.content, "base64"),
          contentType: att.contentType || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }));
      }

      await transporter.sendMail(mailOptions);
      return res.json({ 
        success: true, 
        deliveredVia: "smtp",
        message: `Approval email with attached Excel checklist sent successfully via Gmail SMTP (${cleanGmailUser})!`,
        hasAttachment: Boolean(finalAttachments && finalAttachments.length > 0),
        attachmentFilename: primaryAttachmentFilename
      });
    } catch (smtpError: any) {
      console.error("[Server API] Direct SMTP attempt failed:", smtpError.message);
      let errorMsg = smtpError.message || "Failed to dispatch email via Gmail SMTP.";
      let authFailed = false;
      if (smtpError.message?.includes("535") || smtpError.message?.includes("Username and Password not accepted")) {
        authFailed = true;
        errorMsg = "Google Authentication Failed (535-5.7.8): Username or App Password rejected by Gmail. Please ensure 2-Step Verification is active on your Google account and enter a 16-character App Password (generated at myaccount.google.com/apppasswords), NOT your regular Google account password.";
      }
      return res.status(400).json({
        success: false,
        deliveredVia: "smtp_error",
        authFailed,
        smtpError: smtpError.message,
        error: errorMsg,
        message: errorMsg,
        hasAttachment: Boolean(finalAttachments && finalAttachments.length > 0),
        attachmentFilename: primaryAttachmentFilename
      });
    }
  } catch (error: any) {
    console.error("Error sending approval email via server:", error);
    return res.status(500).json({
      success: false,
      deliveredVia: "server_error",
      error: error.message || "Failed to dispatch via server SMTP",
      message: error.message || "Failed to dispatch via server SMTP",
      hasAttachment: false
    });
  }
});

export default router;
