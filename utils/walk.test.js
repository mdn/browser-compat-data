/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import walk, { lowLevelWalk } from './walk.js';

/** @import {InternalBrowserStatement, InternalCompatStatement, InternalDataType, InternalIdentifier} from '../types/index.js' */
/** @import {CompatData} from '../types/public.js' */

/**
 * Create a feature with a minimal compat statement.
 * @param {Record<string, InternalIdentifier>} [children] Subfeatures by name
 * @param {Partial<InternalCompatStatement>} [compat] Extra compat properties
 * @returns {InternalIdentifier} The feature
 */
const feature = (children = {}, compat = {}) =>
  /** @type {InternalIdentifier} */ ({
    __compat: {
      support: {},
      status: { experimental: false, standard_track: true, deprecated: false },
      ...compat,
    },
    ...children,
  });

/** @type {InternalDataType} */
const data = {
  api: {
    Thing: feature({ child: feature() }),
  },
  css: {
    properties: {
      color: feature(),
    },
  },
};

describe('lowLevelWalk()', () => {
  it('visits each direct child at depth one', () => {
    const steps = Array.from(lowLevelWalk(data, undefined, 1));

    assert.deepEqual(
      steps.map((step) => step.path),
      ['api', 'css'],
    );
  });

  it('visits each point in the tree', () => {
    const paths = Array.from(lowLevelWalk(data)).map((step) => step.path);

    assert.deepEqual(paths, [
      'api',
      'api.Thing',
      'api.Thing.child',
      'css',
      'css.properties',
      'css.properties.color',
    ]);
  });

  it('visits a browser and its releases', () => {
    /** @type {InternalBrowserStatement} */
    const browser = {
      name: 'Example',
      type: 'desktop',
      accepts_flags: false,
      accepts_webextensions: false,
      releases: {
        1: { status: 'current' },
      },
    };
    const paths = Array.from(lowLevelWalk(browser, 'browsers.example')).map(
      (step) => step.path,
    );

    assert.deepEqual(paths, [
      'browsers.example',
      'browsers.example.releases.1',
    ]);
  });

  it('skips `__meta`', () => {
    /** @type {Pick<CompatData, '__meta'>} */
    const metadata = {
      __meta: {
        version: '0.0.0',
        timestamp: '2026-01-01T00:00:00.000Z',
      },
    };
    const paths = Array.from(
      lowLevelWalk(Object.assign({}, data, metadata)),
    ).map((step) => step.path);

    assert.ok(!paths.some((path) => path.startsWith('__meta')));
  });
});

describe('walk()', () => {
  it('walks a namespace entry point', () => {
    const results = Array.from(walk('api', data)).map(
      (feature) => feature.path,
    );

    assert.deepEqual(results, ['api.Thing', 'api.Thing.child']);
  });

  it('walks a single entry point', () => {
    const results = Array.from(walk('api.Thing', data));

    assert.deepEqual(
      results.map((feature) => feature.path),
      ['api.Thing', 'api.Thing.child'],
    );
  });

  it('walks multiple entry points', () => {
    const results = Array.from(
      walk(['api.Thing', 'css.properties.color'], data),
    );

    assert.deepEqual(
      results.map((feature) => feature.path),
      ['api.Thing', 'api.Thing.child', 'css.properties.color'],
    );
  });

  it('yields every feature by default', () => {
    const results = Array.from(walk(undefined, data));

    assert.deepEqual(
      results.map((feature) => feature.path),
      ['api.Thing', 'api.Thing.child', 'css.properties.color'],
    );
  });
});
