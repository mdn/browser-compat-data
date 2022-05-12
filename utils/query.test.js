/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const assert = require('assert').strict;

const query = require('./query');

describe('query()', function () {
  describe('should throw on non-existent features', function () {
    assert.throws(() => query('nonExistentNameSpace'), ReferenceError);
    assert.throws(() => query('api.NonExistentFeature'), ReferenceError);
    assert.throws(
      () => query('api.NonExistentFeature.subFeature'),
      ReferenceError,
    );
  });

  it('should return the expected point in the tree (namespace)', function () {
    const obj = query('css');

    assert.ok(!('__compat' in obj));
    assert.ok('properties' in obj);
    assert.ok('at-rules' in obj);
  });

  it('should return the expected point in the tree (feature)', function () {
    const obj = query('api.HTMLAnchorElement.href');

    assert.ok('support' in obj.__compat);
    assert.ok('status' in obj.__compat);
    assert.equal(
      'https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement/href',
      obj.__compat.mdn_url,
    );
  });

  it('should return the expected point in the tree (feature with children)', function () {
    const obj = query('api.HTMLAnchorElement');

    assert.ok('__compat' in obj);
    assert.ok('charset' in obj);
    assert.ok('href' in obj);
  });
});
