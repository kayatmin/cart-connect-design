#!/usr/bin/env node
// Fetch and save a screen from Stitch directly
// Usage: node scripts/fetch-one-screen.mjs <screenId> <screenName>
import * as cp from 'node:child_process';
import fs from 'node:fs';
import path from 'path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const projectId = process.env.PROJECT_ID ?? '3299141328605568565';
const screenId = process.argv[2];
const screenName = process.argv[3] || screenId;

if (!screenId) {
  console.error('Usage: node scripts/fetch-one-screen.mjs <screenId> [screenName]');
  process.exit(1);
}

let apiKey = process.env.STITCH_API_KEY;
const secretPaths = [
  '/home/rog/knowledge-base/kai/secrets/api-key.md',
  '/home/rog/knowledge-base/kai/secrets/api-keys.md',
  '/home/rog/knowledge-base/secrets/api-key.md',
  '/home/rog/knowledge-base/secrets/api-keys.md',
  '/mnt/d/knowledge-base/kai/secrets/api-key.md',
  '/mnt/d/knowledge-base/kai/secrets/api-keys.md',
];
for (const secretsPath of secretPaths) {
  if (apiKey || !fs.existsSync(secretsPath)) continue;
  const text = fs.readFileSync(secretsPath, 'utf8');
  const m = text.match(/(?:STITCH_API_KEY|SITCH_API_KEY)\s*[:=]\s*(.+)/);
  if (m) apiKey = m[1].trim().replace(/^["']|["']$/g, '');
}
if (!apiKey) { console.error('No API key'); process.exit(1); }

const env = { ...process.env, STITCH_API_KEY: apiKey };
const payload = JSON.stringify({ projectId, screenId });
console.error(`Fetching ${screenName} (${screenId})...`);

const result = cp.spawnSync('npx', [
  '@_davideast/stitch-mcp', 'tool', 'get_screen_code',
  '-d', payload
], { cwd: repoRoot, env, encoding: 'utf8' });

if (result.status !== 0) {
  console.error(`Failed: ${result.stderr}`);
  process.exit(1);
}

let data;
try { data = JSON.parse(result.stdout); } catch { console.error('Parse error'); process.exit(1); }

if (!data.htmlContent) {
  console.error('No htmlContent in response');
  console.error('Keys:', Object.keys(data));
  process.exit(1);
}

const screenDir = path.join(repoRoot, 'exports', projectId, 'screens', screenId);
fs.mkdirSync(screenDir, { recursive: true });

const screenJson = {
  id: screenId,
  name: `projects/${projectId}/screens/${screenId}`,
  title: data.title || screenName,
  deviceType: 'MOBILE',
  htmlContent: data.htmlContent,
  screenshot: data.screenshot || null,
};

fs.writeFileSync(path.join(screenDir, 'screen.json'), JSON.stringify(screenJson, null, 2));
console.error(`Saved: ${screenName} → exports/${projectId}/screens/${screenId}/screen.json`);
