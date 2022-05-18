/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { strict as assert } from 'node:assert';

import bcd from '../index.js';
import { walk, lowLevelWalk } from './walk.js';

describe('lowLevelWalk()', function () {
  it('visits every top-level tree', function () {
    const expectedPaths = [
      'api',
      'browsers',
      'css',
      'html',
      'http',
      'javascript',
      'mathml',
      'svg',
      'webdriver',
      'webextensions',
    ];

    const steps = Array.from(lowLevelWalk(undefined, undefined, 1));
    const paths = steps.map((step) => step.path);
    assert.equal(steps.length, expectedPaths.length);
    assert.deepEqual(paths, expectedPaths);
  });
  it('visits every point in the tree', function () {
    const paths = Array.from(lowLevelWalk()).map((step) => step.path);
    assert.ok(paths.length > 13000);
  });
});

describe('walk()', function () {
  it('should visit deeply nested features', function () {
    let results = Array.from(walk('html')).map((feature) => feature.path);
    assert.ok(results.includes('html.elements.a.href.href_top'));
  });

  it('should walk a single tree', function () {
    let results = Array.from(walk('api.Notification'));
    assert.equal(results.length, 27);
    assert.equal(results[0].path, 'api.Notification');
    assert.equal(results[1].path, 'api.Notification.Notification');
  });

  it('should walk multiple trees', function () {
    let results = Array.from(
      walk(['api.Notification', 'css.properties.color']),
    );
    assert.equal(results.length, 28);
    assert.equal(results[0].path, 'api.Notification');
    assert.equal(results[results.length - 1].path, 'css.properties.color');
  });

  it('should yield every feature by default', function () {
    const featureCountFromString = JSON.stringify(bcd, undefined, 2)
      .split('\n')
      .filter((line) => line.includes('__compat')).length;
    const featureCountFromWalk = Array.from(walk()).length;

    assert.equal(featureCountFromString, featureCountFromWalk);
  });
});
