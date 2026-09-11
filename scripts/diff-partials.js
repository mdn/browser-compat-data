/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {BrowserName, InternalDataType} from '../types/index.js' */

import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { iterSupport, walk } from '../utils/index.js';

import {
  getFileContent,
  getGitDiffStatuses,
  getMergeBase,
  resolveDiffRefs,
} from './lib/git.js';
import { dataFoldersMinusBrowsers } from './lib/data-folders.js';

/**
 * @typedef {object} PartialsDiff
 * @property {string[]} added The paths that gained a partial implementation
 * @property {string[]} removed The paths that lost a partial implementation
 */

/**
 * Check whether a file path is a compat data file
 * @param {string} path The file path to check
 * @returns {boolean} Whether the path is a compat data file
 */
const isDataFile = (path) =>
  path.endsWith('.json') &&
  dataFoldersMinusBrowsers.some((folder) => path.startsWith(`${folder}/`));

/**
 * Collect the paths of all support statements marked as partial implementations.
 * Unresolved `"mirror"` statements are ignored, so only explicit partial
 * implementations are collected.
 * @param {InternalDataType} data The compat data to collect from
 * @returns {Set<string>} The `<feature>.<browser>` paths with a partial implementation
 */
export const collectPartials = (data) => {
  /** @type {Set<string>} */
  const partials = new Set();

  for (const { path, compat } of walk(undefined, data)) {
    for (const browser of /** @type {BrowserName[]} */ (
      Object.keys(compat.support)
    )) {
      if (
        iterSupport(compat, browser).some(
          (statement) => statement.partial_implementation,
        )
      ) {
        partials.add(`${path}.${browser}`);
      }
    }
  }

  return partials;
};

/**
 * Collect the partial implementations of compat data files at a given commit
 * @param {string} commit The commit to collect at
 * @param {string[]} paths The file paths to collect from
 * @returns {Set<string>} The `<feature>.<browser>` paths with a partial implementation
 */
const collectPartialsAt = (commit, paths) => {
  /** @type {Set<string>} */
  const partials = new Set();

  for (const path of paths) {
    const contents = /** @type {InternalDataType} */ (
      JSON.parse(getFileContent(commit, path))
    );

    for (const partial of collectPartials(contents)) {
      partials.add(partial);
    }
  }

  return partials;
};

/**
 * Compare two sets of partial implementations
 * @param {Set<string>} before The partial implementations before the change
 * @param {Set<string>} after The partial implementations after the change
 * @returns {PartialsDiff} The added and removed partial implementations
 */
export const comparePartials = (before, after) => ({
  added: [...after].filter((path) => !before.has(path)).sort(),
  removed: [...before].filter((path) => !after.has(path)).sort(),
});

/**
 * Diff the partial implementations between two commits
 * @param {string} base The base commit
 * @param {string} head The head commit that changes are applied to
 * @returns {PartialsDiff} The added and removed partial implementations
 */
export const diffPartials = (base, head) => {
  const statuses = getGitDiffStatuses(base, head).filter((status) =>
    isDataFile(status.headPath),
  );

  return comparePartials(
    collectPartialsAt(
      base,
      statuses
        .filter((status) => status.value !== 'A')
        .map((status) => status.basePath),
    ),
    collectPartialsAt(
      head,
      statuses
        .filter((status) => status.value !== 'D')
        .map((status) => status.headPath),
    ),
  );
};

if (esMain(import.meta)) {
  const argv = yargs(hideBin(process.argv))
    .command(
      '$0 [base] [head]',
      'Print the partial implementations added and removed between base and head commits',
    )
    .positional('base', {
      describe:
        'The base commit; may be a pull request number, commit hash or other git ref (e.g. "origin/main")',
      type: 'string',
      default: 'origin/main',
    })
    .positional('head', {
      describe:
        'The head commit that changes are applied to; may be commit hash or other git ref (e.g. "origin/main")',
      type: 'string',
      default: 'HEAD',
    })
    .option('json', {
      describe: 'Print the diff as JSON, rather than as plain text',
      type: 'boolean',
      default: false,
    })
    .example(
      'npm run diff:partials -- 30261',
      'Print the partial implementations added and removed by pull request 30261',
    )
    .parseSync();

  const { base, head } = resolveDiffRefs(argv.base, argv.head);

  const diff = diffPartials(getMergeBase(base, head), head);

  if (argv.json) {
    console.log(JSON.stringify(diff));
  } else if (diff.added.length === 0 && diff.removed.length === 0) {
    console.log('✔ No partial implementation added or removed.');
  } else {
    for (const path of diff.added) {
      console.log(`+ ${path}`);
    }
    for (const path of diff.removed) {
      console.log(`- ${path}`);
    }
  }
}
