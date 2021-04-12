const assert = require('assert').strict;
const { execSync } = require('child_process');

function exec(command) {
  return execSync(command, { encoding: 'utf8' }).trim();
}

function getLatestTag() {
  const currentBranch = exec('git rev-parse --abbrev-ref HEAD');
  assert.equal('main', currentBranch, 'Run this script on `main` branch only');
  return exec('git describe --abbrev=0 --tags');
}

function getRefDate(ref, querySafe = false) {
  const rawDateString = exec(`git log -1 --format=%aI ${ref}`);

  if (querySafe) {
    return rawDateString.replace('+', '%2B');
  }
  return rawDateString;
}

function releaseYargsBuilder(yargs) {
  yargs.positional('start-version-tag', {
    type: 'string',
    defaultDescription: 'most recent tag',
    default: getLatestTag,
  });
  yargs.positional('end-version-tag', {
    type: 'string',
    default: 'HEAD',
  });
}

module.exports = {
  exec,
  getLatestTag,
  getRefDate,
  releaseYargsBuilder,
};
