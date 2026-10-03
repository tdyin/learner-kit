import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { root } from './validate.mjs';

try {
  if (process.argv.slice(2).some(arg => arg !== '--refresh')) throw new Error('Usage: node scripts/fetch-history.mjs [--refresh]');
  const fixture = JSON.parse(await readFile(join(root, 'examples/history/fixture.json'), 'utf8'));
  const path = join(root, fixture.image.cache);
  let data;
  if (!process.argv.includes('--refresh')) {
    try { data = await readFile(path); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  if (!data) {
    let response;
    try { response = await fetch(fixture.image.url, { signal: AbortSignal.timeout(30_000) }); }
    catch (error) { throw Object.assign(new Error(`Retrieval unavailable: ${error.message}`), { blocked: true }); }
    if (!response.ok) throw Object.assign(new Error(`Retrieval HTTP ${response.status}`), { blocked: true });
    const reader = response.body.getReader();
    const chunks = [];
    let size = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.length;
      if (size > 10_000_000) { await reader.cancel(); throw new Error('Fixture exceeds 10 MB'); }
      chunks.push(chunk.value);
    }
    data = Buffer.concat(chunks);
  }
  const hash = createHash('sha256').update(data).digest('hex');
  if (hash !== fixture.image.sha256) throw new Error(`Fixture changed: SHA-256 ${hash}; expected ${fixture.image.sha256}. Preserve the pinned fixture; review changes separately.`);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, data);
  console.log(JSON.stringify({ status: 'pass', path, sha256: hash, limits: 'Retrieval/integrity only; image inspection and desktop rendering require separate evidence.' }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ status: error.blocked ? 'blocked' : 'fail', observation: error.message }));
  process.exitCode = error.blocked ? 2 : 1;
}
