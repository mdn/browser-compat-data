#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';

const { exec } = require('child_process');

/**
 * Perform fix of styling and code formatting with ESLint and Prettier on all JavaScript, TypeScript, and Markdown files in this repository.
 *
 * @returns {void}
 */
const format = () => {
  exec('npx eslint --fix "**/*.js"');
  exec('npx prettier --write "**/*.js" "**/*.ts" "**/*.md" "**/*.json"');
};

module.exports = format;
