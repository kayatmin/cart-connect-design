# Stitch automation workflow

## Intent

Automate the loop:

`design.md` -> prompt generation -> Stitch -> exports -> implementation handoff

## Secret loading

The repo never stores the Stitch key.

Runtime helpers try, in order:
1. `STITCH_API_KEY` from the environment
2. `knowledge-base/secrets/api-keys` or `.md`
3. `/knowledge-base/secrets/api-keys` or `.md`
4. `/home/rog/knowledge-base/secrets/api-keys` or `.md`
5. `/mnt/d/knowledge-base/secrets/api-keys` or `.md`
6. `/mnt/d/knowledge-base/kai/secrets/api-keys` or `.md`
7. `../knowledge-base/secrets/api-keys` or `.md`
8. `../../knowledge-base/secrets/api-keys` or `.md`

Expected line format:
- `STITCH_API_KEY=...`
- `STITCH_API_KEY: ...`

Current known host-mounted location on this machine:
- `/mnt/d/knowledge-base/kai/secrets/api-keys.md`

## Tooling choice

This repo uses the community Stitch MCP helper CLI:
- package: `@_davideast/stitch-mcp`

That gives us:
- project browsing
- screen browsing
- MCP proxy for agents
- project/screen exports

## Typical loop

1. Update `design.md`
2. Run `npm run prompt:build`
3. Use generated prompts to create/update Stitch screens
4. Export the latest project artifacts into `exports/`
5. Feed those assets into implementation work

## Current automation coverage

- prompt generation from `design.md`
- local key loading
- Stitch doctor/proxy/tool listing helpers
- project export helper scaffold
- MCP config examples for agent clients

## Near-term next step

Once the secrets path is confirmed on this machine, run:

```bash
npm install
npm run stitch:doctor
npm run stitch:tools
```

Then we can lock in the exact upstream tool names and complete the generation/export scripts against the real Stitch account.
