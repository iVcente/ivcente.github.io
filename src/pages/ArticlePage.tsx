import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { articles } from "@/data/articles";

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((a) => a.slug === slug);

  if (!article) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-6 pt-28 pb-24 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={14} /> Back to blog
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-4 flex-wrap mb-4">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                <Calendar size={12} />
                {article.date}
              </span>
              {article.tags.map((tag) => (
                <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <article className="prose prose-invert prose-headings:font-mono prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-code:text-primary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-card prose-pre:border prose-pre:border-border max-w-none">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </article>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticlePage;
