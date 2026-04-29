import { loadContent } from "@/lib/content";

export interface Post {
    slug: string;
    title: string;
    date: string;
    summary: string;
    tags: string[];
    content: string;
}

const postFiles = import.meta.glob("/content/posts/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
}) as Record<string, string>;

export const posts: Post[] = loadContent<Post>(postFiles, (data, slug) => ({
    title: (data.title as string) ?? slug,
    date: (data.date as string) ?? "",
    summary: (data.summary as string) ?? "",
    tags: (data.tags as string[]) ?? [],
}));
