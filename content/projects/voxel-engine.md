---
title: "Voxel Engine"
date: "2025-11-01"
summary: "A custom voxel rendering engine built from scratch with chunk-based LOD, greedy meshing, and real-time lighting."
tags: ["C++", "OpenGL", "GLSL"]
cover: "/images/projects/voxel-engine.jpg"
status: "Complete"
role: "Solo Developer"
team_size: "1"
duration: "6 months"
platform: "Desktop (Windows/Linux)"
github: "https://github.com"
demo: ""
video: ""
---

# Voxel Engine

A high-performance voxel rendering engine written in C++ and OpenGL, designed from the ground up for real-time world exploration and editing.

## Motivation

I wanted to deeply understand how engines like Minecraft's work under the hood — chunk management, meshing strategies, and lighting — so I built one from scratch.

## Key Features

- **Chunk-based world management** with configurable chunk sizes and LOD levels
- **Greedy meshing** algorithm that reduces polygon count by ~85% compared to naive approaches
- **Real-time lighting** with ambient occlusion and dynamic point lights
- **Frustum culling** and occlusion queries for efficient rendering
- **Multi-threaded chunk generation** using a producer-consumer pattern

## Technical Deep Dive

The engine uses a 3-level LOD system. Close chunks render at full resolution, mid-range chunks use simplified meshes, and distant chunks are rendered as impostors. The greedy meshing pass runs on a worker thread and produces optimized vertex buffers that get uploaded to the GPU on the main thread.

Lighting uses a flood-fill algorithm for block light and a heightmap-based approach for sunlight, both running asynchronously when chunks are modified.

## Lessons Learned

- Greedy meshing is essential — naive face-per-voxel rendering kills performance past a few hundred chunks
- Thread synchronization around GPU resources requires careful design
- Profiling early and often saved me from several architectural dead ends