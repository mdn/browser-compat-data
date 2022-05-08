/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const chalk = require('chalk');

/** @type {string[]} */
const VALID_ELEMENTS = ['code', 'kbd', 'em', 'strong', 'a'];

class Logger {
  /** @param {string} title */
  constructor(title) {
    this.title = title;
    this.errors = [];
  }

  /** @param {...unknown} message */
  error(...message) {
    this.errors.push(message.join(' '));
  }

  emit() {
    const errorCount = this.errors.length;
    if (errorCount) {
      console.error(
        chalk`{red   ${this.title} – {bold ${errorCount}} ${
          errorCount === 1 ? 'error' : 'errors'
        }:}`,
      );
      for (const error of this.errors) {
        console.error(`  ${error}`);
      }
    }
  }

  hasErrors() {
    return !!this.errors.length;
  }
}

module.exports = { VALID_ELEMENTS, Logger };
