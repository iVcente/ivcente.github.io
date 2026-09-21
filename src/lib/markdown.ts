export interface TocEntry {
    level: number;
    text: string;
    id: string;
    unnumbered?: boolean;
    number?: string;
}

/** Trailing `{-}` on a heading opts it out of auto numbering (pandoc convention). */
export const UNNUMBERED_MARKER = /\s*\{-\}\s*$/;

export function stripUnnumberedMarker(text: string): { text: string; unnumbered: boolean } {
    const unnumbered = UNNUMBERED_MARKER.test(text);
    return { text: text.replace(UNNUMBERED_MARKER, "").trim(), unnumbered };
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/_/g, "-")
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s-]+/g, "-")
        .replace(/^-|-$/g, "");
}

/** Assigns hierarchical numbers ("1.", "1.1.", "1.1.1.") mirroring the CSS counters. */
export function numberHeadings(entries: TocEntry[]): TocEntry[] {
    const counters = [0, 0, 0];
    return entries.map((entry) => {
        if (entry.unnumbered) return entry;
        const depth = Math.min(Math.max(entry.level, 1), counters.length) - 1;
        counters[depth] += 1;
        for (let i = depth + 1; i < counters.length; i += 1) counters[i] = 0;
        return { ...entry, number: `${counters.slice(0, depth + 1).join(".")}.` };
    });
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
            const { text, unnumbered } = stripUnnumberedMarker(match[2].replace(/[*`~]/g, "").trim());
            entries.push({ level, text, id: slugify(text), unnumbered });
        }
    }
    return entries;
}
