/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {SupportStatement, Identifier, BrowserName} from '../types/types.js' */

import { styleText } from 'node:util';

import deepDiff from 'deep-diff';
import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { query } from '../utils/index.js';

import { getMergeBase, getFileContent, getGitDiffStatuses } from './lib/git.js';
import mirror from './build/mirror.js';

/**
 * @typedef {object} Contents
 * @property {string} base
 * @property {string} head
 */

/**
 * @typedef {object} DiffItem
 * @property {string} name
 * @property {string} description
 */

/**
 * Get contents from base and head commits
 * Note: This does not detect renamed files
 * @param {string} baseCommit - Base commit
 * @param {string} basePath - Base path
 * @param {string} headCommit - Head commit
 * @param {string} headPath - Head path
 * @returns {Contents} The contents of both commits
 */
const getBaseAndHeadContents = (baseCommit, basePath, headCommit, headPath) => {
  const base = JSON.parse(getFileContent(baseCommit, basePath));
  const head = JSON.parse(getFileContent(headCommit, headPath));
  return { base, head };
};

/**
 * Returns a formatted string of before-and-after changes
 * @param {any} lhs - Left-hand (before) side
 * @param {any} rhs - Right-hand (after) side
 * @returns {string} Formatted string
 */
const stringifyChange = (lhs, rhs) =>
  `${JSON.stringify(lhs)} → ${JSON.stringify(rhs)}`;

/**
 * Perform mirroring on specified diff statement
 * @param {object} diff - The diff to perform mirroring on
 * @param {SupportStatement} diff.base
 * @param {SupportStatement} diff.head
 * @param {object} contents - The contents to mirror from
 * @param {Identifier} contents.base
 * @param {Identifier} contents.head
 * @param {string[]} path - The feature path to mirror
 * @param {'base' | 'head'} direction - Whether to mirror 'base' or 'head'
 */
const doMirror = (diff, contents, path, direction) => {
  const browser = /** @type {BrowserName} */ (path[path.length - 1]);
  const dataPath = path.slice(0, path.length - 3).join('.');
  const data = contents[direction];
  const queried = /** @type {Identifier} */ (query(dataPath, data));

  if (queried.__compat?.support) {
    diff[direction] = mirror(browser, queried.__compat.support);
  }
};

/**
 * Describe the diff in text form (internal function)
 * @param {import('deep-diff').Diff<string, string>} diffItem - The diff to describe
 * @param {Contents} contents - The contents of the diff
 * @returns {string} A human-readable diff description
 */
const describeByKind = (diffItem, contents) => {
  const diff = {
    base: /** @type {any} */ (diffItem).lhs,
    head: /** @type {any} */ (diffItem).rhs,
  };

  // Handle mirroring
  let doesMirror = '';
  if (diff.base === 'mirror') {
    doesMirror = 'No longer mirrors';
    doMirror(
      diff,
      /** @type {any} */ (contents),
      /** @type {string[]} */ (diffItem.path),
      'base',
    );
  } else if (diff.head === 'mirror') {
    doesMirror = 'Now mirrors';
    doMirror(
      diff,
      /** @type {any} */ (contents),
      /** @type {string[]} */ (diffItem.path),
      'head',
    );
  }

  switch (diffItem.kind) {
    case 'N':
      return 'added';
    case 'D':
      return 'deleted';
    case 'A':
    case 'E':
      return `edited (${stringifyChange(diff.base, diff.head)})${
        doesMirror && ` - ${doesMirror}`
      }`;
    default:
      return '';
  }
};

/**
 * Describe the diff in text form
 * @param {import('deep-diff').Diff<string, string>} diffItem - The diff to describe
 * @param {Contents} contents - The contents of the diff
 * @returns {DiffItem} A human-readable diff description
 */
const describeDiffItem = (diffItem, contents) => {
  const path = /** @type {string[]} */ (diffItem.path).join('.');
  if (path.includes('.__compat.')) {
    const [name, member] = path.split('.__compat.');
    if (path.endsWith('.notes') && diffItem.kind === 'E') {
      return { name, description: `${member} is edited (prose change)` };
    }
    return {
      name,
      description: `${member} is ${describeByKind(diffItem, contents)}`,
    };
  }
  return {
    name: /** @type {string[]} */ (diffItem.path).slice(0, -1).join('.'),
    description: `${path} is ${describeByKind(diffItem, contents)}`,
  };
};

/**
 * Merge diff together as a map
 * @param {DiffItem[]} items - Diff items to merge
 * @returns {Map<string, string[]>} A map of the diff items
 */
const mergeAsMap = (items) => {
  const map = new Map();
  for (const item of items) {
    const descriptions = map.get(item.name) || [];
    descriptions.push(item.description);
    map.set(item.name, descriptions);
  }
  return map;
};

/**
 * Get the diffs as a map
 * @param {string} base - Base ref
 * @param {string} [head] - Head ref
 * @returns {Map<string, string[]>} A map of the diff items
 */
const getDiffs = (base, head = '') => {
  /** @type {{ name: string; description: string }[]} */
  const namedDescriptions = [];
  for (const status of getGitDiffStatuses(base, head)) {
    if (!status.headPath.endsWith('.json') || !status.headPath.includes('/')) {
      continue;
    }

    // Note that A means Added for git while it means Array for deep-diff
    if (status.value === 'A' || status.value === 'D') {
      namedDescriptions.push({
        name: status.basePath.replace(/\//g, '.').slice(0, -5), // trim file extension
        description: status.value === 'A' ? 'Newly added' : 'Entirely removed',
      });
    } else {
      const contents = getBaseAndHeadContents(
        base,
        status.basePath,
        head,
        status.headPath,
      );
      const diff = deepDiff.diff(contents.base, contents.head);
      if (diff) {
        namedDescriptions.push(
          ...diff.map((item) => describeDiffItem(item, contents)),
        );
      }
    }
  }
  return mergeAsMap(namedDescriptions);
};

if (esMain(import.meta)) {
  const argv = yargs(hideBin(process.argv))
    .command(
      '$0 [base] [head]',
      'Print a formatted diff for changes between base and head commits',
    )
    .positional('base', {
      describe:
        'The base commit; may be commit hash or other git ref (e.g. "origin/main")',
      type: 'string',
      default: 'origin/main',
    })
    .positional('head', {
      describe:
        'The head commit that changes are applied to; may be commit hash or other git ref (e.g. "origin/main")',
      type: 'string',
      default: 'HEAD',
    })
    .parseSync();

  const { base, head } = argv;
  for (const [key, values] of getDiffs(getMergeBase(base, head), head)) {
    console.log(`${styleText('bold', key)}:`);
    for (const value of values) {
      console.log(` → ${value}`);
    }
  }
}
