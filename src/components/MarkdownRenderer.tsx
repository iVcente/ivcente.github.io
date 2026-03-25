import ReactMarkdown, { type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/tokyo-night-dark.min.css";
import { AlertTriangle, Info, Lightbulb, Flame, MessageSquare } from "lucide-react";
import type { ReactNode } from "react";

const CALLOUT_REGEX = /^\[!(NOTE|TIP|WARNING|CAUTION|COMMENT)\]\s*/i;

const calloutConfig: Record<string, { icon: ReactNode; border: string; bg: string; title: string }> = {
    NOTE: {
        icon: <Info size={16} />,
        border: "border-primary/40",
        bg: "bg-primary/5",
        title: "Note",
    },
    TIP: {
        icon: <Lightbulb size={16} />,
        border: "border-green-500/40",
        bg: "bg-green-500/5",
        title: "Tip",
    },
    WARNING: {
        icon: <AlertTriangle size={16} />,
        border: "border-yellow-500/40",
        bg: "bg-yellow-500/5",
        title: "Warning",
    },
    CAUTION: {
        icon: <Flame size={16} />,
        border: "border-destructive/40",
        bg: "bg-destructive/5",
        title: "Caution",
    },
    COMMENT: {
        icon: <MessageSquare size={16} />,
        border: "border-muted-foreground/30",
        bg: "bg-muted/30",
        title: "Comment",
    },
};

function extractCalloutType(children: ReactNode): { type: string; content: ReactNode } | null {
    if (!Array.isArray(children)) return null;

    for (const child of children) {
        if (child && typeof child === "object" && "props" in child && child.props?.children) {
            const inner = child.props.children;
            const text = Array.isArray(inner) ? inner : [inner];
            const first = text.find((t: unknown) => typeof t === "string");
            if (typeof first === "string") {
                const match = first.match(CALLOUT_REGEX);
                if (match) {
                    const type = match[1].toUpperCase();
                    const rest = first.replace(CALLOUT_REGEX, "");
                    const newText = text.map((t: unknown) => (t === first ? rest : t));
                    const newChildren = children.map((c: unknown) =>
                        c === child
                            ? { ...child, props: { ...child.props, children: newText } }
                            : c
                    );
                    return { type, content: newChildren };
                }
            }
        }
    }
    return null;
}

const components: Components = {
    blockquote: ({ children, ...props }) => {
        const callout = extractCalloutType(children as ReactNode);
        if (callout) {
            const config = calloutConfig[callout.type];
            if (config) {
                return (
                    <div className={`not-prose my-4 rounded-lg border-l-4 ${config.border} ${config.bg} p-4`}>
                        <div className="flex items-center gap-2 font-mono text-sm font-semibold text-foreground mb-2">
                            {config.icon}
                            {config.title}
                        </div>
                        <div className="text-sm text-muted-foreground [&>p]:m-0">
                            {callout.content}
                        </div>
                    </div>
                );
            }
        }
        return <blockquote {...props}>{children}</blockquote>;
    },
};

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => (
    <div className={className}>
        <ReactMarkdown rehypePlugins={[rehypeHighlight]} components={components}>
            {content}
        </ReactMarkdown>
    </div>
);

export default MarkdownRenderer;
