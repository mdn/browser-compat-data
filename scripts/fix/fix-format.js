#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';

const { exec } = require('child_process');

const format = () => {
  exec('npx prettier --write "**/*.js" "**/*.ts" "**/*.md"');
};

module.exports = format;
