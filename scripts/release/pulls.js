const { getRefDate, releaseYargsBuilder } = require('./utils');

const pullsBaseURL = new URL(
  'https://github.com/mdn/browser-compat-data/pulls',
);
const releaseNotesLabel = 'label:"needs-release-note :newspaper:"';

const { argv } = require('yargs').command(
  '$0 [start-version-tag [end-version-tag]]',
  'Get a link to PRs that need release notes between two tags (or other commits)',
  releaseYargsBuilder,
);

function needsReleaseNotePulls(startRef, endRef) {
  const searchUrl = new URL(pullsBaseURL);

  let merged;
  if (endRef !== 'HEAD') {
    merged = `merged:${getRefDate(startRef, true)}..${getRefDate(
      endRef,
      true,
    )}`;
  } else {
    merged = `merged:>=${getRefDate(startRef, true)}`;
  }
  searchUrl.search = `q=is:pr ${merged} ${releaseNotesLabel}`;

  return `${searchUrl.href}`;
}

function main() {
  const { startVersionTag: start, endVersionTag: end } = argv;

  console.log(
    `From ${start} (${getRefDate(start)}) to ${end} (${getRefDate(end)}):`,
  );
  console.log();
  console.log(needsReleaseNotePulls(start, end));
}

main();
