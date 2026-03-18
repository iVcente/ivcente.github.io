export interface Project {
    slug: string;
    title: string;
    date: string;
    summary: string;
    tags: string[];
    cover: string;
    status: string;
    role: string;
    teamSize: string;
    duration: string;
    platform: string;
    github: string;
    demo: string;
    video: string;
    content: string;
}

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) return { data: {}, content: raw };
    const yamlBlock = match[1];
    const content = match[2];
    const data: Record<string, unknown> = {};
    for (const line of yamlBlock.split("\n")) {
        const idx = line.indexOf(":");
        if (idx === -1) continue;
        const key = line.slice(0, idx).trim();
        let val: unknown = line.slice(idx + 1).trim();
        if (typeof val === "string" && val.startsWith("[") && val.endsWith("]")) {
            val = val.slice(1, -1).split(",").map(s => s.trim().replace(/^["']|["']$/g, ""));
        } else if (typeof val === "string") {
            val = val.replace(/^["']|["']$/g, "");
        }
        data[key] = val;
    }
    return { data, content };
}

const postFiles = import.meta.glob("/content/projects/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
}) as Record<string, string>;

export const projects: Project[] = Object.entries(postFiles)
    .map(([path, raw]) => {
        const slug = path.split("/").pop()!.replace(/\.md$/, "");
        const { data, content } = parseFrontmatter(raw);
        return {
            slug,
            title: (data.title as string) ?? slug,
            date: (data.date as string) ?? "",
            summary: (data.summary as string) ?? "",
            tags: (data.tags as string[]) ?? [],
            cover: (data.cover as string) ?? "",
            status: (data.status as string) ?? "",
            role: (data.role as string) ?? "",
            teamSize: (data.team_size as string) ?? "",
            duration: (data.duration as string) ?? "",
            platform: (data.platform as string) ?? "",
            github: (data.github as string) ?? "",
            demo: (data.demo as string) ?? "",
            video: (data.video as string) ?? "",
            content: content.trim(),
        } as Project;
    })
    .sort((a, b) => (b.date > a.date ? 1 : -1));