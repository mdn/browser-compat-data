/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

export type FeatureChange = {
  mergeCommit?: string;
  number: number;
  url: string;
  feature: string;
};

interface Changes {
  added: FeatureChange[];
  removed: FeatureChange[];
}

import chalk from 'chalk-template';
import fs from 'node:fs/promises';
import esMain from 'es-main';

import { exec, queryPRs, requireGitHubCLI, buildQuery } from './utils.js';
import diffFeatures from '../diff-features.js';

/**
 *
 * @param {FeatureChange} obj
 * @returns {string}
 */
const featureBullet = (obj: FeatureChange) =>
  `- \`${obj.feature}\` ([#${obj.number}](${obj.url}))`;

/**
 *
 * @param {FeatureChange[]} removed
 * @param {FeatureChange[]} added
 * @returns {string}
 */
export const formatChanges = (changes: Changes): string => {
  const output: string[] = [];

  if (changes.removed.length) {
    output.push('### Removals', '');
    for (const removal of changes.removed) {
      output.push(featureBullet(removal));
    }
    output.push('');
  }

  if (changes.added.length) {
    output.push('### Additions', '');
    for (const addition of changes.added) {
      output.push(featureBullet(addition));
    }
    output.push('');
  }

  return output.join('\n');
};

/**
 *
 * @param {string} start
 * @returns {FeatureChange[]}
 */
const pullsFromGitHub = (start: string): FeatureChange[] =>
  queryPRs({
    search: `${buildQuery('main', start, false)}`,
    json: 'number,url,mergeCommit',
    jq: '[.[] | { mergeCommit: .mergeCommit.oid, number: .number, url: .url }]', // Flatten the structure provided by GitHub
  });

const getDiff = (
  pull: FeatureChange,
): { added: string[]; removed: string[] } | undefined => {
  process.stdout.write(
    chalk`{blue - Diffing features for {bold #${pull.number}}...}`,
  );

  let diff;

  try {
    diff = diffFeatures({ ref1: pull.mergeCommit });
  } catch (e) {
    console.log(
      chalk`{red ${e}}\n {yellow (Failed to diff features for #${pull.number}, skipping)}`,
    );
    return;
  }

  console.log(
    chalk` {blue ({green ${diff.added.length} added}, {red ${diff.removed.length} removed})}`,
  );

  return diff;
};

/**
 *
 * @param {string} lastVersion
 */
export const getChanges = async (lastVersion: string): Promise<Changes> => {
  const pulls = pullsFromGitHub(lastVersion);

  const changes: Changes = {
    added: [],
    removed: [],
  };

  for (const pull of pulls) {
    const diff = getDiff(pull);

    if (!diff) {
      continue;
    }

    for (const feature of diff.added) {
      changes.added.push({
        number: pull.number,
        url: pull.url,
        feature,
      });
    }

    for (const feature of diff.removed) {
      changes.removed.push({
        number: pull.number,
        url: pull.url,
        feature,
      });
    }
  }

  changes.added.sort((a, b) => a.feature.localeCompare(b.feature));
  changes.removed.sort((a, b) => a.feature.localeCompare(b.feature));

  return changes;
};
