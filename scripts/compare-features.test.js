#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const assert = require('assert');
const compareFeatures = require('./compare-features');

describe('compare-features', () => {
  it('sorting works properly', () => {
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

    assert.deepStrictEqual(input.sort(compareFeatures), expected);
  });
});
