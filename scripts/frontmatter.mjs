// keep in sync with src/lib/frontmatter.ts
export function parseFrontmatter(raw) {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) return { data: {}, content: raw };
    const data = {};
    for (const line of match[1].split("\n")) {
        const idx = line.indexOf(":");
        if (idx === -1) continue;
        const key = line.slice(0, idx).trim();
        let val = line.slice(idx + 1).trim();
        if (val.startsWith("[") && val.endsWith("]")) {
            val = val
                .slice(1, -1)
                .split(",")
                .map((s) => s.trim().replace(/^["']|["']$/g, ""));
        } else {
            val = val.replace(/^["']|["']$/g, "");
        }
        data[key] = val;
    }
    return { data, content: match[2] };
}
