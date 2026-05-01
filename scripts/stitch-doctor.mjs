#!/usr/bin/env node
import { StitchToolClient } from '@google/stitch-sdk';

import { loadStitchEnv } from './stitch-env.mjs';

const { source } = loadStitchEnv();
console.log(`Using STITCH_API_KEY from: ${source}`);
console.log('SDK: @google/stitch-sdk');

const client = new StitchToolClient({ apiKey: process.env.STITCH_API_KEY });
const { tools } = await client.listTools();
console.log(`Connected to Stitch MCP. Tools available: ${tools.length}`);
const required = ['create_project', 'generate_screen_from_text', 'get_screen'];
for (const toolName of required) {
  const found = tools.some((tool) => tool.name === toolName);
  console.log(`${found ? '[ok]' : '[missing]'} ${toolName}`);
}
process.exit(0);
