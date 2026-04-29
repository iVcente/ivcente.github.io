/**
 * Post-build script: generates static HTML files with correct OG/Twitter meta tags
 * for each route so social-media crawlers see the right previews.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseFrontmatter } from "./frontmatter.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "../dist");
const CONTENT = path.resolve(__dirname, "../content");
const SITE_URL = "https://danzmann.dev";
const FALLBACK_IMAGE = "/favicon.ico";

const template = fs.readFileSync(path.join(DIST, "index.html"), "utf-8");

function injectMeta(html, { title, description, image, cardType = "summary" }) {
    const ogImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;
    return html
        .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
        .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${title}"`)
        .replace(/(<meta property="og:description"\s+content=")[^"]*"/, `$1${description}"`)
        .replace(/(<meta property="og:image" content=")[^"]*"/, `$1${ogImage}"`)
        .replace(/(<meta name="twitter:card" content=")[^"]*"/, `$1${cardType}"`)
        .replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${title}"`)
        .replace(/(<meta name="twitter:description"\s+content=")[^"]*"/, `$1${description}"`)
        .replace(/(<meta name="twitter:image" content=")[^"]*"/, `$1${ogImage}"`);
}

function writePage(routePath, meta) {
    const dir = path.join(DIST, routePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), injectMeta(template, meta));
    console.log(`  ✓ ${routePath}`);
}

function readMarkdownDir(dir) {
    return fs
        .readdirSync(dir)
        .filter((file) => file.endsWith(".md"))
        .map((file) => {
            const slug = file.replace(/\.md$/, "");
            const raw = fs.readFileSync(path.join(dir, file), "utf-8");
            const { data } = parseFrontmatter(raw);
            return { slug, data };
        });
}

const siteDescription =
    "Gameplay Programmer building systems in C++ and Unreal Engine. Projects, technical insights, and explorations in game development and computer science.";

console.log("Generating static meta pages...");

writePage("projects", {
    title: "Danzmann.dev | Projects",
    description: siteDescription,
    image: FALLBACK_IMAGE,
});

writePage("posts", {
    title: "Danzmann.dev | Posts",
    description: siteDescription,
    image: FALLBACK_IMAGE,
});

for (const { slug, data } of readMarkdownDir(path.join(CONTENT, "projects"))) {
    const cover = typeof data.cover === "string" ? data.cover : "";
    writePage(`projects/${slug}`, {
        title: typeof data.title === "string" ? data.title : slug,
        description: typeof data.summary === "string" ? data.summary : siteDescription,
        image: cover || FALLBACK_IMAGE,
        cardType: cover ? "summary_large_image" : "summary",
    });
}

for (const { slug, data } of readMarkdownDir(path.join(CONTENT, "posts"))) {
    writePage(`posts/${slug}`, {
        title: typeof data.title === "string" ? data.title : slug,
        description: typeof data.summary === "string" ? data.summary : siteDescription,
        image: FALLBACK_IMAGE,
    });
}

fs.copyFileSync(path.join(DIST, "index.html"), path.join(DIST, "404.html"));
console.log("  ✓ 404.html (SPA fallback)");

console.log("Done!");
