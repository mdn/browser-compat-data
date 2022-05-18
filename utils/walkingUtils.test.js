/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { strict as assert } from 'node:assert';

import bcd from '../index.js';
import query from './query.js';
import { joinPath, isBrowser, isFeature } from './walkingUtils.js';

describe('joinPath()', function () {
  it('joins dotted paths to features', function () {
    assert.equal(joinPath('html', 'elements'), 'html.elements');
  });

  it('silently discards undefineds', function () {
    assert.equal(joinPath(undefined, undefined, undefined), '');
    assert.equal(joinPath(undefined, 'api'), 'api');
  });
});

describe('isBrowser()', function () {
  it('returns true for browser-like objects', function () {
    assert.equal(isBrowser(bcd.browsers.firefox), true);
  });

  it('returns false for feature-like objects', function () {
    assert.equal(isBrowser(query('html.elements.a')), false);
  });
});

describe('isFeature()', function () {
  it('returns false for browser-like objects', function () {
    assert.equal(isFeature(bcd.browsers.chrome), false);
  });

  it('returns true for feature-like objects', function () {
    assert.equal(isFeature(query('html.elements.a')), true);
  });
});
