const Footer = () => (
  <footer className="border-t border-border py-8">
    <div className="container px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="font-mono text-sm text-muted-foreground">
        © {new Date().getFullYear()} <span className="text-primary">{"<dev />"}</span>
      </p>
      <p className="text-xs text-muted-foreground">
        Built with passion and too much coffee.
      </p>
    </div>
  </footer>
);

export default Footer;
