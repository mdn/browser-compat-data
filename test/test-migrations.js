#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import chalk from 'chalk';

import m002 from '../scripts/migrations/002-remove-webview-flags.test.js';

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

export default testMigrations;
