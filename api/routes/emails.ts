import { Router } from "express";
import { getCurrentAppState, saveAppState } from "../utils/state.ts";
import { getSupabaseServiceKey, getSupabaseUrl, getSupabaseAnonKey } from "../utils/db.ts";
import { getAppCredentialFromDB } from "../utils/credentials.ts";
import { generateServerQAChecklistBase64 } from "../utils/excel.ts";
import nodemailer from "nodemailer";
import { 
  emailTemplate, 
  cqaApprovalEmailTemplate, 
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
      from: `"HP-QA Platform Security" <${gmailUser}>`,
      to: email,
      subject: "Password Reset Request - HP-QA Platform",
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
      from: `"HP-QA Platform Admin" <${gmailUser}>`,
      to: email,
      subject: "Set Up Your Password - HP-QA Platform",
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
    campaignName, 
    team, 
    country, 
    versionName, 
    feedback, 
    attachments,
    complianceScore,
    totalCheckpoints,
    passedCheckpoints,
    checklists,
    answers,
    qaType
  } = req.body;
  
  if (!to) {
    return res.status(400).json({ error: "Recipient email is required" });
  }

  const effectiveQaType = (qaType || "CQA").toUpperCase();

  try {
    const gmailUser = (await getAppCredentialFromDB("GMAIL_USER")) || process.env.GMAIL_USER;
    const gmailPass = (await getAppCredentialFromDB("GMAIL_APP_PASSWORD")) || process.env.GMAIL_APP_PASSWORD;

    // Ensure Excel attachment exists; auto-generate on server if not provided
    let finalAttachments: any[] = Array.isArray(attachments) ? [...attachments] : [];
    if (finalAttachments.length === 0 && campaignName) {
      try {
        const generated = generateServerQAChecklistBase64({
          campaignName: campaignName,
          team: team || "HP-APJ",
          country: country || "Global",
          versionName: versionName || "v1",
          userEmail: senderEmail || "qa-lead@hp.com",
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

    const primaryAttachmentFilename = finalAttachments && finalAttachments[0]?.filename 
      ? finalAttachments[0].filename 
      : `HP_QA_Checklist_${effectiveQaType.replace(/\s+/g, "_")}_${(campaignName || "Campaign").replace(/[^a-zA-Z0-9_-]/g, "_")}_${new Date().toISOString().slice(0, 10)}.xlsx`;

    // Build specialized, responsive, branded QA approval HTML template
    let finalHtml = html;
    if (!finalHtml || campaignName) {
      finalHtml = cqaApprovalEmailTemplate({
        campaignName: campaignName || "Campaign Verification",
        recipientName: recipientName || to.split("@")[0],
        senderName: senderName || "QA Lead",
        team: team || "HP-APJ",
        country: country || "Global",
        versionName: versionName || "v1",
        feedback: feedback || "",
        attachmentFilename: primaryAttachmentFilename,
        complianceScore: complianceScore || "100%",
        totalCheckpoints: totalCheckpoints || 22,
        passedCheckpoints: passedCheckpoints || 22,
        qaType: effectiveQaType
      });
    }

    if (gmailUser && gmailPass) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      const mailOptions: any = {
        from: `"HP-QA Platform" <${gmailUser}>`,
        to: to,
        cc: cc || undefined,
        subject: subject || `QA Approval | ${campaignName || "Campaign Notification"}`,
        text: body || `QA Approval verified for ${campaignName || "Campaign"} with attached Excel verification checklist.`,
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
        message: "Approval email with attached Excel checklist sent successfully via SMTP server!",
        hasAttachment: Boolean(finalAttachments && finalAttachments.length > 0),
        attachmentFilename: primaryAttachmentFilename
      });
    } else {
      // SMTP not configured - notify client to use mailto/webmail
      return res.json({ 
        success: true, 
        deliveredVia: "client",
        message: "Email drafted with Excel checklist. Use Outlook/Mail Client or Webmail link to deliver.",
        hasAttachment: Boolean(finalAttachments && finalAttachments.length > 0),
        attachmentFilename: primaryAttachmentFilename
      });
    }
  } catch (error: any) {
    console.error("Error sending approval email via server:", error);
    res.status(500).json({ error: error.message || "Failed to send email via SMTP" });
  }
});

export default router;
