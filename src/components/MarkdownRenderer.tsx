import ReactMarkdown, { type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/tokyo-night-dark.css";
import { AlertTriangle, Info, Lightbulb, Flame, MessageSquare, Copy, Check } from "lucide-react";
import { type ReactNode, useState, useCallback } from "react";
import { slugify } from "@/lib/markdown";

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

type RehypeNode = {
    type?: string;
    tagName?: string;
    properties?: Record<string, unknown>;
    children?: RehypeNode[];
};

type CodeBlockProps = React.HTMLAttributes<HTMLElement> & {
    children?: ReactNode;
    node?: unknown;
    inline?: boolean;
    "data-code-title"?: string;
};

function normalizeCodeBlockMetadata() {
    return (tree: RehypeNode) => {
        const visit = (node: RehypeNode) => {
            if (node.type === "element" && node.tagName === "code") {
                const rawClassName = node.properties?.className;
                const classNames = Array.isArray(rawClassName)
                    ? rawClassName.map(String)
                    : typeof rawClassName === "string"
                        ? rawClassName.split(/\s+/).filter(Boolean)
                        : [];
                const titledLanguageClass = classNames.find(
                    (value) => value.startsWith("language-") && value.includes(":")
                );

                if (titledLanguageClass) {
                    const match = /^language-([\w-]+):(.+)$/.exec(titledLanguageClass);
                    if (match) {
                        const [, lang, title] = match;
                        node.properties = {
                            ...node.properties,
                            className: classNames.map((value) =>
                                value === titledLanguageClass ? `language-${lang}` : value
                            ),
                            "data-code-title": title,
                        };
                    }
                }
            }

            node.children?.forEach(visit);
        };

        visit(tree);
    };
}

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

function extractText(node: ReactNode): string {
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (node && typeof node === "object" && "props" in node) return extractText(node.props.children);
    return "";
}

function CodeBlock({
    className,
    children,
    node: _node,
    inline: _inline,
    ...props
}: CodeBlockProps) {
    const [copied, setCopied] = useState(false);
    const { ["data-code-title"]: titleFromProps, ...codeProps } = props;
    const normalizedClassName = (className || "").replace(/language-([\w-]+):(.+)/, "language-$1");
    const match = /language-([\w-]+)/.exec(normalizedClassName);
    const isBlock = match !== null;

    const handleCopy = useCallback(() => {
        const text = extractText(children);
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [children]);

    if (!isBlock) {
        return <code className={className} {...codeProps}>{children}</code>;
    }

    const lang = match![1];
    const title = titleFromProps ?? /language-[\w-]+:(.+)/.exec(className || "")?.[1];

    return (
        <div className="relative group">
            <div className="flex items-center justify-between px-4 py-2 bg-[hsl(220_20%_12%)] border-b border-border/50 rounded-t-lg">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{lang}</span>
                    {title && (
                        <>
                            <span className="text-muted-foreground/30">·</span>
                            <span className="text-xs font-mono text-foreground/70">{title}</span>
                        </>
                    )}
                </div>
                <button
                    onClick={handleCopy}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                    aria-label="Copy code"
                >
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
            </div>
            <code className={normalizedClassName} {...codeProps}>{children}</code>
        </div>
    );
}

const components: Components = {
    h1: ({ children, ...props }) => {
        const id = slugify(extractText(children as ReactNode));
        return <h1 id={id} {...props}>{children}</h1>;
    },
    h2: ({ children, ...props }) => {
        const id = slugify(extractText(children as ReactNode));
        return <h2 id={id} {...props}>{children}</h2>;
    },
    h3: ({ children, ...props }) => {
        const id = slugify(extractText(children as ReactNode));
        return <h3 id={id} {...props}>{children}</h3>;
    },
    code: (props) => <CodeBlock {...props} />,
    iframe: ({ ...props }) => (
        <iframe
            {...props}
            className="w-full rounded-lg border border-border"
            style={{ height: "500px", ...((props as Record<string, unknown>).style as object) }}
        />
    ),
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
                        <div className="text-sm text-muted-foreground [&>p]:m-0 [&_code]:text-primary [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm">
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
        <ReactMarkdown rehypePlugins={[rehypeRaw, normalizeCodeBlockMetadata, rehypeHighlight]} components={components}>
            {content}
        </ReactMarkdown>
    </div>
);

export default MarkdownRenderer;
