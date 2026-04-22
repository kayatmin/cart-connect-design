import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const designPath = path.join(repoRoot, 'design.md');
const brandPath = path.join(repoRoot, 'brand.md');
const outDir = path.join(repoRoot, 'generated');

const design = fs.readFileSync(designPath, 'utf8').trim();
const brand = fs.readFileSync(brandPath, 'utf8').trim();

const screenPrompts = {
  login: `Design a premium mobile agent login screen for CartConnect.\n\nUse this source of truth:\n${design}\n\nBrand notes:\n${brand}\n\nRequirements:\n- mobile-first\n- polished production-quality UI\n- title/brand presence\n- email and password fields\n- strong sign-in CTA\n- subtle trust-building styling\n- suitable for a live support agent tool`,
  dashboard: `Design the CartConnect mobile agent dashboard.\n\nUse this source of truth:\n${design}\n\nBrand notes:\n${brand}\n\nRequirements:\n- agent summary header\n- waiting/active/completed metrics\n- session list optimized for quick scanning\n- strong visual emphasis on waiting sessions\n- clean mobile hierarchy\n- polished, premium operational UI`,
  sessionDetail: `Design the CartConnect mobile session detail screen for agents.\n\nUse this source of truth:\n${design}\n\nBrand notes:\n${brand}\n\nRequirements:\n- customer identity\n- session status\n- accept / decline / end actions\n- chat timeline\n- cart panel with quantity controls and subtotal\n- room for checkout and discount actions\n- mobile-first and production-ready`,
  fullFlow: `Design a coherent mobile UI system for the CartConnect agent app.\n\nUse this source of truth:\n${design}\n\nBrand notes:\n${brand}\n\nGenerate a consistent set of screens for:\n- login\n- dashboard\n- session detail\n- chat-focused state\n- cart-edit state\n\nThe result should feel like one polished mobile product.`
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'design-source.snapshot.md'), `${design}\n\n---\n\n${brand}\n`);
for (const [name, prompt] of Object.entries(screenPrompts)) {
  fs.writeFileSync(path.join(outDir, `${name}.prompt.txt`), `${prompt.trim()}\n`);
}

console.log(`Wrote ${Object.keys(screenPrompts).length} prompt files to ${outDir}`);
