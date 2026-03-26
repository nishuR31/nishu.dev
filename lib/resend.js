import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logoPath = path.resolve(__dirname, "../public/logo.png");

let resendClient = null;

function getResendClient() {
  if (resendClient) return resendClient;
  const key = process.env.RESEND_API;
  if (!key) {
    throw new Error("RESEND_API is not configured");
  }
  resendClient = new Resend(key);
  return resendClient;
}

// helper for logo
function getLogo() {
  return fs.existsSync(logoPath) ?
      `data:image/png;base64,${fs.readFileSync(logoPath, "base64")}`
    : null;
}

// ========================
// MAIN CONTACT EMAIL
// ========================
export async function sendResendEmail(data) {
  const { name, email, message, submittedAt } = data;

  const to = process.env.MAIL_TO || process.env.MAIL_USER;
  if (!to) throw new Error("MAIL_TO or MAIL_USER is not configured");

  const logoData = getLogo();

  const html = `
<div style="margin:0;padding:0;background:#050505;font-family:Inter,Segoe UI,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 12px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0"
          style="
            max-width:560px;
            background:linear-gradient(145deg,#0d0d0d,#111111);
            border-radius:16px;
            overflow:hidden;
            border:1px solid #1f1f1f;
            box-shadow:0 10px 30px rgba(0,0,0,0.6);
          ">

          <!-- Header -->
          <tr>
            <td style="padding:18px 20px;background:linear-gradient(90deg,#111827,#1f2937);border-bottom:1px solid #2a2a2a;">
              <table>
                <tr>
                  <td>
                    ${logoData ? `<img src="${logoData}" width="36" height="36" style="border-radius:8px;" />` : ""}
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

          <!-- Body -->
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

              <div style="font-size:12px;color:#9ca3af;margin-bottom:6px;">
                Message
              </div>

              <div style="background:#0a0a0a;border:1px solid #222;border-radius:12px;padding:14px;font-size:14px;color:#d1d5db;line-height:1.6;">
                ${message}
              </div>

              <div style="text-align:center;margin-top:24px;">
                <a href="https://nishudevportfolio.vercel.app"
                  style="display:inline-block;padding:11px 26px;font-size:13px;font-weight:600;color:#fff;text-decoration:none;border-radius:8px;background:linear-gradient(190deg,#111,#666);">
                  Visit Portfolio →
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:14px;text-align:center;font-size:11px;color:#6b7280;background:#0a0a0a;border-top:1px solid #1f1f1f;">
              © ${new Date().getFullYear()} Nishan Rajak • Built for scale
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</div>
`;

  const client = getResendClient();
  return client.emails.send({
    from: process.env.RESEND_FROM || process.env.MAIL_USER,
    to,
    subject: `New portfolio contact from ${name}`,
    html,
  });
}

// ========================
// AUTO RESPONDER
// ========================
export async function sendAutoResponder(data) {
  const { name, email } = data;

  const logoData = getLogo();

  const html = `
<div style="margin:0;padding:0;background:#050505;font-family:Inter,Segoe UI,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 12px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width:520px;background:linear-gradient(145deg,#0d0d0d,#111111);
          border-radius:16px;border:1px solid #1f1f1f;">

          <tr>
            <td style="padding:18px 20px;background:linear-gradient(90deg,#111827,#1f2937);border-bottom:1px solid #2a2a2a;">
              <table>
                <tr>
                  <td>
                    ${logoData ? `<img src="${logoData}" width="36" height="36" style="border-radius:8px;" />` : ""}
                  </td>
                  <td style="padding-left:12px;">
                    <div style="font-size:14px;font-weight:700;color:#f9fafb;">
                      Nishan Rajak
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:22px;">
              <div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:16px;">
                Message Received 🚀
              </div>

              <div style="font-size:14px;color:#9ca3af;line-height:1.7;margin-bottom:18px;">
                Hey ${name},<br><br>
                Your message has been received. I’ll review it and get back shortly.
                <br><br>
                Expect a clean and structured response.
              </div>

              <div style="padding:14px;background:#0a0a0a;border:1px solid #222;border-radius:12px;
              font-size:13px;color:#d1d5db;margin-bottom:20px;">
                ⚡ Response: within 24h<br>
                🔒 Data is secure
              </div>

              <div style="text-align:center;">
                <a href="https://nishudevportfolio.vercel.app"
                  style="display:inline-block;padding:11px 26px;font-size:13px;font-weight:600;
                  color:#fff;text-decoration:none;border-radius:8px;background:linear-gradient(190deg,#111,#666);">
                  Visit Portfolio →
                </a>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:14px;text-align:center;font-size:11px;color:#6b7280;background:#0a0a0a;border-top:1px solid #1f1f1f;">
              © ${new Date().getFullYear()} Nishan Rajak
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</div>
`;

  const client = getResendClient();
  return client.emails.send({
    from: process.env.RESEND_FROM || process.env.MAIL_USER,
    to: email,
    subject: "Message received • Nishan Rajak",
    html,
  });
}

// ========================
// 🔥 MAIN CALLER (THIS IS IMPORTANT)
// ========================
export function fireContactAndAutoEmail(data) {
  // ❌ DO NOT await here
  sendResendEmail(data).catch((err) =>
    console.error("contact mail failed:", err.message),
  );

  sendAutoResponder(data).catch((err) =>
    console.error("auto mail failed:", err.message),
  );
}
