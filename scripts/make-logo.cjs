/* Generates a public logo+wordmark PNG for email (Dynamic OTP). Run: node scripts/make-logo.cjs */
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const ACCENT = "#ef0606"; // Fethron brand red (--accent)

// Mark = the canonical Fethron F-glyph (matches BrandMark). Wordmark in a
// classical serif with wide tracking to echo the site's Cinzel lockup.
function svgFor(inkColor) {
  return `<svg width="640" height="180" viewBox="0 0 640 180" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(46,46) scale(1.6)">
    <path fill="${ACCENT}" d="M6 4L18 8L16 44L4 40L6 4Z"/>
    <path fill="${ACCENT}" d="M20 8L44 4L42 16L20 18L20 8Z"/>
    <path fill="${ACCENT}" d="M20 22L38 20L36 30L20 30L20 22Z"/>
  </g>
  <text x="150" y="112" font-family="Georgia, 'Times New Roman', serif" font-size="68" font-weight="600" letter-spacing="7" fill="${inkColor}">FETHRON</text>
</svg>`;
}

const outDir = path.join(__dirname, "..", "public", "brand");
fs.mkdirSync(outDir, { recursive: true });

// Two variants: dark wordmark for LIGHT backgrounds, off-white for DARK backgrounds.
const VARIANTS = [
  { ink: "#16130f", file: "fethron-logo-wordmark-dark.png", note: "for light backgrounds" },
  { ink: "#efeee8", file: "fethron-logo-wordmark-light.png", note: "for dark backgrounds" },
];

// Square mark-only icon (transparent) — for the Organization JSON-LD logo,
// knowledge-panel avatar, and favicons. Mark centred on a 512x512 canvas.
const markSquare = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(130,116) scale(6)">
    <path fill="${ACCENT}" d="M6 4L18 8L16 44L4 40L6 4Z"/>
    <path fill="${ACCENT}" d="M20 8L44 4L42 16L20 18L20 8Z"/>
    <path fill="${ACCENT}" d="M20 22L38 20L36 30L20 30L20 22Z"/>
  </g>
</svg>`;

(async () => {
  const pad = 40;
  for (const v of VARIANTS) {
    // Render at 2x for crispness, trim transparent edges, add even padding.
    const base = await sharp(Buffer.from(svgFor(v.ink)), { density: 288 }).png().toBuffer();
    const trimmed = await sharp(base).trim().toBuffer();
    await sharp(trimmed)
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(outDir, v.file));
    console.log(`done -> public/brand/${v.file}  (${v.note})`);
  }
  await sharp(Buffer.from(markSquare), { density: 192 }).png().toFile(path.join(outDir, "fethron-mark.png"));
  console.log("done -> public/brand/fethron-mark.png  (square icon for Organization logo / favicon)");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
