import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');

const secretCandidates = [
  path.join(repoRoot, 'knowledge-base/secrets/api-keys'),
  path.join(repoRoot, 'knowledge-base/secrets/api-keys.md'),
  '/knowledge-base/secrets/api-keys',
  '/knowledge-base/secrets/api-keys.md',
  '/home/rog/knowledge-base/secrets/api-keys',
  '/home/rog/knowledge-base/secrets/api-key',
  '/home/rog/knowledge-base/secrets/api-keys.md',
  '/home/rog/knowledge-base/secrets/api-key.md',
  '/home/rog/knowledge-base/kai/secrets/api-key',
  '/home/rog/knowledge-base/kai/secrets/api-key.md',
  '/home/rog/knowledge-base/kai/secrets/api-keys',
  '/home/rog/knowledge-base/kai/secrets/api-keys.md',
  '/mnt/d/knowledge-base/secrets/api-keys',
  '/mnt/d/knowledge-base/secrets/api-key',
  '/mnt/d/knowledge-base/secrets/api-keys.md',
  '/mnt/d/knowledge-base/secrets/api-key.md',
  '/mnt/d/knowledge-base/kai/secrets/api-key',
  '/mnt/d/knowledge-base/kai/secrets/api-key.md',
  '/mnt/d/knowledge-base/kai/secrets/api-keys',
  '/mnt/d/knowledge-base/kai/secrets/api-keys.md',
  path.join(repoRoot, '../knowledge-base/secrets/api-keys'),
  path.join(repoRoot, '../knowledge-base/secrets/api-keys.md'),
  path.join(repoRoot, '../../knowledge-base/secrets/api-keys'),
  path.join(repoRoot, '../../knowledge-base/secrets/api-keys.md'),
];

export function loadStitchEnv() {
  if (process.env.STITCH_API_KEY) {
    return { apiKey: process.env.STITCH_API_KEY, source: 'environment' };
  }

  for (const candidate of secretCandidates) {
    if (!fs.existsSync(candidate)) {
      continue;
    }

    const text = fs.readFileSync(candidate, 'utf8');
    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) {
        continue;
      }

      const match = line.match(/(?:STITCH_API_KEY|SITCH_API_KEY)\s*[:=]\s*(.+)$/);
      if (!match) {
        continue;
      }

      const apiKey = match[1].trim().replace(/^["']|["']$/g, '');
      if (apiKey) {
        process.env.STITCH_API_KEY = apiKey;
        process.env.STITCH_API_KEY_SOURCE = candidate;
        return { apiKey, source: candidate };
      }
    }
  }

  throw new Error('STITCH_API_KEY not found. Checked env and knowledge-base secret paths.');
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
