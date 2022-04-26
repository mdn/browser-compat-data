import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import {
  buildQuery,
  getRefDate,
  releaseYargsBuilder,
} from './release-utils.js';

const pullsBaseURL = new URL(
  'https://github.com/mdn/browser-compat-data/pulls',
);
const releaseNotesLabel = 'label:"needs-release-note :newspaper:"';

const { argv } = yargs(hideBin(process.argv)).command(
  '$0 [start-version-tag [end-version-tag]]',
  'Get a link to PRs included between two tags (or other commits)',
  (yargs) => {
    releaseYargsBuilder(yargs);
    yargs.option('q', {
      alias: 'quiet',
      describe: 'Print the URL only',
      type: 'boolean',
    });
    yargs.option('labeled', {
      describe: 'Filter to needs-release-note labeled PRs only',
      type: 'boolean',
    });
    yargs.option('query-only', {
      describe: 'Print the query only (such as for piping to `gh`)',
      type: 'boolean',
    });
    yargs.example(
      '$0 --quiet --labeled --query-only',
      'Get the query for piping to `gh`',
    );
  },
);

function queryToURL(query) {
  const searchUrl = new URL(pullsBaseURL);
  searchUrl.search = `q=${query}`;
  return searchUrl.href;
}

function appendLabel(query) {
  return `${query} ${releaseNotesLabel}`;
}

function main() {
  const {
    startVersionTag: start,
    endVersionTag: end,
    quiet,
    labeled,
    queryOnly,
  } = argv;

  let query = buildQuery(end, start, !queryOnly);
  if (labeled) {
    query = appendLabel(query);
  }

  if (!quiet) {
    console.log(
      `From ${start} (${getRefDate(start)}) to ${end} (${getRefDate(end)}):`,
    );
    console.log();
  }

  if (queryOnly) {
    console.log(query);
  } else {
    console.log(queryToURL(query));
  }
}

if (esMain(import.meta)) {
  main();
}
