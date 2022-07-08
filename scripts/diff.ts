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

import old from '../old.json' assert { type: 'json' };
import nevv from '../new.json' assert { type: 'json' };

type Contents = {
  base: string;
  head: string;
};

// Note: This does not detect renamed files
/**
 * @param {string} baseCommit
 * @param {string} basePath
 * @param {string} headCommit
 * @param {string} headPath
 */
function getBaseAndHeadContents(
  baseCommit: string,
  basePath: string,
  headCommit: string,
  headPath: string,
): Contents {
  const base = JSON.parse(getFileContent(baseCommit, basePath));
  const head = JSON.parse(getFileContent(headCommit, headPath));
  return { base, head };
}

function stringifyChange(lhs: any, rhs: any): string {
  return `${JSON.stringify(lhs)} → ${JSON.stringify(rhs)}`;
}

/**
 * @param {{base: SupportStatement, head: SupportStatement}} diffItem
 * @param {{base: Identifier, head: Identifier}} contents
 * @param {Array.<string>} path
 * @param {string} direction
 */
function doMirror(diff, contents, path, direction) {
  const browser = path[path.length - 1];
  const dataPath = path.slice(0, path.length - 3).join('.');
  const data = contents[direction];

  diff[direction] = mirror(browser, query(dataPath, data).__compat.support);
}

/**
 * @param {Diff<string, string>} diffItem
 * @param {Contents} contents
 */
function describeByKind(
  diffItem: Diff<string, string>,
  contents: Contents,
): string {
  const diff = { base: (diffItem as any).lhs, head: (diffItem as any).rhs };

  // Handle mirroring
  let doesMirror = '';
  if (diff.base === 'mirror') {
    doesMirror = 'No longer mirrors';
    doMirror(diff, contents, diffItem.path, 'base');
  } else if (diff.head === 'mirror') {
    doesMirror = 'Now mirrors';
    doMirror(diff, contents, diffItem.path, 'head');
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
  }
}

/**
 * @param {Diff<string, string>} diffItem
 * @param {Contents} contents
 */
function describeDiffItem(diffItem: Diff<string, string>, contents: Contents) {
  const path = (diffItem.path as string[]).join('.');
  if (path.includes('.__compat.')) {
    const [name, member] = path.split('.__compat.');
    if (path.endsWith('.notes') && diffItem.kind === 'E') {
      return { name, description: `${member} is edited (prose change)` };
    } else {
      return {
        name,
        description: `${member} is ${describeByKind(diffItem, contents)}`,
      };
    }
  } else {
    return {
      name: (diffItem.path as string[]).slice(0, -1).join('.'),
      description: `${path} is ${describeByKind(diffItem, contents)}`,
    };
  }
}

/**
 * @param {ReturnType<typeof describeDiffItem>[]} items
 */
function mergeAsMap(
  items: { name: string; description: string }[],
): Map<string, string> {
  const map = new Map();
  for (const item of items) {
    const descriptions = map.get(item.name) || [];
    descriptions.push(item.description);
    map.set(item.name, descriptions);
  }
  return map;
}

/**
 * @param {string} base
 * @param {string} head
 */
function getDiffs(base: string, head = ''): Map<string, string> {
  const namedDescriptions: { name: string; description: string }[] = [];
  const contents = {
    base: 'old.json',
    head: 'new.json',
  };

  const diff = deepDiff.diff(old, nevv);
  if (diff) {
    namedDescriptions.push(
      ...diff.map((item: any) => describeDiffItem(item, contents)),
    );
  }
  return mergeAsMap(namedDescriptions);
}

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
