import { parseFrontmatter } from "./frontmatter";

export function loadContent<T extends { slug: string; content: string; date: string }>(
    files: Record<string, string>,
    mapFrontmatter: (data: Record<string, unknown>, slug: string) => Omit<T, "slug" | "content">,
): T[] {
    return Object.entries(files)
        .map(([path, raw]) => {
            const slug = path.split("/").pop()!.replace(/\.md$/, "");
            const { data, content } = parseFrontmatter(raw);
            return {
                ...mapFrontmatter(data, slug),
                slug,
                content: content.trim(),
            } as T;
        })
        .sort((a, b) => (b.date > a.date ? 1 : -1));
}
