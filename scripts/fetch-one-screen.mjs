#!/usr/bin/env node
// Fetch and save one screen from Stitch through the official SDK.
// Usage: PROJECT_ID=<project-id> node scripts/fetch-one-screen.mjs <screenId> [screenName]
import fs from 'node:fs';
import path from 'node:path';
import { stitch } from '@google/stitch-sdk';

import { loadStitchEnv } from './stitch-env.mjs';

const repoRoot = path.resolve(import.meta.dirname, '..');
const projectId = process.env.PROJECT_ID ?? '6508137877650248936';
const screenId = process.argv[2];
const screenName = process.argv[3] || screenId;

if (!screenId) {
  console.error('Usage: PROJECT_ID=<project-id> node scripts/fetch-one-screen.mjs <screenId> [screenName]');
  process.exit(1);
}

loadStitchEnv();

console.error(`Fetching ${screenName} (${screenId})...`);
const screen = await stitch.project(projectId).getScreen(screenId);
const htmlUrl = await screen.getHtml();
const imageUrl = await screen.getImage();

const screenDir = path.join(repoRoot, 'exports', projectId, 'screens', screenId);
fs.mkdirSync(screenDir, { recursive: true });

if (htmlUrl) {
  const htmlResponse = await fetch(htmlUrl);
  if (!htmlResponse.ok) {
    throw new Error(`Failed to download HTML for ${screenId}: ${htmlResponse.status}`);
  }
  fs.writeFileSync(path.join(screenDir, 'screen.html'), await htmlResponse.text());
}

if (imageUrl) {
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error(`Failed to download image for ${screenId}: ${imageResponse.status}`);
  }
  fs.writeFileSync(path.join(screenDir, 'screen.png'), Buffer.from(await imageResponse.arrayBuffer()));
}

const screenJson = {
  id: screenId,
  name: `projects/${projectId}/screens/${screenId}`,
  title: screen.data?.title || screenName,
  deviceType: screen.data?.deviceType ?? 'MOBILE',
  htmlUrl,
  imageUrl,
  data: screen.data,
};

fs.writeFileSync(path.join(screenDir, 'screen.json'), JSON.stringify(screenJson, null, 2) + '\n');
console.error(`Saved: ${screenName} -> exports/${projectId}/screens/${screenId}`);
