// ES module version. Requires: `npm i sharp`
import sharp from "sharp";
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, "..", "public");

// Scan directory recursively to find all files
async function getFilesRecursively(dir) {
  let results = [];
  try {
    const list = await fs.readdir(dir, { withFileTypes: true });
    for (const file of list) {
      const resPath = path.resolve(dir, file.name);
      if (file.isDirectory()) {
        results = results.concat(await getFilesRecursively(resPath));
      } else {
        results.push(resPath);
      }
    }
  } catch (err) {
    console.error(`Error scanning directory ${dir}:`, err.message);
  }
  return results;
}

async function convert(file) {
  const ext = path.extname(file).toLowerCase();
  const basename = path.basename(file, ext);
  const dirName = path.dirname(file);
  const outAvif = path.join(dirName, `${basename}.avif`);

  try {
    const sourceStat = await fs.stat(file);
    let shouldConvert = true;

    try {
      const targetStat = await fs.stat(outAvif);
      if (targetStat.mtime >= sourceStat.mtime) {
        shouldConvert = false;
        console.log(
          `Skipped (up-to-date): ${path.relative(publicDir, file)} -> ${path.relative(publicDir, outAvif)}`,
        );
      }
    } catch (e) {
      // Target file doesn't exist, proceed with conversion
    }

    if (shouldConvert) {
      await sharp(file).avif({ quality: 60 }).toFile(outAvif);
      console.log(
        "Converted:",
        path.relative(publicDir, file),
        "->",
        path.relative(publicDir, outAvif),
      );
    }

    // Special handling for logo resized variants (180 & 84)
    if (basename === "logo") {
      const outAvif180 = path.join(dirName, `${basename}-180.avif`);
      const outAvif84 = path.join(dirName, `${basename}-84.avif`);

      // Check variant 180
      let convert180 = true;
      try {
        const stat180 = await fs.stat(outAvif180);
        if (stat180.mtime >= sourceStat.mtime) convert180 = false;
      } catch (e) {}

      if (convert180) {
        await sharp(file)
          .resize(180, 180, { fit: "cover" })
          .avif({ quality: 60 })
          .toFile(outAvif180);
        console.log("Created/Updated resized logo:", path.relative(publicDir, outAvif180));
      } else {
        console.log("Skipped (up-to-date) resized logo:", path.relative(publicDir, outAvif180));
      }

      // Check variant 84
      let convert84 = true;
      try {
        const stat84 = await fs.stat(outAvif84);
        if (stat84.mtime >= sourceStat.mtime) convert84 = false;
      } catch (e) {}

      if (convert84) {
        await sharp(file).resize(84, 84, { fit: "cover" }).avif({ quality: 60 }).toFile(outAvif84);
        console.log("Created/Updated resized logo:", path.relative(publicDir, outAvif84));
      } else {
        console.log("Skipped (up-to-date) resized logo:", path.relative(publicDir, outAvif84));
      }
    }
  } catch (err) {
    console.error("Failed to process file:", path.relative(publicDir, file), err.message);
  }
}

async function main() {
  console.log("Scanning public directory recursively for images...");
  if (!existsSync(publicDir)) {
    console.error("Public directory not found at:", publicDir);
    return;
  }

  const allFiles = await getFilesRecursively(publicDir);
  const imageExtensions = /\.(png|jpe?g|webp|tiff|bmp|gif)$/i;

  const targetImages = allFiles.filter((filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    // Skip target files like logo-180.avif, logo-84.avif, or general *.avif
    if (ext === ".avif") return false;
    return imageExtensions.test(filePath);
  });

  console.log(`Found ${targetImages.length} images to check.`);

  for (const imgPath of targetImages) {
    await convert(imgPath);
  }
  console.log("Image conversion task completed.");
}

main().catch((err) => {
  console.error("Fatal error in main script execution:", err);
  process.exit(1);
});
