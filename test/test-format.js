/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const { execSync } = require('child_process');
const chalk = require('chalk');

const testFormat = () => {
  try {
    execSync(
      'npx prettier --list-different "**/*.js" "**/*.ts" "**/*.md" "**/*.json"',
    );
  } catch (err) {
    let errorText = err.stdout.toString();
    console.error(chalk`{red   Prettier – formatting errors:}`);
    console.error(chalk`{red.bold → ${errorText}}`);
    console.error(
      chalk`{blue Tip: Run {bold npm run fix} to fix formatting automatically}`,
    );

    return true;
  }

  return false;
};

module.exports = testFormat;
