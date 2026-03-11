---
title: "Why ECS Architecture Changed How I Think About Games"
date: "2026-02-15"
summary: "A deep dive into Entity Component System architecture and why it's a game-changer for performance and flexibility."
tags: ["Architecture", "ECS", "Performance"]
---

# Why ECS Architecture Changed How I Think About Games

When I first started writing game code, everything was inheritance-based. A `Player` extended `Character`, which extended `Entity`. It worked — until it didn't.

## The Problem with Deep Hierarchies

The classic diamond problem rears its head fast. What happens when your `FlyingEnemy` needs both `Flying` and `Enemy` behavior? You end up with fragile multiple inheritance or awkward delegation patterns.

```cpp
// The old way — brittle and inflexible
class FlyingEnemy : public Enemy, public Flyable {
  // Which update() gets called?
};
```

## Enter ECS

Entity Component System flips the model. **Entities** are just IDs. **Components** are pure data. **Systems** operate on components.

```rust
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
```

The beauty? Adding "flying" is just adding a component. No inheritance needed. Cache-friendly data layout comes for free.

## Takeaways

- **Composition over inheritance** isn't just a buzzword — ECS proves it at scale
- Data-oriented design leads to better cache utilization
- Decoupling data from behavior makes systems testable and reusable

ECS isn't a silver bullet, but for anything beyond a simple game jam project, it's my default architecture now.