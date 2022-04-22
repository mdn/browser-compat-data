'use strict';
const { execSync } = require('child_process');
const chalk = require('chalk');
const { Logger } = require('./utils.js');

const testFormat = () => {
  const logger = new Logger('Prettier');

  try {
    execSync(
      'npx prettier --list-different "**/*.js" "**/*.ts" "**/*.md" "**/*.json"',
    );
  } catch (err) {
    let errorText = err.stdout.toString();
    logger.error(
      chalk`{bold ${errorText}}`,
      chalk`Run {bold npm run fix} to fix formatting automatically`,
    );
  }

  logger.emit();
  return logger.hasErrors();
};

module.exports = testFormat;
