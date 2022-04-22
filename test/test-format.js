'use strict';
const { execSync } = require('child_process');
const chalk = require('chalk');

/**
 * @returns {boolean} If the file contains errors
 */
const testFormat = () => {
  let errorText = '';
  try {
    execSync('npx eslint "**/*.js" --color');
  } catch (err) {
    errorText += err.stdout.toString();
  }

  try {
    execSync(
      'npx prettier --list-different "**/*.js" "**/*.ts" "**/*.md" "**/*.json" --color',
    );
  } catch (err) {
    errorText += err.stdout.toString();
  }

  if (errorText !== '') {
    console.error(
      chalk`{red   Prettier/ESLint – code formatting/quality errors:}`,
    );
    console.error(chalk`{red.bold ${errorText}}`);
    console.error(
      chalk`{blue Tip: Run {bold npm run fix} to fix some errors automatically}`,
    );

    return true;
  }

  return false;
};

module.exports = testFormat;
