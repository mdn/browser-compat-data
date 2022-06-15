/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { BrowserName } from '../../types/types.js';

import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

import bcd from '../../index.js';
import { applyMirroring, createDataBundle } from './build.js';

const packageJson = JSON.parse(
  await fs.readFile(new URL('../../package.json', import.meta.url), 'utf-8'),
);

describe('build', () => {
  it('build data matches', async () => {
    const devBcd = {
      ...applyMirroring(bcd),
      __meta: { version: packageJson.version },
    };

    assert.deepEqual(await createDataBundle(), devBcd);
  });
});
