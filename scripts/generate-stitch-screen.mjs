import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const screen = process.env.SCREEN ?? 'dashboard';
const projectId = process.env.PROJECT_ID;
const toolName = process.env.STITCH_GENERATE_TOOL ?? 'generate_screen_from_text';

if (!projectId) {
  console.error('PROJECT_ID is required, e.g. PROJECT_ID=<id> SCREEN=dashboard npm run stitch:generate:screen');
  process.exit(1);
}

const promptPath = path.join(repoRoot, 'generated', `${screen}.prompt.txt`);
if (!fs.existsSync(promptPath)) {
  console.error(`Prompt file missing: ${promptPath}. Run npm run prompt:build first.`);
  process.exit(1);
}

const prompt = fs.readFileSync(promptPath, 'utf8').trim();
const payload = JSON.stringify({ projectId, prompt }, null, 2);
const payloadPath = path.join(repoRoot, 'generated', `${screen}.request.json`);
fs.writeFileSync(payloadPath, payload + '\n');

const command = `source scripts/load-stitch-env.sh && npx @_davideast/stitch-mcp tool ${toolName} -d @${JSON.stringify(payloadPath)}`;
const result = spawnSync('bash', ['-lc', command], {
  cwd: repoRoot,
  encoding: 'utf8'
});

fs.writeFileSync(path.join(repoRoot, 'generated', `${screen}.response.stdout.log`), result.stdout ?? '');
fs.writeFileSync(path.join(repoRoot, 'generated', `${screen}.response.stderr.log`), result.stderr ?? '');

if (result.status !== 0) {
  console.error(result.stderr || `Stitch tool ${toolName} failed`);
  process.exit(result.status ?? 1);
}

console.log(result.stdout);
