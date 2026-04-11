// Requires: npm i sharp
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");
const targets = [
  path.join(publicDir, "homepage.png"),
  path.join(publicDir, "logo.png"),
];

// Add project images
const projectsDir = path.join(publicDir, "projects");
if (fs.existsSync(projectsDir)) {
  const files = fs
    .readdirSync(projectsDir)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
  files.forEach((f) => targets.push(path.join(projectsDir, f)));
}

async function convert(file) {
  const out = file.replace(/\.(png|jpe?g|webp)$/i, ".avif");
  try {
    await sharp(file).avif({ quality: 60 }).toFile(out);
    console.log(
      "Converted:",
      path.relative(publicDir, file),
      "->",
      path.relative(publicDir, out),
    );
  } catch (err) {
    console.error("Failed:", file, err.message);
  }
}

(async () => {
  for (const t of targets) {
    if (fs.existsSync(t)) await convert(t);
    else console.warn("Skipping (not found):", path.relative(publicDir, t));
  }
})();
