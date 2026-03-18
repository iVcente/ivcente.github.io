import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { projects } from "@/data/projects";

const Projects = () => {
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const allTags = useMemo(
        () => [...new Set(projects.flatMap((p) => p.tags))].sort(),
        []
    );

    const filtered = activeTag
        ? projects.filter((p) => p.tags.includes(activeTag))
        : projects;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container px-6 pt-28 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors mb-8">
                        <ArrowLeft size={14} /> Back
                    </Link>

                    <h1 className="text-4xl font-mono font-bold mb-2">
                        <span className="text-primary">~/</span>projects
                    </h1>
                    <p className="text-muted-foreground mb-8">All projects and experiments.</p>

                    <div className="flex flex-wrap gap-2 mb-12">
                        <button
                            onClick={() => setActiveTag(null)}
                            className={`text-xs font-mono px-3 py-1.5 rounded-full border transition-colors ${
                                activeTag === null
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-secondary text-secondary-foreground border-border hover:border-primary/40"
                            }`}
                        >
                            All
                        </button>
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                                className={`text-xs font-mono px-3 py-1.5 rounded-full border transition-colors ${
                                    activeTag === tag
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-secondary text-secondary-foreground border-border hover:border-primary/40"
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((project, i) => (
                        <motion.div
                            key={project.slug}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                        >
                            <Link
                                to={`/projects/${project.slug}`}
                                className="group block rounded-lg border border-border overflow-hidden hover:border-primary/40 hover:glow-border transition-all"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={project.cover}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                                    {project.status && (
                                        <span className="absolute top-3 right-3 text-xs font-mono px-2 py-1 rounded bg-primary/90 text-primary-foreground">
                                            {project.status}
                                        </span>
                                    )}
                                </div>
                                <div className="p-6 bg-card -mt-8 relative">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-mono font-semibold text-lg group-hover:text-primary transition-colors">
                                            {project.title}
                                        </h3>
                                        <div className="flex gap-2">
                                            {project.github && <Github className="text-muted-foreground" size={16} />}
                                            {project.demo && <ExternalLink className="text-muted-foreground" size={16} />}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                                        {project.summary}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag) => (
                                            <span key={tag} className="text-xs font-mono px-2 py-1 rounded bg-secondary text-secondary-foreground">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Projects;