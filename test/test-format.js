'use strict';
const { execSync } = require('child_process');
const chalk = require('chalk');

const testFormat = () => {
  try {
    execSync('npx eslint "**/*.js" "**/*.ts" "**/*.md"', {
      stdio: 'inherit',
    });
  } catch (err) {
    let errorText = err.stdout.toString();
    console.error(chalk`{red   ESLint – code formatting/quality errors:}`);
    console.error(chalk`{red.bold ${errorText}}`);
    console.error(
      chalk`{blue Tip: Run {bold npm run fix} to fix some errors automatically}`,
    );

    return true;
  }

  return false;
};

module.exports = testFormat;
