/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';

const packageJson = JSON.parse(
  await fs.readFile(new URL('../../package.json', import.meta.url), 'utf-8'),
);

const prebuiltPath = '../../build';

describe('release-build', () => {
  it('pre-built bundles are identical to the source', async () => {
    execSync('npm run release-build');
    const { default: regular } = await import('../../index.js');
    const bundled = JSON.parse(
      await fs.readFile(new URL(prebuiltPath, import.meta.url)),
    );
    assert.deepEqual(
      { ...regular, __meta: { version: packageJson.version } },
      bundled,
    );
  }).timeout(5000); // Timeout must be long enough for all the file I/O
});
