/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import query from './query.js';

/** @import {InternalCompatStatement, InternalDataType, InternalIdentifier} from '../types/index.js' */

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
    Thing: feature({
      child: feature({}, { mdn_url: 'https://example.test/docs/Thing/child' }),
    }),
  },
};

describe('query()', () => {
  it('throws on non-existent features', () => {
    assert.throws(() => query('nonExistentNameSpace', data), ReferenceError);
    assert.throws(() => query('api.NonExistentFeature', data), ReferenceError);
    assert.throws(
      () => query('api.NonExistentFeature.child', data),
      ReferenceError,
    );
    assert.throws(() => query('api.', data), ReferenceError);
  });

  it('returns the expected namespace', () => {
    const obj = query('api', data);

    assert.ok(!('__compat' in obj));
    assert.ok('Thing' in obj);
  });

  it('returns the expected feature', () => {
    const obj = query('api.Thing.child', data);

    assert.ok('__compat' in obj && obj.__compat);
    assert.ok('support' in obj.__compat);
    assert.ok('status' in obj.__compat);
    assert.equal('https://example.test/docs/Thing/child', obj.__compat.mdn_url);
  });

  it('returns a feature with children', () => {
    const obj = query('api.Thing', data);

    assert.ok('__compat' in obj);
    assert.ok('child' in obj);
  });
});
