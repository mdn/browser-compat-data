/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const assert = require('assert').strict;

const compareFeatures = require('../scripts/compare-features');

/**
 * A unit test for the compareFeatures() function, to ensure that features are sorted as expected.
 * @returns {boolean} If the sorter isn't functioning properly
 */
describe('compare-features script', () => {
  it('`compareFeatures()` works correctly', () => {
    const input = [
      'foobar',
      'Foo',
      '__compat',
      'toString',
      'secure_context_required',
      'protocol-r30',
      '$0',
      'Bar',
      '_updated_spec',
      '43',
      '--variable',
      'ZOO_Pals',
      '2-factor-auth',
    ];
    const actual = input.sort(compareFeatures);
    const expected = [
      '__compat',
      'Bar',
      'Foo',
      'ZOO_Pals',
      'foobar',
      'protocol-r30',
      'secure_context_required',
      'toString',
      '_updated_spec',
      '--variable',
      '$0',
      '2-factor-auth',
      '43',
    ];

    assert.deepStrictEqual(actual, expected);
  });
});
