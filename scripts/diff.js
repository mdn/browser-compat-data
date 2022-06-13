/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import deepDiff from 'deep-diff';
import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getMergeBase, getFileContent, getGitDiffStatuses } from './lib/git.js';
import { query } from '../utils/index.js';
import mirror from './release/mirror.js';

// Note: This does not detect renamed files
/**
 * @param {string} baseCommit
 * @param {string} headCommit
 * @param {string} basePath
 */
function getBaseAndHeadContents(baseCommit, basePath, headCommit, headPath) {
  const base = JSON.parse(getFileContent(baseCommit, basePath));
  const head = JSON.parse(getFileContent(headCommit, headPath));
  return { base, head };
}

function stringifyChange(lhs, rhs) {
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
 * @param {import("deep-diff").Diff<any, any>} diffItem
 * @param {{base: Identifier, head: Identifier}} contents
 */
function describeByKind(diffItem, contents) {
  const diff = { base: diffItem.lhs, head: diffItem.rhs };

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
  throw new Error(`Unexpected kind ${diffItem.kind}.`);
}

/**
 * @param {import("deep-diff").Diff<any, any>} diffItem
 */
function describeDiffItem(diffItem, contents) {
  const path = diffItem.path.join('.');
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
      name: diffItem.path.slice(0, -1).join('.'),
      description: `${path} is ${describeByKind(diffItem, contents)}`,
    };
  }
}

/**
 * @param {ReturnType<typeof describeDiffItem>[]} items
 */
function mergeAsMap(items) {
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
function getDiffs(base, head = '') {
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
      namedDescriptions.push(
        ...deepDiff
          .diff(contents.base, contents.head)
          .map((item) => describeDiffItem(item, contents)),
      );
    }
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

  const { base, head } = argv;
  for (const [key, values] of getDiffs(getMergeBase(base, head), head)) {
    console.log(chalk`{bold ${key}}:`);
    for (const value of values) {
      console.log(` → ${value}`);
    }
  }
}
