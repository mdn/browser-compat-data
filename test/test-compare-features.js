#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const compareFeatures = require('../scripts/compare-features');

/**
 * A unit test for the compareFeatures() function, to ensure that features are sorted as expected.
 * @returns {boolean} If the sorter isn't functioning properly
 */
const testFeatureOrder = () => {
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

  const logger = new Logger('compareFeatures()');

  for (let i = actual.length; i--; ) {
    if (actual[i] !== expected[i]) {
      logger.error(chalk`Actual and expected orders do not match
    {yellow Actual: {bold ${actual}}}
    {green Expected: {bold ${expected}}}`);
    }
  }

  logger.emit();
  return logger.hasErrors();
};

module.exports = testFeatureOrder;
