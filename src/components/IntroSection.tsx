import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { GrMailOption } from "react-icons/gr";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import StarfieldBackground from "@/components/StarfieldBackground";

const HeroSection = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Starfield */}
            <StarfieldBackground />
            {/* Gradient overlay — lighter so stars show through */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background pointer-events-none" />

            <div className="container relative z-10 px-6 py-32">
                <div className="flex flex-col-reverse md:flex-row items-center md:items-center gap-12 md:gap-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="max-w-3xl flex-1"
                    >
                        <p className="font-mono text-sm text-primary mb-4 tracking-widest uppercase">
                            Gameplay Programmer
                        </p>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-mono font-bold leading-tight mb-6">
                            {" "}
                            <span className="text-primary glow-text">Vicente Danzmann</span>
                            <span className="inline-block w-[3px] h-[1em] bg-primary ml-1 align-middle animate-cursor-blink" />
                        </h1>

                        <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
                            Hi! I'm a computer scientist with a strong passion for game development. I love making games and building the systems that bring them to life!
                        </p>

                        <div className="flex items-center gap-4">
                            <a
                                href="https://github.com/iVcente"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-lg border border-border bg-secondary/50 text-muted-foreground hover:text-primary hover:border-primary/50 hover:glow-border transition-all"
                            >
                                <FaGithub size={20} />
                            </a>
                            <a
                                href="https://linkedin.com/in/vicente-danzmann"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-lg border border-border bg-secondary/50 text-muted-foreground hover:text-primary hover:border-primary/50 hover:glow-border transition-all"
                            >
                                <FaLinkedin size={20} />
                            </a>
                            <a
                                href="mailto:ivcente@gmail.com"
                                className="p-3 rounded-lg border border-border bg-secondary/50 text-muted-foreground hover:text-primary hover:border-primary/50 hover:glow-border transition-all"
                            >
                                <GrMailOption size={20} />
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="shrink-0 relative"
                    >
                        {/* Orbital ring */}
                        <div className="absolute inset-[-12px] md:inset-[-14px] rounded-full border border-primary/20 animate-[spin_12s_linear_infinite]">
                            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_2px_hsl(var(--primary)/0.6)]" />
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary/60 shadow-[0_0_6px_2px_hsl(var(--primary)/0.4)]" />
                        </div>
                        {/* Counter-rotating ring */}
                        <div className="absolute inset-[-24px] md:inset-[-28px] rounded-full border border-primary/10 animate-[spin_20s_linear_infinite_reverse]">
                            <span className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary/50 shadow-[0_0_6px_2px_hsl(var(--primary)/0.3)]" />
                            <span className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 h-1 w-1 rounded-full bg-primary/40 shadow-[0_0_4px_1px_hsl(var(--primary)/0.2)]" />
                        </div>
                        <Avatar className="h-44 w-44 md:h-52 md:w-52 ring-2 ring-primary/30 animate-[glow-pulse_3s_ease-in-out_infinite]">
                            <AvatarImage src="/images/profile.jpg" alt="Profile Photo" />
                            <AvatarFallback className="bg-secondary text-primary font-mono text-4xl">VD</AvatarFallback>
                        </Avatar>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;