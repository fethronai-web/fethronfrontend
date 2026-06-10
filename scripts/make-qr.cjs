/* Branded QR for the welcome page. Run: node scripts/make-qr.cjs
   Uses high error-correction (H) so the centre F-logo never breaks scanning. */
const fs = require("node:fs");
const path = require("node:path");
const QR = require("qrcode");
const sharp = require("sharp");

const URL = "https://fethron.com/welcome";
const SIZE = 1024;
const ACCENT = "#ef0606";

const dir = path.join(__dirname, "..", "design");
fs.mkdirSync(dir, { recursive: true });

(async () => {
  // QR in brand red on white (scanners need the light/dark contrast).
  const qrBuf = await QR.toBuffer(URL, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: SIZE,
    color: { dark: ACCENT, light: "#ffffff" },
  });

  // White rounded backing so modules under the logo are cleanly cleared.
  const back = Math.round(SIZE * 0.24);
  const backing = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${back}" height="${back}"><rect width="${back}" height="${back}" rx="${Math.round(back * 0.2)}" fill="#ffffff"/></svg>`,
  );

  // The red F-mark, centred.
  const logoPx = Math.round(SIZE * 0.16);
  const logo = await sharp(path.join(dir, "fethron-logo.svg"))
    .resize(logoPx, logoPx, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const c = (n) => Math.round((SIZE - n) / 2);
  const meta = await sharp(qrBuf)
    .composite([
      { input: backing, top: c(back), left: c(back) },
      { input: logo, top: c(logoPx), left: c(logoPx) },
    ])
    .png()
    .toFile(path.join(dir, "fethron-welcome-qr.png"));
  console.log(`done -> design/fethron-welcome-qr.png  (${meta.width}x${meta.height})`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
