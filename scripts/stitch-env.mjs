import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');

function readApiKeyFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const match = line.match(/^STITCH_API_KEY\s*[:=]\s*(.+)$/);
    if (!match) {
      continue;
    }

    const apiKey = match[1].trim().replace(/^["']|["']$/g, '');
    if (apiKey) {
      return apiKey;
    }
  }

  throw new Error(`STITCH_API_KEY_FILE did not contain STITCH_API_KEY: ${filePath}`);
}

export function loadStitchEnv() {
  if (process.env.STITCH_API_KEY) {
    return { apiKey: process.env.STITCH_API_KEY, source: 'environment' };
  }

  if (process.env.STITCH_API_KEY_FILE) {
    const filePath = path.resolve(process.env.STITCH_API_KEY_FILE);
    const apiKey = readApiKeyFile(filePath);
    process.env.STITCH_API_KEY = apiKey;
    process.env.STITCH_API_KEY_SOURCE = filePath;
    return { apiKey, source: filePath };
  }

  throw new Error('STITCH_API_KEY not found. Set STITCH_API_KEY or STITCH_API_KEY_FILE.');
}

export function requireProjectId(example = 'PROJECT_ID=<id> npm run stitch:export') {
  const projectId = process.env.PROJECT_ID;
  if (!projectId) {
    throw new Error(`PROJECT_ID is required, e.g. ${example}`);
  }
  return projectId;
}

export function repoPath(...segments) {
  return path.join(repoRoot, ...segments);
}
