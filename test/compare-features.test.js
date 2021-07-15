#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const chalk = require('chalk');

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

    let errors = false;
    for (let i = actual.length; i--; ) {
      if (actual[i] !== expected[i]) {
        errors = true;
        break;
      }
    }

    if (errors) {
      console.error(chalk`{red compareFeatures() – {bold 1} error:}`);
      console.error(chalk`{red   → Actual and expected orders do not match}`);
      console.error(chalk`{yellow     Actual: {bold ${actual}}}`);
      console.error(chalk`{green     Expected: {bold ${expected}}}`);
      return true;
    }
    return false;
  });
});
