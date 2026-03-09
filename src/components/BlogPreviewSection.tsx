import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { articles } from "@/data/articles";

const BlogPreviewSection = () => {
  return (
    <section className="py-24 border-t border-border">
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
              <span className="text-primary">~/</span>blog
            </h2>
            <p className="text-muted-foreground">Notes, findings, and deep dives.</p>
          </div>
          <Link
            to="/blog"
            className="hidden sm:flex items-center gap-2 text-sm font-mono text-primary hover:underline"
          >
            All posts <ArrowRight size={14} />
          </Link>
        </motion.div>

        <div className="space-y-4">
          {articles.slice(0, 3).map((article, i) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link
                to={`/blog/${article.slug}`}
                className="group block rounded-lg border border-border bg-card p-6 hover:border-primary/40 hover:glow-border transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-mono font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {article.summary}
                    </p>
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
                  </div>
                  <ArrowRight className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" size={16} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <Link
          to="/blog"
          className="sm:hidden flex items-center justify-center gap-2 mt-8 text-sm font-mono text-primary hover:underline"
        >
          All posts <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
