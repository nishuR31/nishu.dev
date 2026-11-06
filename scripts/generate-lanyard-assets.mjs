import fs from "fs";
import path from "path";
import sharp from "sharp";
import QRCode from "qrcode";

const WIDTH = 1024;
const HEIGHT = 1440;

async function generateAssets() {
  console.log("Generating high-legibility Lanyard Card assets...");

  // 1. Generate crisp QR Code for socials
  const qrBuffer = await QRCode.toBuffer("https://nishudevportfolio.vercel.app/socials", {
    width: 460,
    margin: 2,
    color: {
      dark: "#0b0c10",
      light: "#ffffff",
    },
    errorCorrectionLevel: "H",
  });

  // 2. Prepare high-definition, razor-sharp portrait image from public/iitSitting.avif
  const portraitPath = path.resolve("public/iitSitting.avif");
  const portraitSize = 530;
  
  // Studio backdrop gradient behind portrait cutout
  const portraitBackdrop = Buffer.from(`
    <svg width="${portraitSize}" height="${portraitSize}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="portraitGlow" cx="50%" cy="36%" r="68%">
          <stop offset="0%" stop-color="#2d374f" />
          <stop offset="50%" stop-color="#161c28" />
          <stop offset="100%" stop-color="#0a0c12" />
        </radialGradient>
      </defs>
      <rect width="${portraitSize}" height="${portraitSize}" rx="28" fill="url(#portraitGlow)" />
    </svg>
  `);

  // Mask for rounded corners
  const portraitMask = Buffer.from(
    `<svg width="${portraitSize}" height="${portraitSize}">
      <rect x="0" y="0" width="${portraitSize}" height="${portraitSize}" rx="28" ry="28" fill="#fff" />
    </svg>`
  );

  // Subtle inner glass edge border
  const innerBorder = Buffer.from(`
    <svg width="${portraitSize}" height="${portraitSize}" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="${portraitSize - 2}" height="${portraitSize - 2}" rx="27" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2" />
    </svg>
  `);

  // Crop directly to head & upper shoulders (ignoring top 150px transparent margin)
  // Apply Lanczos3 high-quality kernel downsampling, unsharp mask sharpening, and tone vibrancy
  const croppedPortrait = await sharp(portraitPath)
    .extract({ left: 110, top: 155, width: 780, height: 780 })
    .resize(portraitSize, portraitSize, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 1.15, m1: 1.35, m2: 0.5 })
    .modulate({ brightness: 1.04, saturation: 1.12 })
    .png()
    .toBuffer();

  const roundedPortrait = await sharp(portraitBackdrop)
    .composite([
      { input: croppedPortrait, top: 0, left: 0 },
      { input: innerBorder, top: 0, left: 0 },
      { input: portraitMask, blend: "dest-in" },
    ])
    .png()
    .toBuffer();

  // 3. Card Front SVG overlay with significantly larger, crisp typography
  const frontSvg = Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0e1014" />
          <stop offset="45%" stop-color="#141720" />
          <stop offset="100%" stop-color="#0a0b0e" />
        </linearGradient>
        <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f97316" />
          <stop offset="100%" stop-color="#ea580c" />
        </linearGradient>
        <pattern id="cardGrid" width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(255,255,255,0.035)" stroke-width="1.2"/>
        </pattern>
      </defs>

      <!-- Background -->
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)" />
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#cardGrid)" />

      <!-- Top Border Accent Line -->
      <rect x="40" y="24" width="${WIDTH - 80}" height="3" fill="url(#orangeGrad)" opacity="0.8" />

      <!-- Slot Clearance Area Indicator -->
      <rect x="412" y="48" width="200" height="42" rx="21" fill="none" stroke="rgba(255,255,255,0.16)" stroke-dasharray="6,4" />
      <text x="512" y="74" font-family="monospace" font-size="13" font-weight="700" fill="rgba(255,255,255,0.4)" text-anchor="middle" letter-spacing="3">LANYARD CLIP</text>

      <!-- Header Information (Bigger, bolder) -->
      <g transform="translate(60, 142)">
        <text x="0" y="0" font-family="monospace" font-size="20" font-weight="800" fill="#f97316" letter-spacing="4">NISHU.DEV // PASS</text>
        <rect x="650" y="-24" width="250" height="34" rx="8" fill="rgba(16,185,129,0.16)" stroke="rgba(16,185,129,0.45)" stroke-width="1.5" />
        <circle cx="674" cy="-7" r="6" fill="#10b981" />
        <text x="694" y="-1" font-family="monospace" font-size="15" font-weight="800" fill="#10b981" letter-spacing="2">VERIFIED • DEV</text>
        <text x="0" y="42" font-family="sans-serif" font-size="44" font-weight="900" fill="#ffffff" letter-spacing="-0.5">Software Engineer</text>
        <text x="0" y="76" font-family="monospace" font-size="17" font-weight="600" fill="#94a3b8" letter-spacing="1.5">ID: NR-2026-X89 // ALL ACCESS</text>
      </g>

      <!-- Portrait Frame Backdrop Glow -->
      <rect x="${(WIDTH - portraitSize) / 2 - 8}" y="246" width="${portraitSize + 16}" height="${portraitSize + 16}" rx="34" fill="none" stroke="#f97316" stroke-width="3" opacity="0.6" />
      <rect x="${(WIDTH - portraitSize) / 2 - 18}" y="236" width="${portraitSize + 36}" height="${portraitSize + 36}" rx="42" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />

      <!-- Info Below Portrait (Large & prominent) -->
      <g transform="translate(0, 840)">
        <text x="512" y="0" font-family="sans-serif" font-size="54" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">NISHAN RAJAK</text>
        <text x="512" y="44" font-family="monospace" font-size="24" font-weight="800" fill="#f97316" text-anchor="middle" letter-spacing="3">@nishuR31 • BACKEND ARCHITECT</text>
        <text x="512" y="86" font-family="sans-serif" font-size="22" font-weight="500" fill="#cbd5e1" text-anchor="middle" letter-spacing="0.5">Distributed Systems • Robust APIs • Cloud Architecture</text>
      </g>

      <!-- Tags Pills (Larger, more readable) -->
      <g transform="translate(76, 960)">
        <!-- Tag 1 -->
        <rect x="0" y="0" width="160" height="48" rx="10" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" />
        <text x="80" y="31" font-family="monospace" font-size="18" font-weight="700" fill="#ffffff" text-anchor="middle">Node.js</text>
        <!-- Tag 2 -->
        <rect x="178" y="0" width="160" height="48" rx="10" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" />
        <text x="258" y="31" font-family="monospace" font-size="18" font-weight="700" fill="#ffffff" text-anchor="middle">TypeScript</text>
        <!-- Tag 3 -->
        <rect x="356" y="0" width="160" height="48" rx="10" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" />
        <text x="436" y="31" font-family="monospace" font-size="18" font-weight="700" fill="#ffffff" text-anchor="middle">MongoDB</text>
        <!-- Tag 4 -->
        <rect x="534" y="0" width="160" height="48" rx="10" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" />
        <text x="614" y="31" font-family="monospace" font-size="18" font-weight="700" fill="#ffffff" text-anchor="middle">Postgres</text>
        <!-- Tag 5 -->
        <rect x="712" y="0" width="160" height="48" rx="10" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" />
        <text x="792" y="31" font-family="monospace" font-size="18" font-weight="700" fill="#ffffff" text-anchor="middle">Redis</text>
      </g>

      <!-- Bottom Barcode & Tech Specs -->
      <g transform="translate(60, 1055)">
        <line x1="0" y1="0" x2="${WIDTH - 120}" y2="0" stroke="rgba(255,255,255,0.16)" stroke-width="1.5" />
        
        <!-- Simulated Barcode -->
        <g transform="translate(0, 24)">
          <rect x="0" y="0" width="6" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="11" y="0" width="4" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="20" y="0" width="10" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="35" y="0" width="5" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="45" y="0" width="12" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="62" y="0" width="4" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="71" y="0" width="8" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="84" y="0" width="14" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="103" y="0" width="5" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="113" y="0" width="9" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="127" y="0" width="5" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="137" y="0" width="11" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="153" y="0" width="4" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="162" y="0" width="7" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="174" y="0" width="10" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="189" y="0" width="5" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="199" y="0" width="12" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="216" y="0" width="6" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="227" y="0" width="10" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="242" y="0" width="4" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="251" y="0" width="8" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="264" y="0" width="14" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="283" y="0" width="5" height="60" fill="#ffffff" opacity="0.9"/>
          <rect x="293" y="0" width="7" height="60" fill="#ffffff" opacity="0.9"/>
          <text x="0" y="85" font-family="monospace" font-size="15" font-weight="700" fill="rgba(255,255,255,0.5)" letter-spacing="3">AUTH-HASH: 993-NR-2026-PROD</text>
        </g>

        <!-- Right Side Architecture / Credentials -->
        <g transform="translate(560, 24)">
          <text x="340" y="24" font-family="monospace" font-size="18" font-weight="800" fill="#ffffff" text-anchor="end" letter-spacing="2">FULL STACK &amp; BACKEND</text>
          <text x="340" y="52" font-family="monospace" font-size="16" font-weight="600" fill="#f97316" text-anchor="end" letter-spacing="1.5">DISTRIBUTED SYSTEMS • APIS</text>
          <text x="340" y="80" font-family="monospace" font-size="15" font-weight="700" fill="#38bdf8" text-anchor="end" letter-spacing="1">CLICK TO FLIP • SCAN QR ↗</text>
        </g>
      </g>

      <!-- Bottom Glow Line -->
      <rect x="40" y="${HEIGHT - 36}" width="${WIDTH - 80}" height="3" fill="url(#orangeGrad)" opacity="0.6" />
    </svg>
  `);

  // Build Card Front
  await sharp(frontSvg)
    .composite([
      {
        input: roundedPortrait,
        top: 254,
        left: (WIDTH - portraitSize) / 2,
      },
    ])
    .png()
    .toFile("public/card-front.png");
  console.log("✓ Created high-legibility public/card-front.png");

  // 4. Card Back SVG overlay (with QR code plate and large clear contact details)
  const qrPlateSize = 510;
  const backSvg = Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradBack" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0a0c0f" />
          <stop offset="50%" stop-color="#12151c" />
          <stop offset="100%" stop-color="#07080a" />
        </linearGradient>
        <linearGradient id="orangeGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f97316" />
          <stop offset="100%" stop-color="#ea580c" />
        </linearGradient>
        <pattern id="cardGridBack" width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(255,255,255,0.035)" stroke-width="1.2"/>
        </pattern>
      </defs>

      <!-- Background -->
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGradBack)" />
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#cardGridBack)" />

      <!-- Top Border Accent Line -->
      <rect x="40" y="24" width="${WIDTH - 80}" height="3" fill="url(#orangeGrad2)" opacity="0.8" />

      <!-- Slot Clearance Area Indicator -->
      <rect x="412" y="48" width="200" height="42" rx="21" fill="none" stroke="rgba(255,255,255,0.16)" stroke-dasharray="6,4" />
      <text x="512" y="74" font-family="monospace" font-size="13" font-weight="700" fill="rgba(255,255,255,0.4)" text-anchor="middle" letter-spacing="3">LANYARD CLIP</text>

      <!-- Header Information (Big, bold) -->
      <g transform="translate(0, 150)">
        <text x="512" y="0" font-family="monospace" font-size="24" font-weight="800" fill="#f97316" text-anchor="middle" letter-spacing="5">SCAN TO CONNECT</text>
        <text x="512" y="46" font-family="sans-serif" font-size="46" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="-0.5">Let’s Build Together.</text>
        <text x="512" y="86" font-family="sans-serif" font-size="22" font-weight="500" fill="#cbd5e1" text-anchor="middle">Scan this QR code with any camera to open my socials page</text>
      </g>

      <!-- QR Frame & Backing -->
      <rect x="${(WIDTH - qrPlateSize) / 2 - 10}" y="260" width="${qrPlateSize + 20}" height="${qrPlateSize + 20}" rx="36" fill="none" stroke="#f97316" stroke-width="3" opacity="0.7" />
      <rect x="${(WIDTH - qrPlateSize) / 2}" y="270" width="${qrPlateSize}" height="${qrPlateSize}" rx="26" fill="#ffffff" />

      <!-- Link URL Under QR -->
      <g transform="translate(0, 840)">
        <rect x="182" y="-8" width="660" height="54" rx="12" fill="rgba(249,115,22,0.14)" stroke="rgba(249,115,22,0.4)" stroke-width="1.5" />
        <text x="512" y="27" font-family="monospace" font-size="22" font-weight="800" fill="#f97316" text-anchor="middle" letter-spacing="1.5">https://nishudevportfolio.vercel.app/socials</text>
      </g>

      <!-- Socials Details Grid (Larger icons and texts) -->
      <g transform="translate(90, 950)">
        <!-- GitHub Row -->
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="400" height="84" rx="14" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
          <circle cx="44" cy="42" r="24" fill="rgba(249,115,22,0.15)" />
          <text x="44" y="49" font-family="monospace" font-size="18" font-weight="800" fill="#f97316" text-anchor="middle">&lt;/&gt;</text>
          <text x="82" y="34" font-family="monospace" font-size="14" font-weight="700" fill="#94a3b8" letter-spacing="2">GITHUB REPO</text>
          <text x="82" y="58" font-family="sans-serif" font-size="22" font-weight="700" fill="#ffffff">github.com/nishuR31</text>
        </g>

        <!-- LinkedIn Row -->
        <g transform="translate(444, 0)">
          <rect x="0" y="0" width="400" height="84" rx="14" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
          <circle cx="44" cy="42" r="24" fill="rgba(56,189,248,0.15)" />
          <text x="44" y="49" font-family="monospace" font-size="18" font-weight="800" fill="#38bdf8" text-anchor="middle">in</text>
          <text x="82" y="34" font-family="monospace" font-size="14" font-weight="700" fill="#94a3b8" letter-spacing="2">LINKEDIN</text>
          <text x="82" y="58" font-family="sans-serif" font-size="22" font-weight="700" fill="#ffffff">linkedin.com/in/nishuR31</text>
        </g>

        <!-- Email Row -->
        <g transform="translate(0, 108)">
          <rect x="0" y="0" width="400" height="84" rx="14" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
          <circle cx="44" cy="42" r="24" fill="rgba(16,185,129,0.15)" />
          <text x="44" y="49" font-family="monospace" font-size="18" font-weight="800" fill="#10b981" text-anchor="middle">@</text>
          <text x="82" y="34" font-family="monospace" font-size="14" font-weight="700" fill="#94a3b8" letter-spacing="2">DIRECT EMAIL</text>
          <text x="82" y="58" font-family="sans-serif" font-size="20" font-weight="700" fill="#ffffff">nishan.developer.dev</text>
        </g>

        <!-- Instant Connect Row -->
        <g transform="translate(444, 108)">
          <rect x="0" y="0" width="400" height="84" rx="14" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
          <circle cx="44" cy="42" r="24" fill="rgba(245,158,11,0.15)" />
          <text x="44" y="49" font-family="monospace" font-size="18" font-weight="800" fill="#f59e0b" text-anchor="middle">★</text>
          <text x="82" y="34" font-family="monospace" font-size="14" font-weight="700" fill="#94a3b8" letter-spacing="2">FAST CHAT</text>
          <text x="82" y="58" font-family="sans-serif" font-size="22" font-weight="700" fill="#ffffff">Discord • Telegram • X</text>
        </g>
      </g>

      <!-- Footer Note -->
      <g transform="translate(0, 1200)">
        <line x1="60" y1="0" x2="${WIDTH - 60}" y2="0" stroke="rgba(255,255,255,0.16)" stroke-width="1.5" />
        <text x="512" y="42" font-family="monospace" font-size="16" font-weight="700" fill="rgba(255,255,255,0.5)" text-anchor="middle" letter-spacing="3">DIGITAL IDENTITY BADGE • TAP CARD TO FLIP</text>
      </g>

      <!-- Bottom Glow Line -->
      <rect x="40" y="${HEIGHT - 36}" width="${WIDTH - 80}" height="3" fill="url(#orangeGrad2)" opacity="0.6" />
    </svg>
  `);

  // Build Card Back
  await sharp(backSvg)
    .composite([
      {
        input: qrBuffer,
        top: 295,
        left: (WIDTH - 460) / 2,
      },
    ])
    .png()
    .toFile("public/card-back.png");
  console.log("✓ Created high-legibility public/card-back.png");

  // 5. Generate Strap / Band Texture (public/band.png: 192 x 768)
  const bandWidth = 192;
  const bandHeight = 768;
  const bandSvg = Buffer.from(`
    <svg width="${bandWidth}" height="${bandHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0a0a0c" />
          <stop offset="10%" stop-color="#181a20" />
          <stop offset="90%" stop-color="#181a20" />
          <stop offset="100%" stop-color="#0a0a0c" />
        </linearGradient>
      </defs>

      <!-- Base Strap -->
      <rect width="${bandWidth}" height="${bandHeight}" fill="url(#bandGrad)" />

      <!-- Edge Stitching Lines -->
      <line x1="14" y1="0" x2="14" y2="${bandHeight}" stroke="#f97316" stroke-width="4" opacity="0.85" />
      <line x1="178" y1="0" x2="178" y2="${bandHeight}" stroke="#f97316" stroke-width="4" opacity="0.85" />

      <!-- Repeated Vertical Text Pattern -->
      <g fill="#ffffff" opacity="0.9" font-family="monospace" font-size="20" font-weight="800" letter-spacing="4">
        <text transform="translate(102, 60) rotate(90)" text-anchor="middle">NISHAN RAJAK</text>
        <text transform="translate(102, 190) rotate(90)" fill="#f97316" text-anchor="middle">★ NISHU.DEV ★</text>
        <text transform="translate(102, 320) rotate(90)" text-anchor="middle">BACKEND ARCHITECT</text>
        <text transform="translate(102, 450) rotate(90)" text-anchor="middle">NISHAN RAJAK</text>
        <text transform="translate(102, 580) rotate(90)" fill="#f97316" text-anchor="middle">★ NISHU.DEV ★</text>
        <text transform="translate(102, 710) rotate(90)" text-anchor="middle">BACKEND ARCHITECT</text>
      </g>
    </svg>
  `);

  await sharp(bandSvg).png().toFile("public/band.png");
  console.log("✓ Created high-legibility public/band.png");
  console.log("All Lanyard assets successfully updated!");
}

generateAssets().catch(err => {
  console.error("Error generating assets:", err);
  process.exit(1);
});
