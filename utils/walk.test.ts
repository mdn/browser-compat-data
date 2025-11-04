/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import dataFolders from '../scripts/lib/data-folders.js';
import bcd from '../index.js';

import walk, { lowLevelWalk } from './walk.js';

describe('lowLevelWalk()', () => {
  it('visits every top-level tree', () => {
    const steps = Array.from(lowLevelWalk(undefined, undefined, 1));
    const paths = steps.map((step) => step.path);
    assert.equal(steps.length, dataFolders.length);
    assert.deepEqual(paths, dataFolders);
  });
  it('visits every point in the tree', () => {
    const paths = Array.from(lowLevelWalk()).map((step) => step.path);
    assert.ok(paths.length > 13000);
  });
});

describe('walk()', () => {
  it('should visit deeply nested features', () => {
    const results = Array.from(walk('html')).map((feature) => feature.path);
    assert.ok(results.includes('html.elements.a.href.href_top'));
  });

  it('should walk a single tree', () => {
    const results = Array.from(walk('api.Notification'));
    assert.equal(results.length, 29);
    assert.equal(results[0].path, 'api.Notification');
    assert.equal(results[1].path, 'api.Notification.Notification');
  });

  it('should walk multiple trees', () => {
    const results = Array.from(
      walk(['api.Notification', 'css.properties.color']),
    );
    assert.equal(results.length, 31);
    assert.equal(results[0].path, 'api.Notification');
    assert.equal(
      results[results.length - 1].path,
      'css.properties.color.transparent',
    );
  });

  it('should yield every feature by default', () => {
    const featureCountFromString = JSON.stringify(bcd, undefined, 2)
      .split('\n')
      .filter((line) => line.includes('__compat')).length;
    const featureCountFromWalk = Array.from(walk()).length;

    assert.equal(featureCountFromString, featureCountFromWalk);
  });
});
