import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { extractHeadings } from "@/lib/markdown";

interface FloatingTocProps {
  content: string;
  tocRef?: React.RefObject<HTMLDivElement>;
}

const FloatingToc = ({ content, tocRef }: FloatingTocProps) => {
  const headings = useMemo(() => extractHeadings(content), [content]);
  const [activeId, setActiveId] = useState<string>("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (headings.length < 2) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [headings]);

  useEffect(() => {
    if (!tocRef?.current) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(tocRef.current);
    return () => observer.disconnect();
  }, [tocRef]);

  if (headings.length < 2) return null;

  const minLevel = Math.min(...headings.map((h) => h.level));

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed right-6 top-16 bottom-0 z-40 hidden xl:flex items-center"
        >
          <div className="max-h-[80vh] overflow-y-auto max-w-[180px]">
            <ul className="space-y-1 border-l border-border pl-3">
              {headings.map((h) => (
                <li
                  key={h.id}
                  style={{ paddingLeft: `${(h.level - minLevel) * 8}px` }}
                >
                  <button
                    onClick={() => {
                      const el = document.getElementById(h.id);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`block text-left text-xs font-mono py-0.5 transition-colors truncate max-w-full ${
                      activeId === h.id
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {h.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default FloatingToc;
