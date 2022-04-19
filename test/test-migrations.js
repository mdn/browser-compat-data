/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const m002 = require('../scripts/migrations/002-remove-webview-flags.test.js');

/**
 * @returns {boolean} If the migrations aren't functioning properly
 */
const testMigrations = () => {
  /** @type {string[]} */
  const errors = [];
  const logger = {
    /** @param {...unknown} message */
    error: (...message) => {
      errors.push(message.join(' '));
    },
  };

  m002(logger);

  if (errors.length) {
    console.error(
      chalk`{red Migrations – {bold ${errors.length}} ${
        errors.length === 1 ? 'error' : 'errors'
      }:}`,
    );
    for (let i in errors) {
      console.error(chalk`{red   ${errors[i]}}`);
    }
    return true;
  }
  return false;
};

module.exports = testMigrations;
