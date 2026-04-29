import { loadContent } from "@/lib/content";

export interface Project {
    slug: string;
    title: string;
    date: string;
    summary: string;
    tags: string[];
    cover: string;
    type: string;
    company: string;
    companyWebsite: string;
    teamSize: string;
    period: string;
    github: string;
    steam: string;
    epicGamesStore: string;
    website: string;
    video: string;
    videoDescription: string;
    content: string;
}

const projectFiles = import.meta.glob("/content/projects/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
}) as Record<string, string>;

export const projects: Project[] = loadContent<Project>(projectFiles, (data, slug) => ({
    title: (data.title as string) ?? slug,
    date: (data.date as string) ?? "",
    summary: (data.summary as string) ?? "",
    tags: (data.tags as string[]) ?? [],
    cover: (data.cover as string) ?? "",
    type: (data.type as string) ?? "",
    company: (data.company as string) ?? "",
    companyWebsite: (data.companyWebsite as string) ?? "",
    teamSize: (data.teamSize as string) ?? "",
    period: (data.period as string) ?? "",
    github: (data.github as string) ?? "",
    steam: (data.steam as string) ?? "",
    epicGamesStore: (data.epicGamesStore as string) ?? "",
    website: (data.website as string) ?? "",
    video: (data.video as string) ?? "",
    videoDescription: (data.videoDescription as string) ?? "",
}));
