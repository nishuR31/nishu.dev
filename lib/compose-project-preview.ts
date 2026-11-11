/**
 * Client-only helper that composes a project's desktop screenshot and phone
 * screenshot into a single opaque image: a laptop with the phone overlapping
 * its bottom-right corner.
 *
 * The WebGL carousel can only sample one texture per card (and its shader
 * ignores alpha), so cards need one pre-composed raster image instead of two
 * layered DOM nodes.
 */

const COMPOSITE_WIDTH = 1200;
const COMPOSITE_HEIGHT = 750;

const imageCache = new Map<string, Promise<string>>();
const objectUrls = new Set<string>();

type Point = { x: number; y: number; w: number; h: number };

const LAPTOP_SCREEN: Point = { x: 192, y: 94, w: 816, h: 430 };
const LAPTOP_BASE: Point = { x: 156, y: 524, w: 888, h: 40 };
const PHONE: Point = { x: 838, y: 257, w: 206, h: 446 };

function cacheKey(desktop: string, mobile?: string): string {
  return `${desktop}::${mobile || ""}`;
}

function loadImage(src: string, timeoutMs = 15000): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";

    let settled = false;
    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      callback();
    };
    const timer = setTimeout(() => {
      finish(() => reject(new Error(`Timed out loading ${src}`)));
    }, timeoutMs);

    image.onload = () => finish(() => resolve(image));
    image.onerror = () => finish(() => reject(new Error(`Failed to load ${src}`)));
    image.src = src;
  });
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number | [number, number, number, number],
) {
  const [tl, tr, br, bl] = typeof radius === "number" ? [radius, radius, radius, radius] : radius;

  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  if (tr) ctx.arcTo(x + w, y, x + w, y + tr, tr);
  ctx.lineTo(x + w, y + h - br);
  if (br) ctx.arcTo(x + w, y + h, x + w - br, y + h, br);
  ctx.lineTo(x + bl, y + h);
  if (bl) ctx.arcTo(x, y + h, x, y + h - bl, bl);
  ctx.lineTo(x, y + tl);
  if (tl) ctx.arcTo(x, y, x + tl, y, tl);
  ctx.closePath();
}

/** Draws an image like `object-fit: contain`, centered in the box. */
function drawImageContain(ctx: CanvasRenderingContext2D, image: HTMLImageElement, box: Point) {
  const imageWidth = image.naturalWidth || image.width;
  const imageHeight = image.naturalHeight || image.height;
  if (!imageWidth || !imageHeight) return;

  const scale = Math.min(box.w / imageWidth, box.h / imageHeight);
  const drawWidth = imageWidth * scale;
  const drawHeight = imageHeight * scale;
  const drawX = box.x + (box.w - drawWidth) / 2;
  const drawY = box.y + (box.h - drawHeight) / 2;

  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function drawBackdrop(ctx: CanvasRenderingContext2D) {
  const base = ctx.createLinearGradient(0, 0, COMPOSITE_WIDTH, COMPOSITE_HEIGHT);
  base.addColorStop(0, "#0a0a12");
  base.addColorStop(0.55, "#101019");
  base.addColorStop(1, "#171724");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, COMPOSITE_WIDTH, COMPOSITE_HEIGHT);

  const vignette = ctx.createRadialGradient(
    COMPOSITE_WIDTH / 2,
    COMPOSITE_HEIGHT / 2,
    COMPOSITE_HEIGHT * 0.2,
    COMPOSITE_WIDTH / 2,
    COMPOSITE_HEIGHT / 2,
    COMPOSITE_WIDTH * 0.72,
  );
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.42)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, COMPOSITE_WIDTH, COMPOSITE_HEIGHT);
}

function drawLaptop(ctx: CanvasRenderingContext2D, desktop: HTMLImageElement) {
  const screen = LAPTOP_SCREEN;
  const base = LAPTOP_BASE;

  // Base shadow.
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.filter = "blur(18px)";
  roundedRectPath(ctx, base.x + 32, base.y + 16, base.w - 64, 26, 13);
  ctx.fill();
  ctx.restore();

  // Laptop base.
  const baseGradient = ctx.createLinearGradient(0, base.y, 0, base.y + base.h);
  baseGradient.addColorStop(0, "#343441");
  baseGradient.addColorStop(1, "#141420");
  ctx.fillStyle = baseGradient;
  roundedRectPath(ctx, base.x, base.y, base.w, base.h, [8, 8, 24, 24]);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Trackpad notch on the front edge.
  ctx.fillStyle = "rgba(5, 5, 10, 0.7)";
  roundedRectPath(ctx, base.x + base.w / 2 - 66, base.y, 132, 13, [0, 0, 9, 9]);
  ctx.fill();

  // Screen shell.
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
  ctx.shadowBlur = 34;
  ctx.shadowOffsetY = 18;
  ctx.fillStyle = "#08080e";
  roundedRectPath(ctx, screen.x, screen.y, screen.w, screen.h, 17);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = 2;
  roundedRectPath(ctx, screen.x, screen.y, screen.w, screen.h, 17);
  ctx.stroke();

  // Camera dot in the top bezel.
  ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
  ctx.beginPath();
  ctx.arc(screen.x + screen.w / 2, screen.y + 5.5, 2.2, 0, Math.PI * 2);
  ctx.fill();

  // Display.
  const inset = 10;
  const display: Point = {
    x: screen.x + inset,
    y: screen.y + inset,
    w: screen.w - inset * 2,
    h: screen.h - inset * 2,
  };
  ctx.save();
  roundedRectPath(ctx, display.x, display.y, display.w, display.h, 9);
  ctx.clip();
  ctx.fillStyle = "#04040a";
  ctx.fillRect(display.x, display.y, display.w, display.h);
  drawImageContain(ctx, desktop, display);
  ctx.restore();
}

function drawPhone(ctx: CanvasRenderingContext2D, mobile: HTMLImageElement) {
  const phone = PHONE;

  // Shell + shadow.
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.62)";
  ctx.shadowBlur = 42;
  ctx.shadowOffsetY = 22;
  ctx.fillStyle = "#07070d";
  roundedRectPath(ctx, phone.x, phone.y, phone.w, phone.h, 31);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
  ctx.lineWidth = 2.5;
  roundedRectPath(ctx, phone.x, phone.y, phone.w, phone.h, 31);
  ctx.stroke();

  // Display.
  const inset = 8;
  const display: Point = {
    x: phone.x + inset,
    y: phone.y + inset,
    w: phone.w - inset * 2,
    h: phone.h - inset * 2,
  };
  ctx.save();
  roundedRectPath(ctx, display.x, display.y, display.w, display.h, 24);
  ctx.clip();
  ctx.fillStyle = "#04040a";
  ctx.fillRect(display.x, display.y, display.w, display.h);
  drawImageContain(ctx, mobile, display);
  ctx.restore();

  // Dynamic-island style notch.
  ctx.fillStyle = "#08080e";
  roundedRectPath(ctx, phone.x + phone.w / 2 - 27, phone.y + 12, 54, 13, 7);
  ctx.fill();
}

function renderComposite(
  desktop: HTMLImageElement,
  mobile: HTMLImageElement | null,
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = COMPOSITE_WIDTH;
  canvas.height = COMPOSITE_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  drawBackdrop(ctx);
  drawLaptop(ctx, desktop);
  if (mobile) drawPhone(ctx, mobile);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to export project preview"));
          return;
        }
        const url = URL.createObjectURL(blob);
        objectUrls.add(url);
        resolve(url);
      },
      "image/jpeg",
      0.9,
    );
  });
}

/**
 * Composes a laptop + phone preview once per image pair and caches the result.
 * When `mobile` is missing (or identical to the desktop shot) the result is a
 * laptop-only composition.
 */
export function composeProjectPreview(desktopSrc: string, mobileSrc?: string): Promise<string> {
  const key = cacheKey(desktopSrc, mobileSrc);
  const cached = imageCache.get(key);
  if (cached) return cached;

  const task = (async () => {
    const desktop = await loadImage(desktopSrc);

    let mobile: HTMLImageElement | null = null;
    if (mobileSrc && mobileSrc !== desktopSrc) {
      try {
        const candidate = await loadImage(mobileSrc);
        // Only place it in the phone frame when it is actually portrait.
        if ((candidate.naturalWidth || 0) < (candidate.naturalHeight || 0)) {
          mobile = candidate;
        }
      } catch {
        // A dead phone screenshot should not cost us the whole preview.
        mobile = null;
      }
    }

    return renderComposite(desktop, mobile);
  })();

  imageCache.set(key, task);
  task.catch(() => imageCache.delete(key));
  return task;
}

/** Releases every blob URL created by this module. */
export function releaseProjectPreviews() {
  objectUrls.forEach((url) => URL.revokeObjectURL(url));
  objectUrls.clear();
  imageCache.clear();
}
