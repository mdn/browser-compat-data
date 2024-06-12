/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import deepDiff, { Diff } from 'deep-diff';
import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { query } from '../utils/index.js';
import { SupportStatement, Identifier, BrowserName } from '../types/types.js';

import { getMergeBase, getFileContent, getGitDiffStatuses } from './lib/git.js';
import mirror from './build/mirror.js';

interface Contents {
  base: string;
  head: string;
}

interface DiffItem {
  name: string;
  description: string;
}

/**
 * Get contents from base and head commits
 * Note: This does not detect renamed files
 * @param baseCommit Base commit
 * @param basePath Base path
 * @param headCommit Head commit
 * @param headPath Head path
 * @returns The contents of both commits
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
 * Returns a formatted string of before-and-after changes
 * @param lhs Left-hand (before) side
 * @param rhs Right-hand (after) side
 * @returns Formatted string
 */
const stringifyChange = (lhs: any, rhs: any): string =>
  `${JSON.stringify(lhs)} → ${JSON.stringify(rhs)}`;

/**
 * Perform mirroring on specified diff statement
 * @param diff The diff to perform mirroring on
 * @param diff.base The diff to perform mirroring on
 * @param diff.head The diff to perform mirroring on
 * @param contents The contents to mirror from
 * @param contents.base The contents to mirror from
 * @param contents.head The contents to mirror from
 * @param path The feature path to mirror
 * @param direction Whether to mirror 'base' or 'head'
 */
const doMirror = (
  diff: { base: SupportStatement; head: SupportStatement },
  contents: { base: Identifier; head: Identifier },
  path: string[],
  direction: 'base' | 'head',
): void => {
  const browser = path[path.length - 1] as BrowserName;
  const dataPath = path.slice(0, path.length - 3).join('.');
  const data = contents[direction];

  diff[direction] = mirror(browser, query(dataPath, data).__compat.support);
};

/**
 * Describe the diff in text form (internal function)
 * @param diffItem The diff to describe
 * @param contents The contents of the diff
 * @returns A human-readable diff description
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
 * Describe the diff in text form
 * @param diffItem The diff to describe
 * @param contents The contents of the diff
 * @returns A human-readable diff description
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
 * Merge diff together as a map
 * @param items Diff items to merge
 * @returns A map of the diff items
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
 * Get the diffs as a map
 * @param base Base ref
 * @param head Head ref
 * @returns A map of the diff items
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
