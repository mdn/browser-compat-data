import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';

const prebuiltPath = '../build/index.js';

describe('release-build', () => {
  it('pre-built bundles are identical to the source', async () => {
    execSync('npm run release-build');
    const { default: regular } = await import('../index.js');
    const { default: bundled } = await import(prebuiltPath);
    assert.deepEqual(regular, bundled);
  }).timeout(5000); // Timeout must be long enough for all the file I/O
});
