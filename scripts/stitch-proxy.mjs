#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StitchProxy } from '@google/stitch-sdk';

import { loadStitchEnv } from './stitch-env.mjs';

loadStitchEnv();

const proxy = new StitchProxy({ apiKey: process.env.STITCH_API_KEY });
const transport = new StdioServerTransport();
await proxy.start(transport);
