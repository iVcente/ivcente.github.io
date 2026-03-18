---
title: "Dungeon Crawler"
date: "2025-08-15"
summary: "Procedurally generated roguelike with ECS architecture, custom physics, and dynamic audio system."
tags: ["Rust", "WGPU", "ECS"]
cover: "/images/projects/dungeon-crawler.jpg"
status: "In Progress"
role: "Lead Developer"
team_size: "2"
duration: "4 months"
platform: "Desktop / Web (WASM)"
github: "https://github.com"
demo: ""
video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
---

# Dungeon Crawler

A procedurally generated roguelike built in Rust with a custom ECS framework and WGPU rendering backend.

## Architecture

The game is built around a custom Entity-Component-System architecture. Entities are just IDs, components are plain data structs stored in typed arenas, and systems are functions that query component sets.

## Procedural Generation

Dungeons are generated using a combination of BSP tree room placement and cellular automata for cave sections. A post-processing pass ensures connectivity and places items, enemies, and traps based on difficulty curves.

## Audio System

The dynamic audio system adjusts music layers based on game state — exploration triggers ambient pads, combat fades in percussion and intensity layers, and boss encounters have custom compositions that react to player health.

## Current Status

The game is playable with 5 dungeon floors, 12 enemy types, and a basic item/inventory system. Currently working on adding multiplayer co-op via WebSocket sync.