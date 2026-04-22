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

Preferred secret source:
- `knowledge-base/secrets/api-keys`

Expected pattern:
- `STITCH_API_KEY=...`

The helper scripts will also check a few common fallback locations if that file is not mounted.

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

### List Stitch tools available through the proxy

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

## Notes

- This repo does **not** store the Stitch API key.
- The scripts load `STITCH_API_KEY` at runtime from env or the knowledge-base secrets file.
- `design.md` should be updated before asking agents to generate new screens.
