import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const projectId = process.env.PROJECT_ID;

if (!projectId) {
  console.error('PROJECT_ID is required, e.g. PROJECT_ID=<id> npm run stitch:export');
  process.exit(1);
}

const exportDir = path.join(repoRoot, 'exports', projectId);
fs.mkdirSync(exportDir, { recursive: true });

const command = `source scripts/load-stitch-env.sh && npx @_davideast/stitch-mcp snapshot -p ${projectId}`;
const result = spawnSync('bash', ['-lc', command], {
  cwd: repoRoot,
  encoding: 'utf8'
});

fs.writeFileSync(path.join(exportDir, 'snapshot.stdout.log'), result.stdout ?? '');
fs.writeFileSync(path.join(exportDir, 'snapshot.stderr.log'), result.stderr ?? '');

if (result.status !== 0) {
  console.error(result.stderr || 'stitch export failed');
  process.exit(result.status ?? 1);
}

console.log(`Snapshot command completed for project ${projectId}. See ${exportDir}`);
