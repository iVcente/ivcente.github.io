import { Link } from "react-router-dom";

const Footer = () => (
    <footer className="border-t border-border py-8">
        <div className="container px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-mono text-sm text-muted-foreground">
                © {new Date().getFullYear()} <span className="text-primary">{"<dev />"}</span>
            </p>
            <Link
                to="/colophon"
                title="Colophon"
                className="text-xs text-muted-foreground hover:text-primary underline decoration-dotted decoration-muted-foreground/40 hover:decoration-primary underline-offset-4 transition-colors"
            >
                Amaze, amaze, amaze!
            </Link>
        </div>
    </footer>
);

export default Footer;
