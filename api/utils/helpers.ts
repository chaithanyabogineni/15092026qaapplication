export const escapeHtml = (str: string = "") => {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

export const isPrivateOrInternalUrl = (urlStr: string): boolean => {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return true;
    }
    const hostname = parsed.hostname.toLowerCase();
    
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname === "::1" ||
      hostname === "169.254.169.254" ||
      hostname.endsWith(".internal") ||
      hostname.endsWith(".local")
    ) {
      return true;
    }

    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = hostname.match(ipv4Regex);
    if (match) {
      const [, p1, p2] = match.map(Number);
      if (
        p1 === 10 ||
        (p1 === 172 && p2 >= 16 && p2 <= 31) ||
        (p1 === 192 && p2 === 168) ||
        (p1 === 169 && p2 === 254) ||
        p1 === 127 ||
        p1 === 0
      ) {
        return true;
      }
    }

    return false;
  } catch {
    return true; 
  }
};

/**
 * Universal, fully responsive, bulletproof HTML email wrapper for HP-QA Platform
 * Supports Outlook (MSO), Apple Mail, Gmail (Web/App), and mobile viewports.
 */
export const emailTemplate = (
  title: string, 
  content: string, 
  ctaLink?: string, 
  ctaText?: string, 
  badgeText: string = "HP-QA Platform",
  preheaderText?: string
) => {
  const currentYear = new Date().getFullYear();
  const preheader = preheaderText || title;

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    /* Universal Client Resets */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    
    /* Mobile Responsive Overrides */
    @media only screen and (max-width: 620px) {
      .container-table { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; border-left: 0 !important; border-right: 0 !important; }
      .brand-header { padding: 24px 20px !important; }
      .header-title { font-size: 20px !important; line-height: 1.3 !important; }
      .content-body { padding: 24px 20px !important; font-size: 14px !important; }
      .meta-table td { display: block !important; width: 100% !important; box-sizing: border-box !important; padding: 8px 12px !important; }
      .meta-label { border-bottom: none !important; padding-bottom: 2px !important; }
      .meta-value { padding-top: 2px !important; border-bottom: 1px solid #e2e8f0 !important; }
      .btn-responsive { display: block !important; width: 100% !important; box-sizing: border-box !important; text-align: center !important; }
      .footer-wrap { padding: 20px 16px !important; font-size: 11px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; min-width: 100%;">
  <!-- Hidden Preheader -->
  <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; color: #f1f5f9; opacity: 0;">
    ${escapeHtml(preheader)} &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9;">
    <tr>
      <td align="center" style="padding: 32px 12px;">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        
        <table role="presentation" class="container-table" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td class="brand-header" style="background: linear-gradient(135deg, #0096D6 0%, #004F8A 100%); padding: 30px 32px; text-align: left;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="vertical-align: middle;">
                    <!-- Badge -->
                    <div style="display: inline-block; padding: 4px 12px; background-color: rgba(255, 255, 255, 0.18); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 20px; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px;">
                      ${escapeHtml(badgeText)}
                    </div>
                    <!-- Title -->
                    <h1 class="header-title" style="margin: 0; color: #ffffff; font-size: 23px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.25; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                      ${escapeHtml(title)}
                    </h1>
                    <!-- Subtitle -->
                    <p style="margin: 6px 0 0 0; color: rgba(255, 255, 255, 0.85); font-size: 13px; font-weight: 400; line-height: 1.4;">
                      HP APJ & Zeta Global Quality Assurance Platform
                    </p>
                  </td>
                  <td width="54" style="vertical-align: middle; text-align: right;">
                    <!-- HP Monogram Mark -->
                    <div style="display: inline-block; width: 44px; height: 44px; border-radius: 50%; background-color: #ffffff; text-align: center; line-height: 44px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                      <span style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-style: italic; font-weight: 900; font-size: 22px; color: #0096D6; letter-spacing: -1px;">hp</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content Area -->
          <tr>
            <td class="content-body" style="padding: 32px; color: #334155; font-size: 15px; line-height: 1.65; background-color: #ffffff;">
              ${content}

              ${ctaLink && ctaText ? `
              <!-- Bulletproof CTA Button -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 28px; margin-bottom: 16px;">
                <tr>
                  <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="border-radius: 8px; background-color: #0096D6;">
                          <a href="${escapeHtml(ctaLink)}" target="_blank" class="btn-responsive" style="font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-weight: 600; color: #ffffff; text-decoration: none; padding: 13px 34px; border-radius: 8px; border: 1px solid #0081bb; display: inline-block; box-shadow: 0 2px 6px rgba(0, 150, 214, 0.35);">
                            ${escapeHtml(ctaText)} &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              ` : ''}
            </td>
          </tr>

          <!-- Corporate Footer -->
          <tr>
            <td class="footer-wrap" style="background-color: #f8fafc; padding: 24px 32px; text-align: center; color: #64748b; font-size: 12px; line-height: 1.6; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 6px 0; font-weight: 600; color: #475569;">
                HP APJ & Zeta Global Enterprise Quality Assurance
              </p>
              <p style="margin: 0 0 8px 0;">
                &copy; ${currentYear} HP Development Company, L.P. & Zeta Global Inc. All rights reserved. Confidential & Proprietary.
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                This automated verification transmission was dispatched by the secure HP-QA telemetry engine.
              </p>
            </td>
          </tr>

        </table>

        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;
};

/**
 * Specialized, beautifully branded CQA Approval Email Template
 * Features an executive verification card, campaign metadata grid, compliance rating, 
 * feedback notes, and a high-visibility attachment card for the Excel checklist.
 */
export const cqaApprovalEmailTemplate = (options: {
  campaignName: string;
  recipientName?: string;
  senderName?: string;
  team?: string;
  country?: string;
  versionName?: string;
  feedback?: string;
  attachmentFilename?: string;
  complianceScore?: string | number;
  totalCheckpoints?: number;
  passedCheckpoints?: number;
  qaType?: string;
}) => {
  const {
    campaignName,
    recipientName = "Team Lead",
    senderName = "QA Lead",
    team = "HP-APJ",
    country = "Global",
    versionName = "v1",
    feedback = "",
    attachmentFilename = "",
    complianceScore = "100%",
    totalCheckpoints = 22,
    passedCheckpoints = 22,
    qaType = "CQA"
  } = options;

  const normalizedQaType = (qaType || "CQA").toUpperCase();
  const scoreNumber = typeof complianceScore === "string" ? parseInt(complianceScore, 10) || 100 : complianceScore;
  const isPerfectScore = scoreNumber >= 100;
  const badgeBg = isPerfectScore ? "#ecfdf5" : "#eff6ff";
  const badgeBorder = isPerfectScore ? "#a7f3d0" : "#bfdbfe";
  const badgeTextColor = isPerfectScore ? "#065f46" : "#1e40af";
  const badgeIconBg = isPerfectScore ? "#059669" : "#2563eb";

  const feedbackHtml = feedback && feedback.trim() ? `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 22px 0; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; border-left: 4px solid #16a34a;">
      <tr>
        <td style="padding: 16px 20px;">
          <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.08em;">
            QA Verification Sign-Off Notes &amp; Feedback
          </p>
          <p style="margin: 0; color: #14532d; font-size: 14px; line-height: 1.6; white-space: pre-line;">
            ${escapeHtml(feedback.trim())}
          </p>
        </td>
      </tr>
    </table>
  ` : '';

  const displayFilename = attachmentFilename || `HP_QA_Checklist_${normalizedQaType.replace(/\s+/g, "_")}_${campaignName.replace(/[^a-zA-Z0-9_-]/g, "_")}.xlsx`;

  const attachmentHtml = `
    <!-- Excel Attachment Callout Card -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 22px 0; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; border-left: 4px solid #107c41; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
      <tr>
        <td style="padding: 16px 18px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="42" style="vertical-align: middle;">
                <div style="width: 38px; height: 38px; background-color: #107c41; border-radius: 8px; text-align: center; line-height: 38px; color: #ffffff; font-weight: 800; font-size: 13px; font-family: 'Segoe UI', Arial, sans-serif; box-shadow: 0 2px 4px rgba(16,124,65,0.3);">
                  XLSX
                </div>
              </td>
              <td style="vertical-align: middle; padding-left: 14px;">
                <div style="font-size: 13px; font-weight: 700; color: #0f172a; word-break: break-all;">
                  ${escapeHtml(displayFilename)}
                </div>
                <div style="font-size: 11px; color: #64748b; margin-top: 3px;">
                  Official Microsoft Excel QA Verification Checklist (Attached &bull; Stage-wise ${escapeHtml(normalizedQaType)} Checkpoints)
                </div>
              </td>
              <td width="70" style="vertical-align: middle; text-align: right;">
                <span style="display: inline-block; background-color: #dcfce7; color: #166534; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 12px; text-transform: uppercase;">
                  Attached
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const bodyContent = `
    <p style="margin: 0 0 16px 0; font-size: 16px; color: #1e293b;">
      Hi <strong>${escapeHtml(recipientName)}</strong>,
    </p>

    <p style="margin: 0 0 20px 0; font-size: 14px; color: #475569; line-height: 1.6;">
      The campaign <strong>${escapeHtml(campaignName)}</strong> has undergone comprehensive Quality Assurance inspection and has been formally <strong>Approved</strong> under the <strong>${escapeHtml(normalizedQaType)}</strong> verification framework.
    </p>

    <!-- Verification Status Banner -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 22px; background-color: ${badgeBg}; border: 1px solid ${badgeBorder}; border-radius: 8px;">
      <tr>
        <td style="padding: 14px 18px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="28" style="vertical-align: middle;">
                <div style="width: 26px; height: 26px; background-color: ${badgeIconBg}; border-radius: 50%; color: #ffffff; text-align: center; line-height: 26px; font-size: 14px; font-weight: bold;">
                  &#10003;
                </div>
              </td>
              <td style="vertical-align: middle; padding-left: 12px;">
                <p style="margin: 0; font-size: 15px; font-weight: 700; color: ${badgeTextColor};">
                  ${escapeHtml(normalizedQaType)} Approved &amp; Verified
                </p>
                <p style="margin: 2px 0 0 0; font-size: 12px; color: #047857;">
                  All stage-wise checkpoints validated against HP APJ quality benchmarks and deployment criteria.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Campaign Specification Grid -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="meta-table" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 20px; overflow: hidden;">
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td class="meta-label" style="padding: 10px 16px; font-size: 12px; font-weight: 600; color: #64748b; width: 35%; background-color: #f1f5f9;">
          Campaign Name
        </td>
        <td class="meta-value" style="padding: 10px 16px; font-size: 13px; font-weight: 700; color: #0f172a;">
          ${escapeHtml(campaignName)}
        </td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td class="meta-label" style="padding: 10px 16px; font-size: 12px; font-weight: 600; color: #64748b; background-color: #f1f5f9;">
          QA Checklist Type
        </td>
        <td class="meta-value" style="padding: 10px 16px; font-size: 13px; font-weight: 700; color: #0096D6;">
          ${escapeHtml(normalizedQaType)}
        </td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td class="meta-label" style="padding: 10px 16px; font-size: 12px; font-weight: 600; color: #64748b; background-color: #f1f5f9;">
          Target Team / Region
        </td>
        <td class="meta-value" style="padding: 10px 16px; font-size: 13px; font-weight: 600; color: #1e293b;">
          ${escapeHtml(team)} &bull; ${escapeHtml(country)}
        </td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td class="meta-label" style="padding: 10px 16px; font-size: 12px; font-weight: 600; color: #64748b; background-color: #f1f5f9;">
          Version Name
        </td>
        <td class="meta-value" style="padding: 10px 16px; font-size: 13px; font-weight: 600; color: #1e293b;">
          ${escapeHtml(versionName)}
        </td>
      </tr>
      <tr>
        <td class="meta-label" style="padding: 10px 16px; font-size: 12px; font-weight: 600; color: #64748b; background-color: #f1f5f9;">
          Compliance Score
        </td>
        <td class="meta-value" style="padding: 10px 16px; font-size: 13px; font-weight: 700; color: #059669;">
          <span style="display: inline-block; background-color: #d1fae5; color: #065f46; padding: 2px 8px; border-radius: 12px; margin-right: 6px;">
            ${escapeHtml(String(complianceScore))}
          </span>
          (${passedCheckpoints}/${totalCheckpoints} Points Passed)
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 14px 0; font-size: 14px; color: #334155; line-height: 1.6;">
      The complete stage-wise verification audit checklist has been compiled and is <strong>attached directly to this email in Microsoft Excel format (.xlsx)</strong> for stakeholder sign-off and historical archiving.
    </p>

    ${attachmentHtml}
    ${feedbackHtml}

    <!-- Sign-off Block -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
      <tr>
        <td>
          <p style="margin: 0 0 4px 0; font-size: 13px; color: #64748b;">Warm regards,</p>
          <p style="margin: 0; font-size: 15px; font-weight: 700; color: #0f172a;">${escapeHtml(senderName)}</p>
          <p style="margin: 2px 0 0 0; font-size: 12px; color: #0096D6; font-weight: 600;">HP APJ Quality Assurance &amp; Campaign Operations</p>
        </td>
      </tr>
    </table>
  `;

  return emailTemplate(
    `QA Approval (${normalizedQaType}) | ${campaignName}`, 
    bodyContent, 
    undefined, 
    undefined, 
    `${normalizedQaType} APPROVED`,
    `QA Approval verified for ${campaignName} (${normalizedQaType} - ${complianceScore} Compliance Score)`
  );
};

/**
 * Branded User Invitation Email Template
 */
export const inviteEmailTemplate = (options: {
  name: string;
  email: string;
  role: string;
  team: string;
  inviteUrl: string;
}) => {
  const { name, role, team, inviteUrl } = options;

  const content = `
    <p style="font-size: 16px; margin: 0 0 16px 0; color: #1e293b;">
      Hi <strong>${escapeHtml(name)}</strong>,
    </p>

    <p style="margin: 0 0 20px 0; font-size: 14px; color: #475569; line-height: 1.6;">
      You have been invited to access the <strong>HP-QA Platform</strong> by an administrator.
    </p>

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 14px 18px; font-size: 13px; border-bottom: 1px solid #e2e8f0;">
          <strong style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 2px;">Assigned Team</strong>
          <span style="font-weight: 600; color: #0f172a;">${escapeHtml(team)}</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 18px; font-size: 13px;">
          <strong style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 2px;">Account Role</strong>
          <span style="display: inline-block; background-color: #e0f2fe; color: #0369a1; font-weight: 700; font-size: 12px; padding: 2px 8px; border-radius: 12px; text-transform: capitalize;">
            ${escapeHtml(role)}
          </span>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 10px 0; font-size: 14px; color: #475569; line-height: 1.6;">
      Click the button below to complete your registration and set up your secure account password:
    </p>
  `;

  return emailTemplate("Welcome to HP-QA Platform", content, inviteUrl, "Accept Invitation & Set Password", "PLATFORM INVITATION");
};

/**
 * Branded Password Reset Email Template
 */
export const passwordResetEmailTemplate = (options: {
  name?: string;
  email: string;
  resetUrl: string;
}) => {
  const { name, email, resetUrl } = options;
  const displayName = name || email.split("@")[0];

  const content = `
    <p style="font-size: 16px; margin: 0 0 16px 0; color: #1e293b;">
      Hello <strong>${escapeHtml(displayName)}</strong>,
    </p>

    <p style="margin: 0 0 16px 0; font-size: 14px; color: #475569; line-height: 1.6;">
      We received a request to reset the password for your <strong>HP-QA Platform</strong> account (<code>${escapeHtml(email)}</code>).
    </p>

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 18px 0; background-color: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px;">
      <tr>
        <td style="padding: 14px 18px;">
          <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.5;">
            <strong>Security Notice:</strong> This password reset link is valid for 1 hour. If you did not make this request, you can safely ignore this email.
          </p>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 10px 0; font-size: 14px; color: #475569; line-height: 1.6;">
      Click the secure button below to specify a new password:
    </p>
  `;

  return emailTemplate("Password Reset Request", content, resetUrl, "Reset My Password", "SECURITY NOTICE");
};

/**
 * Branded Password Setup Email Template
 */
export const passwordSetupEmailTemplate = (options: {
  name?: string;
  email: string;
  setupUrl: string;
}) => {
  const { name, email, setupUrl } = options;
  const displayName = name || email.split("@")[0];

  const content = `
    <p style="font-size: 16px; margin: 0 0 16px 0; color: #1e293b;">
      Hello <strong>${escapeHtml(displayName)}</strong>,
    </p>

    <p style="margin: 0 0 16px 0; font-size: 14px; color: #475569; line-height: 1.6;">
      An administrator has generated a direct account setup link for your <strong>HP-QA Platform</strong> profile.
    </p>

    <p style="margin: 0 0 10px 0; font-size: 14px; color: #475569; line-height: 1.6;">
      Please click the button below to initialize your credentials and access the verification dashboard:
    </p>
  `;

  return emailTemplate("Account Credentials Setup", content, setupUrl, "Set Up My Password", "CREDENTIAL SETUP");
};
