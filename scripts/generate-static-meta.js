/**
 * Post-build script: generates static HTML files with correct OG/Twitter meta tags
 * for each route so social-media crawlers see the right previews.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "../dist");
const CONTENT = path.resolve(__dirname, "../content");
const SITE_URL = "https://danzmann.dev";

const template = fs.readFileSync(path.join(DIST, "index.html"), "utf-8");

function parseFrontmatter(raw) {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) return {};
    const data = {};
    for (const line of match[1].split("\n")) {
        const idx = line.indexOf(":");
        if (idx === -1) continue;
        const key = line.slice(0, idx).trim();
        let val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
        data[key] = val;
    }
    return data;
}

function injectMeta(html, { title, description, image, cardType = "summary" }) {
    const ogImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;
    // Replace <title>
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
    // Replace og tags
    html = html.replace(/(<meta property="og:title" content=")[^"]*"/, `$1${title}"`);
    html = html.replace(/(<meta property="og:description"\s+content=")[^"]*"/, `$1${description}"`);
    html = html.replace(/(<meta property="og:image" content=")[^"]*"/, `$1${ogImage}"`);
    // Replace twitter tags
    html = html.replace(/(<meta name="twitter:card" content=")[^"]*"/, `$1${cardType}"`);
    html = html.replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${title}"`);
    html = html.replace(/(<meta name="twitter:description"\s+content=")[^"]*"/, `$1${description}"`);
    html = html.replace(/(<meta name="twitter:image" content=")[^"]*"/, `$1${ogImage}"`);
    return html;
}

function writePage(routePath, meta) {
    const dir = path.join(DIST, routePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), injectMeta(template, meta));
    console.log(`  ✓ ${routePath}`);
}

const siteDescription =
    "Gameplay Programmer building systems in C++ and Unreal Engine. Projects, technical insights, and explorations in game development and computer science.";

console.log("Generating static meta pages...");

// /projects
writePage("projects", {
    title: "Danzmann.dev | Projects",
    description: siteDescription,
    image: "/favicon.ico",
});

// /posts
writePage("posts", {
    title: "Danzmann.dev | Posts",
    description: siteDescription,
    image: "/favicon.ico",
});

// Individual projects
const projectDir = path.join(CONTENT, "projects");
for (const file of fs.readdirSync(projectDir)) {
    if (!file.endsWith(".md")) continue;
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(projectDir, file), "utf-8");
    const data = parseFrontmatter(raw);
    writePage(`projects/${slug}`, {
        title: data.title || slug,
        description: data.summary || siteDescription,
        image: data.cover || "/favicon.ico",
        cardType: data.cover ? "summary_large_image" : "summary",
    });
}

// Individual posts
const postDir = path.join(CONTENT, "posts");
for (const file of fs.readdirSync(postDir)) {
    if (!file.endsWith(".md")) continue;
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(postDir, file), "utf-8");
    const data = parseFrontmatter(raw);
    writePage(`posts/${slug}`, {
        title: data.title || slug,
        description: data.summary || siteDescription,
        image: "/favicon.ico",
    });
}

// Copy index.html as 404.html for GitHub Pages SPA fallback
fs.copyFileSync(path.join(DIST, "index.html"), path.join(DIST, "404.html"));
console.log("  ✓ 404.html (SPA fallback)");

console.log("Done!");
