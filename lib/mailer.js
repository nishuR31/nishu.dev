import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

let transporter;
// ESM-compatible way to get the logo path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logoPath = path.resolve(__dirname, "../public/logo.png");

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

  const html = `
  <div
    style="
      margin: 0;
      padding: 0;
      background: #050505;
      font-family:
        Inter,
        Segoe UI,
        Arial,
        sans-serif;
    "
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="padding: 20px 12px"
    >
      <tr>
        <td align="center">
          <!-- Container -->
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
              max-width: 540px;
              background: linear-gradient(145deg, #0d0d0d, #111111);
              border-radius: 16px;
              overflow: hidden;
              border: 1px solid #1f1f1f;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
            "
          >
            <!-- Header -->
            <tr>
              <td
                style="
                  padding: 18px 20px;
                  background: linear-gradient(90deg, #111827, #1f2937);
                  border-bottom: 1px solid #2a2a2a;
                "
              >
                <table>
                  <tr>
                    <td>
                      <img
                        src="cid:app-logo"
                        width="36"
                        height="36"
                        style="
                          border-radius: 8px;
                          display: block;
                          box-shadow: 0 0 8px rgba(255, 255, 255, 0.1);
                        "
                      />
                    </td>
                    <td style="padding-left: 12px">
                      <div
                        style="
                          font-size: 14px;
                          font-weight: 700;
                          color: #f9fafb;
                          letter-spacing: 0.3px;
                        "
                      >
                        Nishan Rajak
                      </div>
                      <div style="font-size: 11px; color: #9ca3af">
                        Portfolio Contact
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 22px">
                <!-- Title -->
                <div
                  style="
                    font-size: 18px;
                    font-weight: 700;
                    color: #ffffff;
                    margin-bottom: 18px;
                  "
                >
                  New Contact Message
                </div>

                <!-- Info Cards -->
                <div style="margin-bottom: 18px">
                  <!-- Name -->
                  <div
                    style="
                      margin-bottom: 10px;
                      padding: 10px 12px;
                      background: #0f0f0f;
                      border: 1px solid #222;
                      border-radius: 10px;
                    "
                  >
                    <div style="font-size: 11px; color: #6b7280">Name</div>
                    <div
                      style="font-size: 14px; font-weight: 600; color: #e5e7eb"
                    >
                      ${name}
                    </div>
                  </div>

                  <!-- Email -->
                  <div
                    style="
                      margin-bottom: 10px;
                      padding: 10px 12px;
                      background: #0f0f0f;
                      border: 1px solid #222;
                      border-radius: 10px;
                    "
                  >
                    <div style="font-size: 11px; color: #6b7280">Email</div>
                    <div
                      style="font-size: 14px; font-weight: 600; color: #e5e7eb"
                    >
                      ${email}
                    </div>
                  </div>

                  <!-- Date -->
                  <div
                    style="
                      padding: 10px 12px;
                      background: #0f0f0f;
                      border: 1px solid #222;
                      border-radius: 10px;
                    "
                  >
                    <div style="font-size: 11px; color: #6b7280">Submitted</div>
                    <div
                      style="font-size: 14px; font-weight: 600; color: #e5e7eb"
                    >
                      ${submittedAt || new Date().toLocaleString()}
                    </div>
                  </div>
                </div>

                <!-- Message -->
                <div
                  style="font-size: 12px; color: #9ca3af; margin-bottom: 6px"
                >
                  Message
                </div>

                <div
                  style="
                    background: #0a0a0a;
                    border: 1px solid #222;
                    border-radius: 12px;
                    padding: 14px;
                    font-size: 14px;
                    color: #d1d5db;
                    line-height: 1.6;
                    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.6);
                  "
                >
                  ${message}
                </div>

                <!-- CTA -->
                <div style="text-align: center; margin-top: 24px">
                  <a
                    href="https://nishudevportfolio.vercel.app"
                    style="
                      display: inline-block;
                      padding: 11px 26px;
                      font-size: 13px;
                      font-weight: 600;
                      color: #ffffff;
                      text-decoration: none;
                      border-radius: 8px;
                      background: linear-gradient(190deg, #111111, #666666);
                      box-shadow: 0 6px 18px rgba(9, 9, 9, 0.4);
                    "
                  >
                    Visit Portfolio →
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="
                  padding: 14px;
                  text-align: center;
                  font-size: 11px;
                  color: #6b7280;
                  background: #0a0a0a;
                  border-top: 1px solid #1f1f1f;
                "
              >
                © ${new Date().getFullYear()} Nishan Rajak • Built with
                precision
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

// add extra logging wrapper to surface send errors in worker logs
// const originalSendContactEmail = sendContactEmail;
// export async function _sendContactEmailLogged(data) {
//   try {
//     console.log(
//       "[Mailer] sending contact email to",
//       process.env.MAIL_TO || process.env.MAIL_USER,
//     );
//     const res = await originalSendContactEmail(data);
//     console.log(
//       "[Mailer] sendMail response:",
//       res && res.response ? res.response : res,
//     );
//     return res;
//   } catch (err) {
//     console.error("[Mailer] sendContactEmail error:", err.message || err);
//     throw err;
//   }
// }

export async function sendAutoResponderEmail({ name, email }) {
  const subject = "Thank you for contacting Nishan Rajak";

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
                      Nishan Rajak
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:20px;">
              <div style="font-size:17px; font-weight:700; color:#111827; margin-bottom:16px;">
                Message Received!
              </div>
              <div style="font-size:14px; color:#374151; line-height:1.6; margin-bottom:16px;">
                Hi ${name},<br><br>
                Thank you for reaching out! I've received your message and will get back to you as soon as possible.
                <br><br>
                Best regards,<br>
                Nishan Rajak
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

  return getTransporter().sendMail({
    from: process.env.MAIL_USER,
    to: email,
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

// wrap senders with logging for diagnostics
const originalSendContactEmail = sendContactEmail;
export async function _sendContactEmailLogged(data) {
  try {
    console.log(
      "[Mailer] sending contact email to",
      process.env.MAIL_TO || process.env.MAIL_USER,
    );
    const res = await originalSendContactEmail(data);
    console.log(
      "[Mailer] contact send response:",
      res && (res.response || res.messageId) ?
        res.response || res.messageId
      : JSON.stringify(res),
    );
    return res;
  } catch (err) {
    console.error(
      "[Mailer] sendContactEmail error:",
      err && err.message ? err.message : err,
    );
    throw err;
  }
}

const originalSendAutoResponder = sendAutoResponderEmail;
export async function _sendAutoResponderLogged(data) {
  try {
    console.log("[Mailer] sending auto-responder to", data.email);
    const res = await originalSendAutoResponder(data);
    console.log(
      "[Mailer] auto-responder response:",
      res && (res.response || res.messageId) ?
        res.response || res.messageId
      : JSON.stringify(res),
    );
    return res;
  } catch (err) {
    console.error(
      "[Mailer] sendAutoResponderEmail error:",
      err && err.message ? err.message : err,
    );
    throw err;
  }
}
