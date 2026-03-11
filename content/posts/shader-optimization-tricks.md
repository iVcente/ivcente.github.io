---
title: "5 Shader Optimization Tricks I Wish I Knew Earlier"
date: "2026-01-20"
summary: "Practical GPU optimization techniques that made a real difference in my rendering pipeline."
tags: ["Shaders", "GPU", "Optimization"]
---

# 5 Shader Optimization Tricks I Wish I Knew Earlier

After spending months profiling my custom renderer, here are the GPU optimization techniques that actually moved the needle.

## 1. Branch Elimination

GPUs hate branches. Instead of:

```glsl
if (light_count > 0) {
    color = calculate_lighting();
} else {
    color = ambient;
}
```

Use:

```glsl
float has_lights = step(0.5, float(light_count));
color = mix(ambient, calculate_lighting(), has_lights);
```

## 2. Swizzle Operations Are Free

Rearranging vector components costs nothing on modern GPUs. Use it liberally.

## 3. Texture Atlasing

Fewer texture binds = fewer draw calls = better performance. Pack related textures into atlases.

## 4. Early Depth Testing

Enable early-z by not writing to `gl_FragDepth` unless absolutely necessary. This lets the GPU skip fragments that are occluded.

## 5. Compute Shader Pre-passes

Move expensive calculations to compute shaders that run before your main render pass. Tile-based light culling is a classic example.

These aren't revolutionary ideas, but applying them consistently improved my frame times by ~40%.