import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center grid-bg overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background pointer-events-none" />

      <div className="container relative z-10 px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <p className="font-mono text-sm text-primary mb-4 tracking-widest uppercase">
            Game Programmer
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-mono font-bold leading-tight mb-6">
            Hello, I'm{" "}
            <span className="text-primary glow-text">Your Name</span>
            <span className="inline-block w-[3px] h-[1em] bg-primary ml-1 align-middle animate-cursor-blink" />
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
            I build games and interactive experiences. Passionate about real-time rendering,
            gameplay systems, and pushing pixels to their limits. Currently exploring the
            intersection of performance and player experience.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg border border-border bg-secondary/50 text-muted-foreground hover:text-primary hover:border-primary/50 hover:glow-border transition-all"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg border border-border bg-secondary/50 text-muted-foreground hover:text-primary hover:border-primary/50 hover:glow-border transition-all"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:hello@example.com"
              className="p-3 rounded-lg border border-border bg-secondary/50 text-muted-foreground hover:text-primary hover:border-primary/50 hover:glow-border transition-all"
            >
              <Mail size={20} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
