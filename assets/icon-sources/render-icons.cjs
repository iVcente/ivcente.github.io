// Renders the published icons from danzmann-vortex-icon.svg.
// The ground and glow are recomputed in float and dithered here, because an
// 8-bit SVG render of such a dark gradient shows visible rings.
// Run from the repo root: NODE_PATH=<dir with sharp> node assets/icon-sources/render-icons.cjs
const sharp = require("sharp");
const fs = require("fs");

const W = 512;
const TEAL = [0x33, 0xd0, 0xc4];
const svg = fs.readFileSync("assets/icon-sources/danzmann-vortex-icon.svg", "utf8");
const vortexOnly = svg.replace(/<rect width="512" height="512"[^>]*><\/rect>/g, "");

let seed = 1;
const rnd = () => (seed = (seed * 1103515245 + 12345) >>> 0) / 4294967296;

const ground = Buffer.alloc(W * W * 3);
for (let y = 0; y < W; y++) {
    for (let x = 0; x < W; x++) {
        const d = Math.hypot(x + 0.5 - 256, y + 0.5 - 256);
        const t = Math.min(d / 362, 1);
        const grey = 0x1c + (0x16 - 0x1c) * t * t * (3 - 2 * t); // #1c1c1c center, #161616 corners
        const glow = 0.2 * Math.pow(1 - Math.min(d / 300, 1), 2.2);
        const noise = rnd() - rnd();
        for (let c = 0; c < 3; c++) {
            const v = grey * (1 - glow) + TEAL[c] * glow + noise;
            ground[(y * W + x) * 3 + c] = Math.max(0, Math.min(255, Math.round(v)));
        }
    }
}

(async () => {
    const vortex = await sharp(Buffer.from(vortexOnly)).resize(W, W).png().toBuffer();
    const icon = await sharp(ground, { raw: { width: W, height: W, channels: 3 } })
        .composite([{ input: vortex }])
        .png()
        .toBuffer();
    await sharp(icon).toFile("public/icon.png");
    await sharp(icon).resize(48, 48).png().toFile("public/favicon.ico");
    await sharp(icon).resize(180, 180).png().toFile("public/apple-touch-icon.png");
    fs.copyFileSync("public/apple-touch-icon.png", "public/apple-touch-icon-precomposed.png");
})();
