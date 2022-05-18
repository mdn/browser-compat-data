/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const prebuiltPath = '../../build/data.json';

describe('release-build', () => {
  it('pre-built bundles are identical to the source', async () => {
    execSync('npm run release-build');
    const { default: regular } = await import('../../index.js');
    const bundled = JSON.parse(
      fs.readFileSync(new URL(prebuiltPath, import.meta.url)),
    );
    assert.deepEqual(regular, bundled);
  }).timeout(5000); // Timeout must be long enough for all the file I/O
});
