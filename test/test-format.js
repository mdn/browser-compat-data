'use strict';
const { exec } = require('child_process');
const chalk = require('chalk');

const testFormat = () => {
  exec('npx prettier --check "**/*.js" "**/*.ts"', (error, stdout, stderr) => {
    if (error) {
      console.error(chalk`{red   Prettier – formatting errors:}`);
      console.error(chalk`{red.bold ${stdout}}`);
      console.error(
        chalk`{blue Tip: Run {bold npm run fix} to fix formatting automatically}`,
      );
    }
  });
};

module.exports = testFormat;
