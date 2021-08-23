#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import { exec } from 'node:child_process';

const format = () => {
  exec('npx prettier --write "**/*.js" "**/*.ts" "**/*.md"');
};

export default format;
