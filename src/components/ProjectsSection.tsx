import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import { FaGithub, FaSteam } from "react-icons/fa";
import { SiEpicgames } from "react-icons/si";
import { projects } from "@/data/projects";

const ProjectsSection = () => {
    return (
        <section className="py-24 relative">
            {/* Fade-in from hero */}
            <div className="absolute -top-32 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-background pointer-events-none" />
            <div className="container px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex items-end justify-between mb-12"
                >
                    <div>
                        <h2 className="text-3xl font-mono font-bold mb-2">
                            <span className="text-primary">~/</span>projects
                        </h2>
                        <p className="text-muted-foreground">Things I've built and worked on.</p>
                    </div>
                    <Link
                        to="/projects"
                        className="hidden sm:flex items-center gap-2 text-sm font-mono text-primary hover:underline"
                    >
                        All Projects <ArrowRight size={14} />
                    </Link>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.filter((project) => project.type === "Game").slice(0, 3).map((project, i) => (
                        <motion.div
                            key={project.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
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
                                    {project.type && (
                                        <span className="absolute top-3 right-3 text-xs font-mono px-2 py-1 rounded bg-primary/90 text-primary-foreground">
                                            {project.type}
                                        </span>
                                    )}
                                </div>
                                <div className="p-6 bg-card -mt-8 relative">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-mono font-semibold text-lg group-hover:text-primary transition-colors">
                                            {project.title}
                                        </h3>
                                        <div className="flex gap-2">
                                            {project.github && <FaGithub className="text-muted-foreground" size={16} />}
                                            {project.steam && <FaSteam className="text-muted-foreground" size={16} />}
                                            {project.epicGamesStore && <SiEpicgames className="text-muted-foreground" size={16} />}
                                            {project.website && <ExternalLink className="text-muted-foreground" size={16} />}
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

                <Link
                    to="/projects"
                    className="sm:hidden flex items-center justify-center gap-2 mt-8 text-sm font-mono text-primary hover:underline"
                >
                    All Projects <ArrowRight size={14} />
                </Link>
            </div>
        </section>
    );
};

export default ProjectsSection;