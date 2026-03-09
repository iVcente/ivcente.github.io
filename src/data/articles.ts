export interface Article {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  content: string;
}

export const articles: Article[] = [
  {
    slug: "ecs-architecture-in-games",
    title: "Why ECS Architecture Changed How I Think About Games",
    date: "2026-02-15",
    summary: "A deep dive into Entity Component System architecture and why it's a game-changer for performance and flexibility.",
    tags: ["Architecture", "ECS", "Performance"],
    content: `
# Why ECS Architecture Changed How I Think About Games

When I first started writing game code, everything was inheritance-based. A \`Player\` extended \`Character\`, which extended \`Entity\`. It worked — until it didn't.

## The Problem with Deep Hierarchies

The classic diamond problem rears its head fast. What happens when your \`FlyingEnemy\` needs both \`Flying\` and \`Enemy\` behavior? You end up with fragile multiple inheritance or awkward delegation patterns.

\`\`\`cpp
// The old way — brittle and inflexible
class FlyingEnemy : public Enemy, public Flyable {
  // Which update() gets called?
};
\`\`\`

## Enter ECS

Entity Component System flips the model. **Entities** are just IDs. **Components** are pure data. **Systems** operate on components.

\`\`\`rust
// Components are just data
struct Position { x: f32, y: f32 }
struct Velocity { dx: f32, dy: f32 }
struct Health { current: i32, max: i32 }

// Systems operate on component queries
fn movement_system(query: Query<(&mut Position, &Velocity)>) {
    for (mut pos, vel) in query.iter_mut() {
        pos.x += vel.dx;
        pos.y += vel.dy;
    }
}
\`\`\`

The beauty? Adding "flying" is just adding a component. No inheritance needed. Cache-friendly data layout comes for free.

## Takeaways

- **Composition over inheritance** isn't just a buzzword — ECS proves it at scale
- Data-oriented design leads to better cache utilization
- Decoupling data from behavior makes systems testable and reusable

ECS isn't a silver bullet, but for anything beyond a simple game jam project, it's my default architecture now.
`,
  },
  {
    slug: "shader-optimization-tricks",
    title: "5 Shader Optimization Tricks I Wish I Knew Earlier",
    date: "2026-01-20",
    summary: "Practical GPU optimization techniques that made a real difference in my rendering pipeline.",
    tags: ["Shaders", "GPU", "Optimization"],
    content: `
# 5 Shader Optimization Tricks I Wish I Knew Earlier

After spending months profiling my custom renderer, here are the GPU optimization techniques that actually moved the needle.

## 1. Branch Elimination

GPUs hate branches. Instead of:

\`\`\`glsl
if (light_count > 0) {
    color = calculate_lighting();
} else {
    color = ambient;
}
\`\`\`

Use:

\`\`\`glsl
float has_lights = step(0.5, float(light_count));
color = mix(ambient, calculate_lighting(), has_lights);
\`\`\`

## 2. Swizzle Operations Are Free

Rearranging vector components costs nothing on modern GPUs. Use it liberally.

## 3. Texture Atlasing

Fewer texture binds = fewer draw calls = better performance. Pack related textures into atlases.

## 4. Early Depth Testing

Enable early-z by not writing to \`gl_FragDepth\` unless absolutely necessary. This lets the GPU skip fragments that are occluded.

## 5. Compute Shader Pre-passes

Move expensive calculations to compute shaders that run before your main render pass. Tile-based light culling is a classic example.

These aren't revolutionary ideas, but applying them consistently improved my frame times by ~40%.
`,
  },
  {
    slug: "procedural-generation-lessons",
    title: "Lessons from Building a Procedural Dungeon Generator",
    date: "2025-12-08",
    summary: "What I learned building a dungeon generator from scratch — the wins, the pitfalls, and the surprising math.",
    tags: ["Procedural", "Algorithms", "Game Design"],
    content: `
# Lessons from Building a Procedural Dungeon Generator

Procedural generation is one of those things that sounds simple until you actually try it. "Just place some rooms and connect them" — if only.

## The BSP Approach

Binary Space Partitioning turned out to be the most reliable starting point. Recursively subdivide the space, place rooms in leaves, connect siblings.

\`\`\`
┌───────────────────────┐
│           │           │
│   Room A  │   Room B  │
│           │           │
│───────────│───────────│
│           │           │
│   Room C  │   Room D  │
│           │           │
└───────────────────────┘
\`\`\`

## Key Lessons

1. **Randomness needs constraints.** Pure random placement creates unplayable layouts. Add minimum room sizes, corridor width rules, and connectivity validation.

2. **Validate connectivity.** Use flood fill to ensure every room is reachable. Nothing kills a run like a locked door with no key.

3. **Layer your generation.** First: structure. Then: enemy placement. Then: loot. Each layer can have its own rules without coupling to the others.

4. **Seeds are your best friend.** Deterministic generation from a seed makes debugging possible and lets players share interesting maps.

The generator now produces varied, playable dungeons with consistent quality. The secret was less "clever algorithms" and more "boring validation passes."
`,
  },
];
