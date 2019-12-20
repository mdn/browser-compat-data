#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';

const { exec } = require('child_process');

const eslint = () => {
  exec('npx eslint --fix test/ scripts/ index.js index.d.ts types.d.ts');
};

module.exports = eslint;
