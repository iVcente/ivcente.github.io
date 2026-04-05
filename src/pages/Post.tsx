import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useRef } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import TableOfContents from "@/components/TableOfContents";
import FloatingTableOfContents from "@/components/FloatingTableOfContents";
import { posts } from "@/data/posts";
import { formatDate } from "@/lib/utils";

const PostPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const post = posts.find((a) => a.slug === slug);
    const tableOfContentsRef = useRef<HTMLDivElement>(null);

    if (!post) return <Navigate to="/posts" replace />;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container px-6 pt-28 pb-24 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/posts" className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors mb-8">
                        <ArrowLeft size={14} /> Back to Posts
                    </Link>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-mono font-bold text-foreground mb-4">{post.title}</h1>

                    <div className="mb-8">
                        <div className="flex items-center gap-4 flex-wrap mb-4">
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                                <Calendar size={12} />
                                {formatDate(post.date)}
                            </span>
                            {post.tags.map((tag) => (
                                <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div ref={tableOfContentsRef}>
                        <TableOfContents content={post.content} className="mb-8" />
                    </div>

                    <article className="prose prose-invert prose-headings:font-mono prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-code:text-primary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-card prose-pre:border prose-pre:border-border max-w-none">
                        <MarkdownRenderer content={post.content} />
                    </article>
                </motion.div>
            </main>
            <FloatingTableOfContents content={post.content} tocRef={tableOfContentsRef} />
            <Footer />
        </div>
    );
};

export default PostPage;
