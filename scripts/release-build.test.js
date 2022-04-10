'use strict';
const assert = require('assert');
const { execSync } = require('child_process');

const prebuiltCjsPath = '../build';
const prebuiltJsPath = '../build/index.js';

const regular = require('..');

describe('release-build', () => {
  before(() => {
    execSync('npm run release-build');
  });

  it('pre-built cjs bundles are identical to the source', () => {
    const bundled = require(prebuiltCjsPath);
    assert.deepEqual(regular, bundled);
  }).timeout(5000); // Timeout must be long enough for all the file I/O;

  it('pre-built esm bundles are identical to the source', async () => {
    const { default: bundled } = await import(prebuiltJsPath);
    assert.deepEqual(regular, bundled);
  }).timeout(5000); // Timeout must be long enough for all the file I/O;
});
