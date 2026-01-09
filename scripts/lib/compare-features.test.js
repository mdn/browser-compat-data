/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import compareFeatures from './compare-features.js';

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
      'worker_support',
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
      'secure_context_required',
      'worker_support',
      'foobar',
      'protocol-r30',
      'toString',
      '_updated_spec',
      '--variable',
      '$0',
      '2-factor-auth',
      '43',
    ];

    assert.deepEqual(actual, expected);
  });
});
