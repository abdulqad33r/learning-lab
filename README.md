# Learning Lab

A personal coding practice repository for frontend and backend concepts, organized by topic, runtime, and technology so every topic is easy to revisit.

## Structure

- `frontend/react/` — React practice (hooks, patterns, state management)
- `frontend/vanilla/` — Vanilla JS practice (DOM, events, browser APIs)
- `backend/node/` — Node.js backend practice
- `backend/bun/` — Bun backend practice

Each topic gets its own folder with a `README.md` (what it is, when to use it, tech stack) and a demo file.

## Tech Stack

**Language:** TypeScript

**Runtimes:** Bun, Node.js

**Database / ORM:** MongoDB, PostgreSQL, Drizzle ORM

**Backend:** Express, Hono

**Frontend:**

- React, React Router, TanStack Router, TanStack Query
- React Hook Form, Axios
- Tailwind CSS, Shadcn/UI, Framer Motion

## Usage

```bash
bun new  # create a new topic when select the choices
bun search <keyword>                               # find a topic by tag/runtime/name
bun index                                          # regenerate INDEX.md
```

> **Note:** `INDEX.md` is generated automatically. Do not edit it manually.

See [INDEX.md](./INDEX.md) for the full list of topics covered so far.

## Example

```text
frontend/
└── react/
    └── context-api/
        ├── README.md
        └── demo.tsx

backend/
├── node/
│   ├── rate-limiting-express/
│   │   ├── README.md
│   │   └── demo.ts
│   └── rate-limiting-hono/
│       ├── README.md
│       └── demo.ts
└── bun/
    ├── rate-limiting-hono-mongodb/
    │   ├── README.md
    │   └── demo.ts
    └── rate-limiting-hono-postgres/
        ├── README.md
        └── demo.ts
```

## Why this exists

As I learned new frontend and backend concepts, I found it difficult to keep practice projects organized and easy to revisit.

This repository serves as a searchable knowledge base where each concept has its own documentation and working example, making it easy to review patterns months later.
