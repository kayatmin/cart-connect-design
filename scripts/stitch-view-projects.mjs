#!/usr/bin/env node
import { stitch } from '@google/stitch-sdk';

import { loadStitchEnv } from './stitch-env.mjs';

loadStitchEnv();

const projects = await stitch.projects();
for (const project of projects) {
  const screens = await project.screens();
  console.log(`${project.projectId}  ${project.data?.title ?? project.data?.name ?? '(untitled)'}  ${screens.length} screens`);
}
