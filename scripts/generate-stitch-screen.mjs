import fs from 'node:fs';
import path from 'node:path';
import { stitch } from '@google/stitch-sdk';

import { loadStitchEnv } from './stitch-env.mjs';

const repoRoot = path.resolve(import.meta.dirname, '..');
const screen = process.env.SCREEN ?? 'dashboard';
const projectId = process.env.PROJECT_ID ?? '6508137877650248936';
const deviceType = (process.env.STITCH_DEVICE_TYPE ?? 'MOBILE').toUpperCase();

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
const payloadObject = { projectId, deviceType, prompt };
const payload = JSON.stringify(payloadObject, null, 2);
const payloadPath = path.join(repoRoot, 'generated', `${screen}.request.json`);
fs.writeFileSync(payloadPath, payload + '\n');

try {
  loadStitchEnv();
  const project = stitch.project(projectId);
  const generated = await project.generate(prompt, deviceType);
  const htmlUrl = await generated.getHtml();
  const imageUrl = await generated.getImage();
  const response = {
    screen: screen,
    projectId,
    screenId: generated.screenId,
    htmlUrl,
    imageUrl,
    data: generated.data,
  };
  fs.writeFileSync(
    path.join(repoRoot, 'generated', `${screen}.response.json`),
    JSON.stringify(response, null, 2) + '\n',
  );
  console.log(JSON.stringify(response, null, 2));
} catch (error) {
  fs.writeFileSync(
    path.join(repoRoot, 'generated', `${screen}.response.error.log`),
    `${error?.stack ?? error}\n`,
  );
  throw error;
}
