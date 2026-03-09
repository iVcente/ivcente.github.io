Project Stack

Core
* React – UI framework
* TypeScript – typed JavaScript
* Vite – dev server + bundler
* GitHub Pages – static hosting

Styling
* Tailwind CSS – utility CSS framework
* shadcn/ui – component library built on Tailwind
* Radix UI – accessible UI primitives (used by shadcn)

Routing
* React Router

Tooling
* npm - package manager

GitHub Pages
      ↑
GitHub Actions
      ↑
Vite (build system)
      ↑
React + React Router
      ↑
Components (shadcn + Radix)
      ↑
Tailwind CSS styling
      ↑
Pages + Content
      ↑
index.html entry

my-site
│
├ index.html
├ package.json
├ vite.config.ts
├ tsconfig.json
├ tailwind.config.ts
│
├ public
│   └ favicon.ico
│
└ src
    ├ main.tsx
    ├ App.tsx
    ├ index.css
    │
    ├ components
    │   └ Navbar.tsx
    │
    └ pages
        ├ Home.tsx
        └ Blog.tsx

index.html -> loads React -> React renders everything
src/main.tsx | entry point for the React app -> render <App /> into #root
src/App.tsx | root of the application. This is where routing lives
src/pages/Home.tsx | page component
src/pages/Blog.tsx | another page component
src/components/Navbar.tsx | reusable UI component. Components are just reusable React functions
src/index.css | where Tailwind is loaded
vite.config.ts | configuration for Vite
package.json | dependencies and scripts

Full flow:
index.html
   ↓
main.tsx
   ↓
App.tsx
   ↓
React Router
   ↓
pages/*
   ↓
components/*

Build pipeline:
TypeScript
   ↓
Vite
   ↓
bundled JS + CSS
   ↓
dist/
   ↓
GitHub Pages

Convenience layers:
shadcn/ui components
Radix UI primitives
extra Tailwind configuration
extra utility files
