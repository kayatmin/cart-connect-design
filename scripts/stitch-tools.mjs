#!/usr/bin/env node
import { StitchToolClient } from '@google/stitch-sdk';

import { loadStitchEnv } from './stitch-env.mjs';

loadStitchEnv();

const client = new StitchToolClient({ apiKey: process.env.STITCH_API_KEY });
try {
  const { tools } = await client.listTools();
  for (const tool of tools) {
    console.log(tool.name);
    if (tool.description) {
      console.log(`  ${tool.description}`);
    }
  }
} finally {
  await client.close();
}
