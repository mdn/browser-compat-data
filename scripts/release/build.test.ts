/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import bcd from '../../index.js';
import {
  applyMirroring,
  createDataBundle,
  generateMeta,
  createManifest,
} from './build.js';

describe('build', () => {
  it('build data matches', async () => {
    const devBcd = {
      ...applyMirroring(bcd),
      __meta: generateMeta(),
    };

    assert.deepEqual(await createDataBundle(), devBcd);
  }).timeout(10000);

  it('package.json', () => {
    const manifest = createManifest();

    assert.equal(manifest.main, 'data.json');
    assert.ok(!('devDependencies' in manifest));
  });
});
