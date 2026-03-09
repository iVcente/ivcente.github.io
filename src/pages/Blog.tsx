import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { articles } from "@/data/articles";

const Blog = () => {
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
            <span className="text-primary">~/</span>blog
          </h1>
          <p className="text-muted-foreground mb-12">All articles and notes.</p>
        </motion.div>

        <div className="space-y-4">
          {articles.map((article, i) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                to={`/blog/${article.slug}`}
                className="group block rounded-lg border border-border bg-card p-6 hover:border-primary/40 hover:glow-border transition-all"
              >
                <h2 className="font-mono font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-3">{article.summary}</p>
                <div className="flex items-center gap-4 flex-wrap">
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
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
