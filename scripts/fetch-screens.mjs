#!/usr/bin/env node
// Fetch and save a screen from Stitch directly
import * as cp from 'node:child_process';
import fs from 'node:fs';
import path from 'path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const projectId = '3299141328605568565';

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

const screens = [
  { id: '0d0fe982040349c5b4a839ad0bfeed65', name: 'Auth Expired Re-auth' },
  { id: '26f4ec82f5e947b8831075d4fae418c6', name: 'No Sessions Empty State' },
  { id: '3d58b762cab842ce842f26d3bdc825fc', name: 'Network Error' },
];

const env = { ...process.env, STITCH_API_KEY: apiKey };

for (const screen of screens) {
  console.error(`Fetching ${screen.name} (${screen.id})...`);
  const payload = JSON.stringify({ projectId, screenId: screen.id });
  const result = cp.spawnSync('npx', [
    '@_davideast/stitch-mcp', 'tool', 'get_screen_code',
    '-d', payload
  ], { cwd: repoRoot, env, encoding: 'utf8' });

  if (result.status !== 0) {
    console.error(`  Failed: ${result.stderr}`);
    continue;
  }

  let data;
  try { data = JSON.parse(result.stdout); } catch { console.error('  Parse error'); continue; }

  // get_screen_code returns flat response with htmlContent
  if (!data.htmlContent) {
    console.error('  No htmlContent in response');
    console.error('  Keys:', Object.keys(data));
    continue;
  }

  const screenDir = path.join(repoRoot, 'exports', projectId, 'screens', screen.id);
  fs.mkdirSync(screenDir, { recursive: true });

  // Save screen JSON (without the large htmlContent inline — we reference the existing htmlCode downloadUrl pattern)
  const screenJson = {
    id: screen.id,
    name: `projects/${projectId}/screens/${screen.id}`,
    title: data.title || screen.name,
    deviceType: 'MOBILE',
    htmlContent: data.htmlContent,
    screenshot: data.screenshot || null,
  };

  fs.writeFileSync(path.join(screenDir, 'screen.json'), JSON.stringify(screenJson, null, 2));
  console.log(`Saved: ${screen.name} → exports/${projectId}/screens/${screen.id}/screen.json`);
}

console.error('Done');
