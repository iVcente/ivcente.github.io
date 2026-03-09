import { motion } from "framer-motion";
import { ExternalLink, Gamepad2, Cpu, Layers } from "lucide-react";

const projects = [
  {
    title: "Voxel Engine",
    description: "A custom voxel rendering engine built from scratch with chunk-based LOD, greedy meshing, and real-time lighting.",
    tags: ["C++", "OpenGL", "GLSL"],
    icon: Cpu,
  },
  {
    title: "Dungeon Crawler",
    description: "Procedurally generated roguelike with ECS architecture, custom physics, and dynamic audio system.",
    tags: ["Rust", "WGPU", "ECS"],
    icon: Gamepad2,
  },
  {
    title: "Shader Playground",
    description: "A collection of real-time shader experiments — raymarching, post-processing effects, and compute shaders.",
    tags: ["HLSL", "Vulkan", "Compute"],
    icon: Layers,
  },
];

const ProjectsSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-mono font-bold mb-2">
            <span className="text-primary">~/</span>projects
          </h2>
          <p className="text-muted-foreground mb-12">Things I've built and worked on.</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group rounded-lg border border-border bg-card p-6 hover:border-primary/40 hover:glow-border transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <project.icon className="text-primary" size={24} />
                <ExternalLink className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
              </div>
              <h3 className="font-mono font-semibold text-lg mb-2">{project.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs font-mono px-2 py-1 rounded bg-secondary text-secondary-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
