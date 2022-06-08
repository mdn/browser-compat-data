/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import deepDiff, { Diff } from 'deep-diff';
import esMain from 'es-main';

import { getMergeBase, getFileContent, getGitDiffStatuses } from './lib/git.js';

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
): { base: string; head: string } {
  const base = JSON.parse(getFileContent(baseCommit, basePath));
  const head = JSON.parse(getFileContent(headCommit, headPath));
  return { base, head };
}

/**
 * @param {Diff<string, string>} diffItem
 */
function describeByKind(diffItem: Diff<string, string>): string {
  function stringifyValue(value: any) {
    return Array.isArray(value)
      ? 'typeof array'
      : value && typeof value === 'object'
      ? 'typeof object'
      : value;
  }
  function stringifyChange(lhs: any, rhs: any) {
    return `${stringifyValue(lhs)} → ${stringifyValue(rhs)}`;
  }
  switch (diffItem.kind) {
    case 'N':
      return 'added';
    case 'D':
      return 'deleted';
    case 'A':
    case 'E':
      return `edited (${stringifyChange(diffItem.lhs, diffItem.rhs)})`;
  }
  throw new Error(`Unexpected kind ${diffItem.kind}.`);
}

/**
 * @param {Diff<string, string>} diffItem
 */
function describeDiffItem(diffItem: Diff<string, string>) {
  const path = diffItem.path.join('.');
  if (path.includes('.__compat.')) {
    const [name, member] = path.split('.__compat.');
    if (path.endsWith('.notes') && diffItem.kind === 'E') {
      return { name, description: `${member} is edited (prose change)` };
    } else {
      return { name, description: `${member} is ${describeByKind(diffItem)}` };
    }
  } else {
    return {
      name: diffItem.path.slice(0, -1).join('.'),
      description: `${path} is ${describeByKind(diffItem)}`,
    };
  }
}

/**
 * @param {ReturnType<typeof describeDiffItem>[]} items
 */
function mergeAsMap(items): Map<string, string> {
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
function getDiffs(base: string, head: string = ''): Map<string, string> {
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
        namedDescriptions.push(...diff.map(describeDiffItem));
      }
    }
  }
  return mergeAsMap(namedDescriptions);
}

if (esMain(import.meta)) {
  const [base = 'origin/HEAD', head] = process.argv.slice(2);
  for (const [key, values] of getDiffs(getMergeBase(base, head), head)) {
    console.log(chalk`{bold ${key}}:`);
    for (const value of values) {
      console.log(` → ${value}`);
    }
  }
}
