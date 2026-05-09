# Contributing

CartConnect is split across sibling repositories. Before changing this repo, read its `README.md`, `design.md`, `brand.md`, and the workspace docs in `../cart-connect-docs`.

## Local Checks

```bash
npm install
npm run prompt:build
npm run stitch:doctor
```

`npm run stitch:doctor` requires `STITCH_API_KEY` or `STITCH_API_KEY_FILE`.

## Pull Request Notes

- Explain which design source, prompt, or export changed.
- Link related implementation changes when a design update affects an app repo.
- Include screenshots or exported artifacts for visual changes.
- Do not commit API keys, local secret files, or personal MCP/client config.
