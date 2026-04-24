#!/usr/bin/env node
// Direct Stitch screen generator - bypasses bash -lc quoting issues
import * as cp from 'node:child_process';
import fs from 'node:fs';
import path from 'path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const screen = process.env.SCREEN ?? 'authExpired';
const projectId = process.env.PROJECT_ID ?? '3299141328605568565';

const promptPath = path.join(repoRoot, 'generated', `${screen}.prompt.txt`);
if (!fs.existsSync(promptPath)) {
  console.error(`Prompt file missing: ${promptPath}. Run npm run prompt:build first.`);
  process.exit(1);
}

// Load API key from secrets
const secretsPath = '/mnt/d/knowledge-base/kai/secrets/api-keys.md';
let apiKey = process.env.STITCH_API_KEY;
if (!apiKey && fs.existsSync(secretsPath)) {
  const text = fs.readFileSync(secretsPath, 'utf8');
  const m = text.match(/STITCH_API_KEY\s*[:=]\s*(.+)/);
  if (m) apiKey = m[1].trim().replace(/^["']|["']$/g, '');
}
if (!apiKey) {
  console.error('STITCH_API_KEY not found');
  process.exit(1);
}

const prompt = fs.readFileSync(promptPath, 'utf8').trim();
const payload = JSON.stringify({ projectId, deviceType: 'MOBILE', prompt });

console.error(`Generating screen: ${screen}`);
console.error(`Project: ${projectId}`);
console.error(`Prompt length: ${prompt.length} chars`);

const result = cp.spawnSync('npx', [
  '@_davideast/stitch-mcp', 'tool', 'generate_screen_from_text',
  '-d', payload
], {
  cwd: repoRoot,
  env: { ...process.env, STITCH_API_KEY: apiKey },
  encoding: 'utf8'
});

console.log(result.stdout);
if (result.status !== 0) {
  console.error(result.stderr);
  process.exit(result.status ?? 1);
}
