import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

let transporter;

// ESM path fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logoPath = path.resolve(__dirname, "../public/logo.png");

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.MAIL_USER || !process.env.MAIL_APP_PASSWORD) {
    throw new Error("MAIL_USER or MAIL_APP_PASSWORD is missing");
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_APP_PASSWORD,
    },
    pool: true,
    maxConnections: 2,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  return transporter;
}

export async function sendContactEmail({ name, email, message, submittedAt }) {
  const to = process.env.MAIL_TO || process.env.MAIL_USER;

  const html = `
  <div style="margin:0;padding:0;background:#050505;font-family:Inter,Segoe UI,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 12px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0"
            style="max-width:540px;background:linear-gradient(145deg,#0d0d0d,#111111);
            border-radius:16px;overflow:hidden;border:1px solid #1f1f1f;
            box-shadow:0 10px 30px rgba(0,0,0,0.6);">

            <tr>
              <td style="padding:18px 20px;background:linear-gradient(90deg,#111827,#1f2937);
              border-bottom:1px solid #2a2a2a;">
                <table>
                  <tr>
                    <td>
                      <img src="cid:app-logo" width="36" height="36" style="border-radius:8px;" />
                    </td>
                    <td style="padding-left:12px;">
                      <div style="font-size:14px;font-weight:700;color:#f9fafb;">
                        Nishan Rajak
                      </div>
                      <div style="font-size:11px;color:#9ca3af;">
                        Portfolio Contact
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:22px;">
                <div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:18px;">
                  New Contact Message
                </div>

                <div style="margin-bottom:18px;">
                  <div style="margin-bottom:10px;padding:10px 12px;background:#0f0f0f;border:1px solid #222;border-radius:10px;">
                    <div style="font-size:11px;color:#6b7280;">Name</div>
                    <div style="font-size:14px;font-weight:600;color:#e5e7eb;">${name}</div>
                  </div>

                  <div style="margin-bottom:10px;padding:10px 12px;background:#0f0f0f;border:1px solid #222;border-radius:10px;">
                    <div style="font-size:11px;color:#6b7280;">Email</div>
                    <div style="font-size:14px;font-weight:600;color:#e5e7eb;">${email}</div>
                  </div>

                  <div style="padding:10px 12px;background:#0f0f0f;border:1px solid #222;border-radius:10px;">
                    <div style="font-size:11px;color:#6b7280;">Submitted</div>
                    <div style="font-size:14px;font-weight:600;color:#e5e7eb;">
                      ${submittedAt || new Date().toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style="font-size:12px;color:#9ca3af;margin-bottom:6px;">Message</div>

                <div style="background:#0a0a0a;border:1px solid #222;border-radius:12px;padding:14px;
                font-size:14px;color:#d1d5db;line-height:1.6;">
                  ${message}
                </div>

                <div style="text-align:center;margin-top:24px;">
                  <a href="https://nishudevportfolio.vercel.app"
                    style="display:inline-block;padding:11px 26px;font-size:13px;font-weight:600;
                    color:#fff;text-decoration:none;border-radius:8px;
                    background:linear-gradient(190deg,#111,#666);">
                    Visit Portfolio →
                  </a>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:14px;text-align:center;font-size:11px;color:#6b7280;
              background:#0a0a0a;border-top:1px solid #1f1f1f;">
                © ${new Date().getFullYear()} Nishan Rajak
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>`;

  return getTransporter().sendMail({
    from: process.env.MAIL_USER,
    to,
    replyTo: email,
    subject: `New portfolio contact from ${name}`,
    html,
    attachments: [{ filename: "logo.png", path: logoPath, cid: "app-logo" }],
  });
}

export async function sendAutoResponderEmail({ name, email }) {
  const html = `
  <div style="margin:0;padding:0;background:#050505;font-family:Inter,Segoe UI,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 12px;">
      <tr>
        <td align="center">

          <table width="100%" cellpadding="0" cellspacing="0"
            style="max-width:520px;background:linear-gradient(145deg,#0d0d0d,#111111);
            border-radius:16px;overflow:hidden;border:1px solid #1f1f1f;">

            <tr>
              <td style="padding:18px 20px;background:linear-gradient(90deg,#111827,#1f2937);
              border-bottom:1px solid #2a2a2a;">
                <table>
                  <tr>
                    <td>
                      <img src="cid:app-logo" width="36" height="36" style="border-radius:8px;" />
                    </td>
                    <td style="padding-left:12px;">
                      <div style="font-size:14px;font-weight:700;color:#f9fafb;">
                        Nishan Rajak
                      </div>
                      <div style="font-size:11px;color:#9ca3af;">
                        Backend Systems Engineer
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:22px;">
                <div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:16px;">
                  Thank you for contacting me!
                </div>

                <div style="font-size:14px;color:#9ca3af;line-height:1.7;margin-bottom:18px;">
                  Hey ${name},<br><br>
                  Your message reached me successfully. I’ll get back to you shortly.
                  <br><br>
                  Expect a structured and thoughtful response.
                </div>

                <div style="padding:14px;background:#0a0a0a;border:1px solid #222;border-radius:12px;
                font-size:13px;color:#d1d5db;margin-bottom:20px;">
                  Response: within 24h<br>
                  Data is secure
                </div>

                <div style="text-align:center;">
                  <a href="https://nishudevportfolio.vercel.app"
                    style="display:inline-block;padding:11px 26px;font-size:13px;font-weight:600;
                    color:#fff;text-decoration:none;border-radius:8px;
                    background:linear-gradient(190deg,#111,#666);">
                    Explore Portfolio →
                  </a>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:14px;text-align:center;font-size:11px;color:#6b7280;
              background:#0a0a0a;border-top:1px solid #1f1f1f;">
                © ${new Date().getFullYear()} Nishan Rajak
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </div>`;

  return getTransporter().sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: "Message received • Nishan Rajak",
    html,
    attachments: [{ filename: "logo.png", path: logoPath, cid: "app-logo" }],
  });
}

/* NON-BLOCKING WRAPPERS (critical for Render) */

export function fireContactAndAutoMail(data) {
  sendContactEmail(data).catch((err) =>
    console.error("[Mailer] contact failed:", err.message),
  );

  sendAutoResponderEmail(data).catch((err) =>
    console.error("[Mailer] auto failed:", err.message),
  );
}
