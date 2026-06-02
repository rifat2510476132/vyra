# VYRA — The Social Universe of 2125

VYRA is a production-oriented futuristic social platform with a Flutter client, Node.js/TypeScript API, PostgreSQL (Prisma), Socket.IO realtime, OpenAI-powered VYRA AI, and a 2125 design system.

## Architecture

```
D:\Vyra\
├── client/       Flutter (Riverpod, GoRouter, Dio, Hive)
├── server/       Express + TypeScript + Prisma + Socket.IO
├── database/     SQL reference & migration notes
├── shared/       Shared contracts (future)
├── docs/         Documentation
└── deployment/   Docker, Nginx, PM2, Railway, Render
```

## Core Systems

- **Interest Galaxy** — visual star-cluster exploration (Flutter CustomPainter)
- **VYRA AI Twin** — memory-aware AI with anti-repetition engine
- **Mood-Based Feed** — personalized content + theme shifts
- **Living Profiles** — dynamic profile environments
- **Social Energy (SES)** — reputation and visibility scoring
- **Realtime Chat** — Socket.IO with typing, presence, reactions

## Quick Start

See [INSTALL.md](./INSTALL.md) and [DEPLOY.md](./DEPLOY.md).

## Default Seed Accounts

| Email | Password |
|-------|----------|
| alice@vyra.universe | Vyra2125! |
| bob@vyra.universe | Vyra2125! |
