import fs from 'node:fs';
import path from 'node:path';
import { stitch } from '@google/stitch-sdk';

import { loadStitchEnv, requireProjectId } from './stitch-env.mjs';

const repoRoot = path.resolve(import.meta.dirname, '..');
const projectId = requireProjectId('PROJECT_ID=<id> npm run stitch:export');

const exportDir = path.join(repoRoot, 'exports', projectId);
fs.mkdirSync(exportDir, { recursive: true });

loadStitchEnv();

const project = stitch.project(projectId);
const screens = await project.screens();
const manifest = {
  projectId,
  exportedAt: new Date().toISOString(),
  screenCount: screens.length,
  screens: [],
};

for (const screen of screens) {
  const screenDir = path.join(exportDir, 'screens', screen.screenId);
  fs.mkdirSync(screenDir, { recursive: true });
  const htmlUrl = await screen.getHtml();
  const imageUrl = await screen.getImage();
  const title = screen.data?.title ?? screen.data?.displayName ?? screen.screenId;

  if (htmlUrl) {
    const htmlResponse = await fetch(htmlUrl);
    if (!htmlResponse.ok) {
      throw new Error(`Failed to download HTML for ${screen.screenId}: ${htmlResponse.status}`);
    }
    fs.writeFileSync(path.join(screenDir, 'screen.html'), await htmlResponse.text());
  }

  if (imageUrl) {
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image for ${screen.screenId}: ${imageResponse.status}`);
    }
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    fs.writeFileSync(path.join(screenDir, 'screen.png'), imageBuffer);
  }

  manifest.screens.push({
    id: screen.screenId,
    title,
    htmlUrl,
    imageUrl,
  });
  fs.writeFileSync(
    path.join(screenDir, 'screen.json'),
    JSON.stringify(
      {
        id: screen.screenId,
        name: `projects/${projectId}/screens/${screen.screenId}`,
        title,
        deviceType: screen.data?.deviceType ?? 'MOBILE',
        htmlUrl,
        imageUrl,
        data: screen.data,
      },
      null,
      2,
    ) + '\n',
  );
}

fs.writeFileSync(path.join(exportDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

console.log(`Exported ${screens.length} screens for project ${projectId} to ${exportDir}`);
