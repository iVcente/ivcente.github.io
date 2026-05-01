export interface TocEntry {
    level: number;
    text: string;
    id: string;
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/_/g, "-")
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s-]+/g, "-")
        .replace(/^-|-$/g, "");
}

export function extractHeadings(markdown: string): TocEntry[] {
    const lines = markdown.split("\n");
    const entries: TocEntry[] = [];
    let inCodeBlock = false;
    for (const line of lines) {
        if (line.trim().startsWith("```")) {
            inCodeBlock = !inCodeBlock;
            continue;
        }
        if (inCodeBlock) continue;
        const match = line.match(/^(#{1,3})\s+(.+)$/);
        if (match) {
            const level = match[1].length;
            const text = match[2].replace(/[*`~]/g, "").trim();
            entries.push({ level, text, id: slugify(text) });
        }
    }
    return entries;
}
