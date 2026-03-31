import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, ExternalLink, Users, Clock, Monitor, Play } from "lucide-react";
import { FaRegBuilding, FaGithub, FaSteam } from "react-icons/fa";
import { SiEpicgames } from "react-icons/si";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { projects } from "@/data/projects";
import { formatDate } from "@/lib/utils";

function getEmbedUrl(url: string): string | null {
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return null;
}

const Project = () => {
    const { slug } = useParams<{ slug: string }>();
    const project = projects.find((p) => p.slug === slug);

    if (!project) return <Navigate to="/projects" replace />;

    const embedUrl = project.video ? getEmbedUrl(project.video) : null;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container px-6 pt-28 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors mb-8">
                        <ArrowLeft size={14} /> Back to Projects
                    </Link>

                    {/* Cover */}
                    {project.cover && (
                        <div className="relative rounded-lg overflow-hidden mb-8 h-64 md:h-80">
                            <img
                                src={project.cover}
                                alt={project.title}
                                className="w-full h-full object-cover object-top"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                        </div>
                    )}

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                            <Calendar size={12} />
                            {formatDate(project.date)}
                        </span>
                        {project.type && (
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary/20 text-primary">
                                {project.type}
                            </span>
                        )}
                        {project.tags.map((tag) => (
                            <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 rounded-lg border border-border bg-card">
                        {project.company && (
                            <div className="flex items-center gap-2 text-sm">
                                <FaRegBuilding size={14} className="text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Company</p>
                                    <p className="font-mono text-xs">{project.company}</p>
                                </div>
                            </div>
                        )}
                        {project.teamSize && (
                            <div className="flex items-center gap-2 text-sm">
                                <Users size={14} className="text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Team Size</p>
                                    <p className="font-mono text-xs">{project.teamSize}</p>
                                </div>
                            </div>
                        )}
                        {project.period && (
                            <div className="flex items-center gap-2 text-sm">
                                <Clock size={14} className="text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Period</p>
                                    <p className="font-mono text-xs">{project.period}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Links */}
                    <div className="flex gap-3 mb-10">
                        {project.github && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-mono px-4 py-2 rounded-lg border border-border bg-secondary text-secondary-foreground hover:border-primary/40 transition-colors"
                            >
                                <FaGithub size={14} /> GitHub
                            </a>
                        )}
                        {project.steam && (
                            <a
                                href={project.steam}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-mono px-4 py-2 rounded-lg border border-border bg-secondary text-secondary-foreground hover:border-primary/40 transition-colors"
                            >
                                <FaSteam size={14} /> Steam
                            </a>
                        )}
                        {project.epicGamesStore && (
                            <a
                                href={project.epicGamesStore}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-mono px-4 py-2 rounded-lg border border-border bg-secondary text-secondary-foreground hover:border-primary/40 transition-colors"
                            >
                                <SiEpicgames size={14} /> Epic Games Store
                            </a>
                        )}
                        {project.website && (
                            <a
                                href={project.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-mono px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                <ExternalLink size={14} /> Website
                            </a>
                        )}
                    </div>

                    {/* Video embed */}
                    {embedUrl && (
                        <div className="mb-10">
                            <h3 className="font-mono text-sm text-muted-foreground mb-3 flex items-center gap-2">
                                <Play size={14} className="text-primary" /> {project.videoDescription}
                            </h3>
                            <div className="relative rounded-lg overflow-hidden border border-border" style={{ paddingTop: "56.25%" }}>
                                <iframe
                                    src={embedUrl}
                                    title={`${project.title} Video`}
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <article className="
                        prose prose-invert prose-sm max-w-none
                        prose-headings:font-mono prose-headings:text-foreground
                        prose-p:text-muted-foreground prose-p:leading-relaxed
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-foreground
                        prose-code:text-primary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                        prose-pre:bg-card prose-pre:border prose-pre:border-border
                        prose-li:text-muted-foreground
                    ">
                        <MarkdownRenderer content={project.content} />
                    </article>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default Project;
