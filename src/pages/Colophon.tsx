import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ExternalLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline underline-offset-4"
    >
        {children}
    </a>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-mono font-semibold text-lg mb-3">
            <span className="text-primary">#</span> {title}
        </h2>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-3">{children}</div>
    </section>
);

const stack = [
    { label: "Framework", value: "React 18 + React Router, bundled with Vite" },
    { label: "Styling", value: "Tailwind CSS" },
    { label: "Content", value: "Plain Markdown files, parsed at build time" },
    { label: "Hosting", value: "GitHub Pages, deployed from main by GitHub Actions" }
];

const Colophon = () => {
    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Colophon</title>
                <meta property="og:title" content="Danzmann.dev | Colophon" />
                <meta property="og:description" content="What this site is built from, and credit for the parts I didn't build." />
                <meta property="og:image" content="https://danzmann.dev/icon-512.png" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Danzmann.dev | Colophon" />
                <meta name="twitter:image" content="https://danzmann.dev/icon-512.png" />
            </Helmet>
            <Navbar />
            <main className="container px-6 pt-28 pb-24 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors mb-8">
                        <ArrowLeft size={14} /> Back
                    </Link>

                    <h1 className="text-4xl font-mono font-bold mb-2">
                        <span className="text-primary">~/</span>colophon
                    </h1>
                    <p className="text-muted-foreground mb-12">
                        What this site is built from, and credit for the parts I didn't build.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="space-y-4"
                >
                    <Section title="The icon">
                        <p>
                            The vortex is{" "}
                            <ExternalLink href="https://game-icons.net/1x1/lorc/vortex.html">Vortex</ExternalLink>{" "}
                            by <span className="text-foreground">Lorc</span>, from{" "}
                            <ExternalLink href="https://game-icons.net">game-icons.net</ExternalLink>, used under{" "}
                            <ExternalLink href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</ExternalLink>.
                        </p>
                        <p>
                            I recolored it to{" "}
                            <code className="font-mono text-primary">#33D0C4</code> on black and inset it inside a
                            safe area, so the rounded masks that iOS and Android apply to home screen icons clip
                            background instead of artwork.
                        </p>
                    </Section>

                    <Section title="Type">
                        <p>
                            <ExternalLink href="https://rsms.me/inter/">Inter</ExternalLink> for prose and{" "}
                            <ExternalLink href="https://www.jetbrains.com/lp/mono/">JetBrains Mono</ExternalLink>{" "}
                            for headings, code, and anything that should look like a terminal. Both are open source
                            and served through Google Fonts.
                        </p>
                    </Section>

                    <Section title="Syntax highlighting">
                        <p>
                            Code blocks use the{" "}
                            <ExternalLink href="https://github.com/enkia/tokyo-night-vscode-theme">Tokyo Night</ExternalLink>{" "}
                            palette, via <code className="font-mono text-primary">highlight.js</code> and{" "}
                            <code className="font-mono text-primary">rehype-highlight</code>.
                        </p>
                    </Section>

                    <Section title="The stack">
                        <dl className="space-y-2">
                            {stack.map(({ label, value }) => (
                                <div key={label} className="flex flex-col sm:flex-row sm:gap-3">
                                    <dt className="font-mono text-xs text-primary sm:w-28 shrink-0 pt-0.5">{label}</dt>
                                    <dd>{value}</dd>
                                </div>
                            ))}
                        </dl>
                        <p>
                            The whole thing is{" "}
                            <ExternalLink href="https://github.com/iVcente/ivcente.github.io">on GitHub</ExternalLink>{" "}
                            if you want to see how any of it works.
                        </p>
                    </Section>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default Colophon;
