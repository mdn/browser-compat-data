/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const assert = require('assert').strict;
const { execSync } = require('child_process');

const prebuiltPath = '../build';

describe('release-build', () => {
  it('pre-built bundles are identical to the source', () => {
    execSync('npm run release-build');
    const regular = require('..');
    const bundled = require(prebuiltPath);
    assert.deepEqual(regular, bundled);
  }).timeout(5000); // Timeout must be long enough for all the file I/O
});
