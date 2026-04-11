// ES module version. Requires: `npm i sharp`
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  const ext = path.extname(file).toLowerCase();
  const basename = path.basename(file, ext);
  try {
    // create .avif at original size
    const outAvif = path.join(path.dirname(file), `${basename}.avif`);
    await sharp(file).avif({ quality: 60 }).toFile(outAvif);
    console.log(
      "Converted:",
      path.relative(publicDir, file),
      "->",
      path.relative(publicDir, outAvif),
    );

    // if this is the logo, also produce resized variants (180 & 84)
    if (basename === "logo") {
      const outAvif180 = path.join(path.dirname(file), `${basename}-180.avif`);
      const outAvif84 = path.join(path.dirname(file), `${basename}-84.avif`);
      await sharp(file)
        .resize(180, 180, { fit: "cover" })
        .avif({ quality: 60 })
        .toFile(outAvif180);
      await sharp(file)
        .resize(84, 84, { fit: "cover" })
        .avif({ quality: 60 })
        .toFile(outAvif84);
      console.log(
        "Created resized logos:",
        path.relative(publicDir, outAvif180),
        path.relative(publicDir, outAvif84),
      );
    }
  } catch (err) {
    console.error("Failed:", file, err.message);
  }
}

async function main() {
  for (const t of targets) {
    if (fs.existsSync(t)) await convert(t);
    else console.warn("Skipping (not found):", path.relative(publicDir, t));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
