import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

let transporter;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  if (!process.env.MAIL_USER || !process.env.MAIL_APP_PASSWORD) {
    throw new Error("MAIL_USER or MAIL_APP_PASSWORD is missing");
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_APP_PASSWORD,
    },
  });

  return transporter;
}

export async function sendContactEmail({ name, email, message, submittedAt }) {
  const to = process.env.MAIL_TO || process.env.MAIL_USER;

  if (!to) {
    throw new Error("MAIL_TO or MAIL_USER is not configured");
  }

  const subject = `New portfolio contact from ${name}`;

  const html = `<div style="margin:0; padding:0; background:#f8fafc; font-family:Inter,Segoe UI,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:16px;">
    <tr>
      <td align="center">

        <!-- Container -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background:#ffffff; border-radius:14px; overflow:hidden; border:1px solid #e5e7eb;">

          <!-- Header -->
          <tr>
            <td style="padding:18px 20px; border-bottom:1px solid #e5e7eb; background:#f9fafb;">
              <table>
                <tr>
                  <td>
                    <img src="cid:app-logo" width="36" height="36" style="border-radius:6px; display:block;" />
                  </td>
                  <td style="padding-left:10px;">
                    <div style="font-size:15px; font-weight:700; color:#111827;">
                      Nishan Rajak Portfolio
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:20px;">

              <!-- Title -->
              <div style="font-size:17px; font-weight:700; color:#111827; margin-bottom:16px;">
                New Contact Message
              </div>

              <!-- Info (STACKED — mobile first) -->
              <div style="margin-bottom:16px;">
                <div style="margin-bottom:10px;">
                  <div style="font-size:12px; color:#6b7280;">Name</div>
                  <div style="font-size:14px; font-weight:600; color:#111827;">${name}</div>
                </div>

                <div style="margin-bottom:10px;">
                  <div style="font-size:12px; color:#6b7280;">Email</div>
                  <div style="font-size:14px; font-weight:600; color:#111827;">${email}</div>
                </div>

                <div>
                  <div style="font-size:12px; color:#6b7280;">Submitted</div>
                  <div style="font-size:14px; font-weight:600; color:#111827;">
                    ${submittedAt || new Date().toLocaleString()}
                  </div>
                </div>
              </div>

              <!-- Message -->
              <div style="font-size:12px; color:#6b7280; margin-bottom:6px;">
                Message
              </div>

              <div style="background:#f3f4f6; border:1px solid #e5e7eb; border-radius:8px; padding:7px; font-size:14px; color:#111827; line-height:1.5; white-space:pre-wrap;">
                ${message}
              </div>

              <!-- CTA -->
              <div style="text-align:center; margin-top:22px;">
                <a href="https://nishu.portfolio.vercel.app"
                  style="display:inline-block; padding:10px 22px; font-size:13px; font-weight:600; color:#ffffff; background:#111827; border-radius:6px; text-decoration:none;">
                  Visit Portfolio
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:14px; text-align:center; font-size:12px; color:#6b7280; background:#f9fafb; border-top:1px solid #e5e7eb;">
              © ${new Date().getFullYear()} Nishan Rajak
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</div>`;

  // ESM-compatible way to get the logo path
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const logoPath = path.resolve(__dirname, "../public/logo.png");

  return getTransporter().sendMail({
    from: process.env.MAIL_USER,
    to,
    replyTo: email,
    subject,
    html,
    attachments: [
      {
        filename: "logo.png",
        path: logoPath,
        cid: "app-logo",
      },
    ],
  });
}
