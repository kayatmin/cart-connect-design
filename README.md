# cart-connect-design

Source-controlled CartConnect design workflow repo.

This repo is the single home for:
- `design.md` product and UI intent
- Stitch automation helpers
- exported Stitch artifacts
- prompt generation for design iteration
- MCP/client config examples for agent-driven design work

## Goal

Keep design intent, generated Stitch prompts, and exported mocks under version control so design and implementation can round-trip cleanly.

## Repo layout

- `design.md` — primary design source of truth
- `brand.md` — reusable visual system and brand notes
- `input/` — reference screenshots, inspiration, wireframes
- `generated/` — prompt artifacts generated from `design.md`
- `exports/` — Stitch exports and snapshots
- `scripts/` — local automation scripts
- `config/` — example MCP/client config snippets
- `docs/` — workflow docs

## Setup

### 1. Stitch auth

Supported secret sources, in preferred order:
1. `STITCH_API_KEY` in the environment
2. `STITCH_API_KEY_FILE` pointing at a local file that contains `STITCH_API_KEY=...`

Expected pattern:
- `STITCH_API_KEY=...`

The helper scripts do not search repo-relative or personal secret paths. Keep secret files outside the repo or in ignored local-only paths.

### 2. Install local tooling

```bash
npm install
```

### 3. Verify Stitch access

```bash
npm run stitch:doctor
npm run stitch:tools
```

## Common workflow

### Generate a fresh prompt bundle from `design.md`

```bash
npm run prompt:build
```

### List Stitch tools available through the official SDK

```bash
npm run stitch:tools
```

### Start a local Stitch MCP proxy for agents/tools

```bash
npm run stitch:proxy
```

### Browse Stitch projects interactively

```bash
npm run stitch:view:projects
```

### Export screens for a project

```bash
PROJECT_ID=<project-id> npm run stitch:export
```

### Generate or refresh one screen

```bash
PROJECT_ID=<project-id> SCREEN=dashboard npm run stitch:generate:screen
```

`SCREEN` maps to `generated/<screen>.prompt.txt`. Run `npm run prompt:build` first after changing `design.md`.

## Notes

- This repo does **not** store the Stitch API key.
- The scripts load `STITCH_API_KEY` at runtime from env or from the explicit `STITCH_API_KEY_FILE` path.
- Stitch automation uses Google's `@google/stitch-sdk` package.
- `design.md` should be updated before asking agents to generate new screens.
