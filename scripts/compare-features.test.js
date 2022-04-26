#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const assert = require('assert').strict;

const compareFeatures = require('./compare-features');

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
      'worker_support',
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

    assert.deepEqual(actual, expected);
  });
});
