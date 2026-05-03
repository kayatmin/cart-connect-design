# Stitch automation workflow

## Intent

Automate the loop:

`design.md` -> prompt generation -> Stitch -> exports -> implementation handoff

## Secret loading

The repo never stores the Stitch key.

Runtime helpers try, in order:
1. `STITCH_API_KEY` from the environment
2. `STITCH_API_KEY_FILE` pointing at a local file that contains `STITCH_API_KEY=...`


Expected line format:
- `STITCH_API_KEY=...`

Helpers intentionally do not search hardcoded personal directories or repo-relative `knowledge-base/secrets` fallbacks. Keep secret files outside the repo or in ignored local-only paths, and pass the exact file with `STITCH_API_KEY_FILE=/path/to/file`.

## Tooling choice

This repo uses Google's Stitch SDK:
- package: `@google/stitch-sdk`
- repository: `google-labs-code/stitch-sdk`

That gives us:
- project browsing
- screen browsing
- MCP proxy for agents
- screen generation from prompts
- project/screen exports

## Typical loop

1. Update `design.md`
2. Run `npm run prompt:build`
3. Use generated prompts to create/update Stitch screens
4. Export the latest project artifacts into `exports/`
5. Feed those assets into implementation work

Current commands:

```bash
npm run stitch:doctor
npm run stitch:tools
npm run stitch:view:projects
PROJECT_ID=<project-id> SCREEN=<screen-name> npm run stitch:generate:screen
PROJECT_ID=<project-id> npm run stitch:export
```

## Current automation coverage

- prompt generation from `design.md`
- explicit env/file key loading
- Stitch doctor/proxy/tool listing helpers through `@google/stitch-sdk`
- project export into `exports/<project-id>/screens/<screen-id>/`
- MCP config examples for agent clients

## Near-term next step

When setting up a new machine, run:

```bash
npm install
npm run stitch:doctor
npm run stitch:tools
```

Then run `npm run stitch:view:projects` to locate the current project id before generating or exporting screens.
