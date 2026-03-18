---
title: "Shader Playground"
date: "2025-06-01"
summary: "A collection of real-time shader experiments — raymarching, post-processing effects, and compute shaders."
tags: ["HLSL", "Vulkan", "Compute"]
cover: "/images/projects/shader-playground.jpg"
status: "Ongoing"
role: "Solo Developer"
team_size: "1"
duration: "Ongoing"
platform: "Desktop"
github: "https://github.com"
demo: "https://shadertoy.com"
video: ""
---

# Shader Playground

An ever-growing collection of GPU shader experiments, from classic raymarching to modern compute shader techniques.

## Experiments

### Raymarched Fractals
Mandelbulb and Julia set visualizations using signed distance fields. Includes orbit trap coloring and adaptive step size for better performance.

### Post-Processing Stack
A modular post-processing pipeline: bloom, chromatic aberration, film grain, CRT scanlines, and a custom tilt-shift depth-of-field effect.

### Compute Shader Physics
GPU-driven particle systems with spatial hashing for collision detection. Supports up to 1M particles at 60fps on mid-range hardware.

### Volumetric Lighting
Screen-space volumetric light shafts using ray marching against the depth buffer. Integrates with shadow maps for realistic god rays.

## Tech Stack

Built with Vulkan for maximum control over the rendering pipeline. Each experiment is self-contained with its own descriptor sets and pipeline states. A hot-reload system watches shader files and recompiles on save. 