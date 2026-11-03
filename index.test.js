/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import dataFolders from './scripts/lib/data-folders.js';

import bcd from './index.js';

describe('index', () => {
  it('exports exactly the data folders', () => {
    assert.deepEqual(Object.keys(bcd).sort(), [...dataFolders].sort());
  });
});
