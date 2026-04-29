import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, ChevronDown } from "lucide-react";
import { extractHeadings } from "@/lib/markdown";

interface TableOfContentsProps {
    content: string;
    className?: string;
}

const TableOfContents = ({ content, className = "" }: TableOfContentsProps) => {
    const headings = useMemo(() => extractHeadings(content), [content]);
    const [open, setOpen] = useState(false);

    if (headings.length < 2) return null;

    const minLevel = Math.min(...headings.map((h) => h.level));

    return (
        <div className={`not-prose rounded-lg border border-border bg-card/50 ${className}`}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full px-4 py-3 text-sm font-mono font-semibold text-foreground hover:text-primary transition-colors"
            >
                <span className="flex items-center gap-2">
                    <List size={14} />
                    Table of Contents
                </span>
                <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.nav
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <ul className="px-4 pb-3 space-y-1">
                            {headings.map((h, i) => (
                                <li
                                    key={i}
                                    style={{ paddingLeft: `${(h.level - minLevel) * 16}px` }}
                                >
                                    <button
                                        onClick={() => {
                                            const el = document.getElementById(h.id);
                                            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                                        }}
                                        className="block text-sm text-muted-foreground hover:text-primary transition-colors py-0.5 font-mono text-left"
                                    >
                                        {h.text}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.nav>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TableOfContents;
