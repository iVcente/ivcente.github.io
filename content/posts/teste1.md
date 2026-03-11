---
title: "Teste1"
date: "2026-02-15"
summary: "Teste1"
tags: ["Architecture", "ECS", "Performance"]
---


# Why ECS Architecture Changed How I Think About Games

When I first started writing game code, everything was inheritance-based. A `Player` extended `Character`, which extended `Entity`. It worked — until it didn't.

## The Problem with Deep Hierarchies

The classic diamond problem rears its head fast. What happens when your `FlyingEnemy` needs both `Flying` and `Enemy` behavior? You end up with fragile multiple inheritance or awkward delegation patterns.
