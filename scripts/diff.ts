/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import deepDiff, { Diff } from 'deep-diff';
import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getMergeBase, getFileContent, getGitDiffStatuses } from './lib/git.js';
import { query } from '../utils/index.js';
import mirror from './release/mirror.js';

import { SupportStatement, Identifier, BrowserName } from '../types/types.js';

type Contents = {
  base: string;
  head: string;
};

type DiffItem = {
  name: string;
  description: string;
};

// Note: This does not detect renamed files
/**
 * @param {string} baseCommit
 * @param {string} basePath
 * @param {string} headCommit
 * @param {string} headPath
 * @returns {Contents}
 */
const getBaseAndHeadContents = (
  baseCommit: string,
  basePath: string,
  headCommit: string,
  headPath: string,
): Contents => {
  const base = JSON.parse(getFileContent(baseCommit, basePath));
  const head = JSON.parse(getFileContent(headCommit, headPath));
  return { base, head };
};

/**
 *
 * @param {any} lhs
 * @param {any} rhs
 * @returns {string}
 */
const stringifyChange = (lhs: any, rhs: any): string => {
  return `${JSON.stringify(lhs)} → ${JSON.stringify(rhs)}`;
};

/**
 * @param {{base: SupportStatement, head: SupportStatement}} diff
 * @param {SupportStatement} diff.base
 * @param {SupportStatement} diff.head
 * @param {{base: Identifier, head: Identifier}} contents
 * @param {Identifier} contents.base
 * @param {Identifier} contents.head
 * @param {Array.<string>} path
 * @param {string} direction
 */
const doMirror = (
  diff: { base: SupportStatement; head: SupportStatement },
  contents: { base: Identifier; head: Identifier },
  path: string[],
  direction: string,
): void => {
  const browser = path[path.length - 1] as BrowserName;
  const dataPath = path.slice(0, path.length - 3).join('.');
  const data = contents[direction];

  diff[direction] = mirror(browser, query(dataPath, data).__compat.support);
};

/**
 * @param {Diff<string, string>} diffItem
 * @param {Contents} contents
 * @returns {string}
 */
const describeByKind = (
  diffItem: Diff<string, string>,
  contents: Contents,
): string => {
  const diff = { base: (diffItem as any).lhs, head: (diffItem as any).rhs };

  // Handle mirroring
  let doesMirror = '';
  if (diff.base === 'mirror') {
    doesMirror = 'No longer mirrors';
    doMirror(
      diff,
      contents as any as { base: Identifier; head: Identifier },
      diffItem.path as string[],
      'base',
    );
  } else if (diff.head === 'mirror') {
    doesMirror = 'Now mirrors';
    doMirror(
      diff,
      contents as any as { base: Identifier; head: Identifier },
      diffItem.path as string[],
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
 * @param {Diff<string, string>} diffItem
 * @param {Contents} contents
 * @returns {DiffItem}
 */
const describeDiffItem = (
  diffItem: Diff<string, string>,
  contents: Contents,
): DiffItem => {
  const path = (diffItem.path as string[]).join('.');
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
    name: (diffItem.path as string[]).slice(0, -1).join('.'),
    description: `${path} is ${describeByKind(diffItem, contents)}`,
  };
};

/**
 * @param {DiffItem[]} items
 * @returns {Map<string, string>}
 */
const mergeAsMap = (items: DiffItem[]): Map<string, string> => {
  const map = new Map();
  for (const item of items) {
    const descriptions = map.get(item.name) || [];
    descriptions.push(item.description);
    map.set(item.name, descriptions);
  }
  return map;
};

/**
 * @param {string} base
 * @param {string} head
 * @returns {Map<string, string>}
 */
const getDiffs = (base: string, head = ''): Map<string, string> => {
  const namedDescriptions: { name: string; description: string }[] = [];
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
  const { argv } = yargs(hideBin(process.argv)).command(
    '$0 [base] [head]',
    'Print a formatted diff for changes between base and head commits',
    (yargs) => {
      yargs
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
        });
    },
  );

  const { base, head } = argv as any;
  for (const [key, values] of getDiffs(getMergeBase(base, head), head)) {
    console.log(chalk`{bold ${key}}:`);
    for (const value of values) {
      console.log(` → ${value}`);
    }
  }
}
