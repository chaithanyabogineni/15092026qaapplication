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
 * Official Zeta Campaign QA Operations Logo Component (HTML/SVG)
 * Matches the official branding from the login page (AuthShell):
 * Multi-colored polygon emblem, bold ZETA, vertical divider, and CAMPAIGN QA Operations text.
 */
export const zetaLogoHtml = (mode: 'dark' | 'light' = 'dark') => {
  const isDark = mode === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const subtextColor = isDark ? '#CBD5E1' : '#64748B';
  const dividerColor = isDark ? '#475569' : '#94A3B8';
  const zetaPathFill = isDark ? '#FFFFFF' : '#0A05B0';

  return `
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="display: inline-table; vertical-align: middle;">
    <tr>
      <td style="vertical-align: middle; padding-right: 12px;">
        <svg width="111" height="34" viewBox="0 0 111 34" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; height: 30px; width: auto;">
          <defs>
            <linearGradient id="paint1_linear_zeta_email_${mode}" x1="33.5348" y1="25.3221" x2="0.535129" y2="25.3221" gradientUnits="userSpaceOnUse">
              <stop offset="0.3987" stop-color="#3b82f6" />
              <stop offset="1" stop-color="#60a5fa" />
            </linearGradient>
            <linearGradient id="paint2_linear_zeta_email_${mode}" x1="0.535153" y1="8.82208" x2="33.5348" y2="8.82208" gradientUnits="userSpaceOnUse">
              <stop stop-color="#00C2FF" />
              <stop offset="0.5398" stop-color="#BC2676" />
              <stop offset="0.8568" stop-color="#FFFB6A" />
            </linearGradient>
            <clipPath id="clip0_zeta_email_${mode}">
              <rect width="110.833" height="33" fill="white" transform="translate(0 0.5)" />
            </clipPath>
          </defs>
          <g clip-path="url(#clip0_zeta_email_${mode})">
            <path
              d="M39.3468 10.5153H50.0685L39.2203 23.7249V27.1114L54.2662 27.0874L55.6569 23.7009L44.7329 23.7249L55.6569 10.4673V7.12885L40.7376 7.15286L39.3468 10.5153ZM73.2315 10.5153L74.6476 7.12885H58.565V24.5415C58.565 25.6943 58.8178 26.0066 59.3236 26.4869C59.9558 26.9673 60.3351 27.0874 61.5741 27.0633H73.2062L74.5464 23.7249H62.7626V18.6092H67.8706L69.2867 15.1987H62.7879V10.5153H73.2315ZM103.02 8.83409C102.514 7.7533 101.629 7.15286 100.365 7.15286H98.468L90.2497 27.1114H94.5485L96.445 22.428H104.309L106.206 27.1114H110.505L103.02 8.83409ZM97.5577 19.0415L100.466 11.8363L103.247 19.0415H97.5577ZM95.1554 7.12885H77.505L76.1142 10.4673H83.1693V27.0633H87.19V10.4673H93.7393L95.1554 7.12885Z"
              fill="${zetaPathFill}"
            />
            <path
              d="M15.3998 25.9585L14.4642 21.8996L8.14242 17.0721H0.531006L12.2895 26.0306L13.9837 33.5721L33.5307 17.0721H25.9192L15.3998 25.9585Z"
              fill="url(#paint1_linear_zeta_email_${mode})"
            />
            <path
              d="M18.6619 8.18562L19.5722 12.2446L25.9192 17.0721H33.5307L21.7722 8.11357L20.0526 0.572083L0.531006 17.0721H8.14242L18.6619 8.18562Z"
              fill="url(#paint2_linear_zeta_email_${mode})"
            />
          </g>
        </svg>
      </td>
      <td style="vertical-align: middle; border-left: 1.5px solid ${dividerColor}; padding-left: 10px;">
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: ${textColor}; line-height: 1.2;">
          CAMPAIGN
        </div>
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 9px; font-weight: 500; letter-spacing: 0.5px; color: ${subtextColor}; line-height: 1.2; margin-top: 1px;">
          QA Operations
        </div>
      </td>
    </tr>
  </table>`;
};

/**
 * Universal, fully responsive, bulletproof HTML email wrapper for Zeta QA Platform
 * Supports Outlook (MSO), Apple Mail, Gmail (Web/App), and mobile viewports.
 */
export const emailTemplate = (
  title: string, 
  content: string, 
  ctaLink?: string, 
  ctaText?: string, 
  badgeText: string = "Zeta QA Platform",
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
          
          <!-- Header Banner with Official Zeta Brand Logo -->
          <tr>
            <td class="brand-header" style="background: linear-gradient(135deg, #080D1A 0%, #0F172A 100%); padding: 26px 30px; text-align: left;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="vertical-align: middle;">
                    <!-- Official Zeta Logo Header (Matches Login Page) -->
                    <div style="margin-bottom: 14px;">
                      ${zetaLogoHtml('dark')}
                    </div>
                    <!-- Badge -->
                    <div style="display: inline-block; padding: 3px 10px; background-color: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.22); border-radius: 16px; color: #94A3B8; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;">
                      ${escapeHtml(badgeText)}
                    </div>
                    <!-- Title -->
                    <h1 class="header-title" style="margin: 0; color: #ffffff; font-size: 21px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.25; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                      ${escapeHtml(title)}
                    </h1>
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
                        <td align="center" style="border-radius: 8px; background-color: #0A05B0;">
                          <a href="${escapeHtml(ctaLink)}" target="_blank" class="btn-responsive" style="font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-weight: 600; color: #ffffff; text-decoration: none; padding: 13px 34px; border-radius: 8px; border: 1px solid #0001AA; display: inline-block; box-shadow: 0 2px 6px rgba(10, 5, 176, 0.35);">
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
                Zeta Global Enterprise Quality Assurance
              </p>
              <p style="margin: 0 0 8px 0;">
                &copy; ${currentYear} Zeta Global Inc. All rights reserved. Confidential & Proprietary.
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                This automated verification transmission was dispatched by the secure Zeta QA telemetry engine.
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

export interface CalloutScreenshotItem {
  name?: string;
  dataUrl?: string;
  caption?: string;
}

export interface CalloutItem {
  text: string;
  screenshot?: CalloutScreenshotItem;
}

export interface CQAApprovalEmailOptions {
  campaignName?: string;
  recipientName?: string;
  senderName?: string;
  assignedQaName?: string;
  loggedInUserName?: string;
  team?: string;
  country?: string;
  versionName?: string;
  feedback?: string;
  callouts?: Array<string | CalloutItem> | string;
  ownerCallouts?: Array<string | CalloutItem> | string;
  clientCallouts?: Array<string | CalloutItem> | string;
  isApproved?: boolean;
  screenshots?: CalloutScreenshotItem[];
  attachmentFilename?: string;
  complianceScore?: string | number;
  totalCheckpoints?: number;
  passedCheckpoints?: number;
  qaType?: string;
}

/**
 * Formats a clean humanized name from a raw name or email address,
 * explicitly avoiding generic placeholders like "QA User".
 */
export function formatFriendlyName(rawName?: string, email?: string): string {
  if (rawName && rawName.trim()) {
    const clean = rawName.trim();
    if (!/^qa\s*user$/i.test(clean) && !/^user$/i.test(clean)) {
      return clean;
    }
  }

  if (email && email.trim()) {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === "chaithanyabogineni@gmail.com" || cleanEmail.includes("bogineni")) {
      return "Chaithanya Bogineni";
    }
    if (cleanEmail === "hpapjteam@gmail.com") {
      return "HP APJ QA Team";
    }

    const localPart = cleanEmail.split("@")[0];
    if (localPart) {
      const parts = localPart.split(/[._\-\d]+/).filter(Boolean);
      if (parts.length > 0) {
        return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
      }
    }
  }

  return "";
}

/**
 * Helper to normalize callout items into CalloutItem[]
 */
function normalizeCalloutItems(items?: Array<string | CalloutItem> | string): CalloutItem[] {
  const result: CalloutItem[] = [];
  if (Array.isArray(items)) {
    items.forEach(c => {
      if (typeof c === 'string') {
        const clean = c.trim();
        if (clean) result.push({ text: clean });
      } else if (c && typeof c === 'object' && c.text) {
        const clean = c.text.trim();
        if (clean) {
          result.push({
            text: clean,
            screenshot: c.screenshot && c.screenshot.dataUrl ? c.screenshot : undefined
          });
        }
      }
    });
  } else if (typeof items === 'string' && items.trim()) {
    items.split('\n').forEach(line => {
      const clean = line.replace(/^[•\-\*]\s*/, '').trim();
      if (clean) result.push({ text: clean });
    });
  }
  return result;
}

/**
 * Clean, Dynamic, and Branded Zeta QA Approval Email Template
 * Supports rendering screenshots directly BELOW bullet points as requested by user,
 * plus standalone screenshots below the callouts list.
 */
export const cqaApprovalEmailTemplate = (options: CQAApprovalEmailOptions) => {
  const {
    recipientName = "",
    senderName = "Cbogineni",
    assignedQaName,
    loggedInUserName,
    feedback = "",
    callouts = [],
    ownerCallouts,
    clientCallouts,
    isApproved = true,
    screenshots = [],
    qaType = "CQA"
  } = options;

  // Dynamically resolve greeting name, replacing static "QA User" placeholder
  const rawRecipient = (recipientName || "").trim();
  const isGeneric = !rawRecipient || /^qa\s*user$/i.test(rawRecipient) || /^user$/i.test(rawRecipient);
  const cleanRecipientName = (!isGeneric && rawRecipient)
    ? rawRecipient
    : ((assignedQaName && !/^qa\s*user$/i.test(assignedQaName.trim())) ? assignedQaName.trim()
      : ((loggedInUserName && !/^qa\s*user$/i.test(loggedInUserName.trim())) ? loggedInUserName.trim()
        : "Campaign Reviewer"));

  const normalizedQaType = (qaType || "CQA").trim();

  // Normalize owner callouts (prefer explicit ownerCallouts, fallback to callouts)
  const normalizedOwnerCallouts = normalizeCalloutItems(ownerCallouts !== undefined ? ownerCallouts : callouts);
  const normalizedClientCallouts = normalizeCalloutItems(clientCallouts);

  // Standalone general screenshots
  const validStandaloneScreenshots = Array.isArray(screenshots) ? screenshots.filter(s => s && s.dataUrl) : [];

  const renderBulletList = (items: CalloutItem[]) => `
    <ul style="margin: 0; padding-left: 20px; color: #1e293b; font-size: 14.5px; line-height: 1.6;">
      ${items.map(item => `
        <li style="margin-bottom: ${item.screenshot ? '16px' : '6px'}; list-style-type: disc;">
          <div style="font-weight: 500; color: #1e293b;">
            ${escapeHtml(item.text)}
          </div>
          ${item.screenshot ? `
          <div style="margin-top: 8px; margin-bottom: 4px; padding: 8px; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; display: inline-block; max-width: 100%; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
            ${item.screenshot.caption ? `
            <div style="font-size: 11px; font-weight: 600; color: #475569; margin-bottom: 6px;">
              ${escapeHtml(item.screenshot.caption)}
            </div>` : ''}
            <img src="${item.screenshot.dataUrl}" alt="${escapeHtml(item.screenshot.name || 'Callout screenshot')}" style="display: block; max-width: 100%; max-height: 280px; height: auto; border-radius: 4px; border: 1px solid #e2e8f0;" />
          </div>
          ` : ''}
        </li>
      `).join('')}
    </ul>
  `;

  // Owner callouts box
  const ownerCalloutsHtml = normalizedOwnerCallouts.length > 0 ? `
    <div style="margin: 20px 0 16px 0; padding: 16px 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #0A05B0; border-radius: 8px;">
      <p style="margin: 0 0 10px 0; font-size: 15px; font-weight: 700; color: #0A05B0;">
        Callouts for Campaign Owner:
      </p>
      ${renderBulletList(normalizedOwnerCallouts)}
    </div>` : '';

  // Client callouts box
  const clientCalloutsHtml = normalizedClientCallouts.length > 0 ? `
    <div style="margin: 20px 0 16px 0; padding: 16px 20px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #16a34a; border-radius: 8px;">
      <p style="margin: 0 0 10px 0; font-size: 15px; font-weight: 700; color: #16a34a;">
        Client Callouts:
      </p>
      ${renderBulletList(normalizedClientCallouts)}
    </div>` : '';

  // Standalone screenshots box
  const standaloneScreenshotsHtml = validStandaloneScreenshots.length > 0 ? `
    <div style="margin: 20px 0 16px 0; padding: 16px 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
      <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #475569;">
        Attached Callout Screenshots (${validStandaloneScreenshots.length}):
      </p>
      ${validStandaloneScreenshots.map((s, idx) => `
        <div style="margin-bottom: 12px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background-color: #ffffff; padding: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          ${s.caption ? `<div style="font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 6px;">${escapeHtml(s.caption)}</div>` : ''}
          <img src="${s.dataUrl}" alt="${escapeHtml(s.name || `Callout Screenshot ${idx + 1}`)}" style="display: block; max-width: 100%; height: auto; border-radius: 6px; border: 1px solid #cbd5e1;" />
        </div>
      `).join('')}
    </div>` : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #111827; margin: 0; padding: 24px; background-color: #ffffff;">
  <div style="max-width: 640px; margin: 0; font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #111827;">
    
    <p style="margin: 0 0 18px 0; font-size: 15px; color: #111827;">
      Hi ${escapeHtml(cleanRecipientName)} ,
    </p>

    ${isApproved ? `
    <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 700; color: #111827;">
      ${escapeHtml(normalizedQaType)} Approved!
    </p>

    <p style="margin: 0 0 18px 0; font-size: 15px; color: #374151;">
      Check list uploaded to OneDrive
    </p>` : ''}

${ownerCalloutsHtml}
${clientCalloutsHtml}
${standaloneScreenshotsHtml}
    <p style="margin: 18px 0 4px 0; font-size: 15px; color: #111827;">
      Thanks!
    </p>

    <p style="margin: 0; font-size: 15px; font-weight: 600; color: #111827;">
      ${escapeHtml(senderName)}
    </p>
  </div>
</body>
</html>`;
};

export const cqaApprovalEmailText = (options: {
  recipientName?: string;
  senderName?: string;
  assignedQaName?: string;
  loggedInUserName?: string;
  feedback?: string;
  callouts?: Array<string | CalloutItem> | string;
  ownerCallouts?: Array<string | CalloutItem> | string;
  clientCallouts?: Array<string | CalloutItem> | string;
  isApproved?: boolean;
  screenshots?: CalloutScreenshotItem[];
  qaType?: string;
}) => {
  const {
    recipientName = "",
    senderName = "Cbogineni",
    assignedQaName,
    loggedInUserName,
    callouts = [],
    ownerCallouts,
    clientCallouts,
    isApproved = true,
    screenshots = [],
    qaType = "CQA"
  } = options;

  // Dynamically resolve greeting name, replacing static 'QA User' placeholder
  const rawRecipient = (recipientName || "").trim();
  const isGeneric = !rawRecipient || /^qa\s*user$/i.test(rawRecipient) || /^user$/i.test(rawRecipient);
  const cleanRecipientName = (!isGeneric && rawRecipient)
    ? rawRecipient
    : ((assignedQaName && !/^qa\s*user$/i.test(assignedQaName.trim())) ? assignedQaName.trim()
      : ((loggedInUserName && !/^qa\s*user$/i.test(loggedInUserName.trim())) ? loggedInUserName.trim()
        : "Campaign Reviewer"));

  const normalizedQaType = (qaType || "CQA").trim();

  const normalizedOwnerCallouts = normalizeCalloutItems(ownerCallouts !== undefined ? ownerCallouts : callouts);
  const normalizedClientCallouts = normalizeCalloutItems(clientCallouts);

  const ownerSection = normalizedOwnerCallouts.length > 0
    ? `\n\nCallouts for Campaign Owner:\n` + normalizedOwnerCallouts.map(item => {
        let line = `• ${item.text}`;
        if (item.screenshot) {
          line += `\n  [Screenshot: ${item.screenshot.caption || item.screenshot.name || 'Image attached'}]`;
        }
        return line;
      }).join('\n')
    : "";

  const clientSection = normalizedClientCallouts.length > 0
    ? `\n\nClient Callouts:\n` + normalizedClientCallouts.map(item => {
        let line = `• ${item.text}`;
        if (item.screenshot) {
          line += `\n  [Screenshot: ${item.screenshot.caption || item.screenshot.name || 'Image attached'}]`;
        }
        return line;
      }).join('\n')
    : "";

  const validScreenshots = Array.isArray(screenshots) ? screenshots.filter(s => s && s.dataUrl) : [];
  const screenshotsBlock = validScreenshots.length > 0
    ? `\n\n[Attached: ${validScreenshots.length} Additional Callout Screenshot(s)]`
    : "";

  const approvalBlock = isApproved
    ? `\n\n${normalizedQaType} Approved!\nCheck list uploaded to OneDrive`
    : "";

  return `Hi ${cleanRecipientName} ,${approvalBlock}${ownerSection}${clientSection}${screenshotsBlock}

Thanks!
${senderName}`;
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
      You have been invited to access the <strong>Zeta QA Platform</strong> by an administrator.
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

  return emailTemplate("Welcome to Zeta QA Platform", content, inviteUrl, "Accept Invitation & Set Password", "PLATFORM INVITATION");
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
      We received a request to reset the password for your <strong>Zeta QA Platform</strong> account (<code>${escapeHtml(email)}</code>).
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
      An administrator has generated a direct account setup link for your <strong>Zeta QA Platform</strong> profile.
    </p>

    <p style="margin: 0 0 10px 0; font-size: 14px; color: #475569; line-height: 1.6;">
      Please click the button below to initialize your credentials and access the verification dashboard:
    </p>
  `;

  return emailTemplate("Account Credentials Setup", content, setupUrl, "Set Up My Password", "CREDENTIAL SETUP");
};
