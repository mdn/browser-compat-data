#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';

const { spawn } = require('child_process');

process.env.FORCE_COLOR = true;
const script = spawn('node', ['scripts/remove-mdn_url-404s.js'], {
  env: process.env,
});

script.stdout.on('data', data => {
  console.log(`${data}`.trim());
});
script.stderr.on('data', data => {
  console.error(`${data}`.trim());
});
script.on('close', code => {
  console.log(`Exited ${code}`.trim());
});
