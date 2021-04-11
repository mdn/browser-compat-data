const assert = require('assert').strict;

const { exec, releaseYargsBuilder } = require('./release-utils');

const pullsBaseURL = new URL(
  'https://github.com/mdn/browser-compat-data/pulls',
);
const releaseNotesLabel = 'label:"needs-release-note :newspaper:"';

const { argv } = require('yargs').command(
  '$0 [start-version-tag [end-version-tag]]',
  'Get a link to PRs that need release notes between two tags (or other commits)',
  releaseYargsBuilder,
);

function getDate(ref, querySafe = false) {
  const rawDateString = exec(`git log -1 --format=%aI ${ref}`);

  if (querySafe) {
    return rawDateString.replace('+', '%2B');
  }
  return rawDateString;
}

function needsReleaseNotePulls(startRef, endRef) {
  const searchUrl = new URL(pullsBaseURL);

  let merged;
  if (endRef !== 'HEAD') {
    merged = `merged:${getDate(startRef, true)}..${getDate(endRef, true)}`;
  } else {
    merged = `merged:>=${getDate(startRef, true)}`;
  }
  searchUrl.search = `q=is:pr ${merged} ${releaseNotesLabel}`;

  return `${searchUrl.href}`;
}

function main() {
  const { startVersionTag: start, endVersionTag: end } = argv;

  console.log(`From ${start} (${getDate(start)}) to ${end} (${getDate(end)}):`);
  console.log();
  console.log(needsReleaseNotePulls(start, end));
}

main();
