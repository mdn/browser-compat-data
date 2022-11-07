/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import bcd from '../index.js';
import query from './query.js';
import {
  joinPath,
  isBrowser,
  isFeature,
  descendantKeys,
} from './walkingUtils.js';

describe('joinPath()', () => {
  it('joins dotted paths to features', () => {
    assert.equal(joinPath('html', 'elements'), 'html.elements');
  });

  it('silently discards undefineds', () => {
    assert.equal(joinPath(undefined, undefined, undefined), '');
    assert.equal(joinPath(undefined, 'api'), 'api');
  });
});

describe('isBrowser()', () => {
  it('returns true for browser-like objects', () => {
    assert.equal(isBrowser(bcd.browsers.firefox), true);
  });

  it('returns false for feature-like objects', () => {
    assert.equal(isBrowser(query('html.elements.a')), false);
  });
});

describe('isFeature()', () => {
  it('returns false for browser-like objects', () => {
    assert.equal(isFeature(bcd.browsers.chrome), false);
  });

  it('returns true for feature-like objects', () => {
    assert.equal(isFeature(query('html.elements.a')), true);
  });
});

describe('descendantKeys()', () => {
  it('returns empty array if data is invalid', () => {
    assert.strictEqual(descendantKeys(123).length, 0);
    assert.strictEqual(descendantKeys('Hello World!').length, 0);
    assert.strictEqual(descendantKeys(null).length, 0);
    assert.strictEqual(descendantKeys(undefined).length, 0);
  });
});
