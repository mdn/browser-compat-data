/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

export type FeatureChange = {
  mergeCommit?: string;
  number: number;
  url: string;
  feature: string;
};

export interface Changes {
  added: FeatureChange[];
  removed: FeatureChange[];
}

import chalk from 'chalk-template';

import diffFeatures from '../diff-features.js';

import { queryPRs } from './utils.js';

/**
 * Format a feature change in Markdown
 * @param {FeatureChange} obj The feature change to format
 * @returns {string} The formatted feature change
 */
const featureBullet = (obj: FeatureChange) =>
  `- \`${obj.feature}\` ([#${obj.number}](${obj.url}))`;

/**
 * Format all the feature changes in Markdown
 * @param {Changes} changes The changes to format
 * @returns {string} The formatted changes
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
 * Get all the pulls that have been merged on GitHub
 * @param {string} fromDate The start date to get merged pulls from
 * @returns {FeatureChange[]} The pull requests that have been merged
 */
const pullsFromGitHub = (fromDate: string): FeatureChange[] =>
  queryPRs({
    search: `is:pr merged:>=${fromDate}`,
    json: 'number,url,mergeCommit',
    jq: '[.[] | { mergeCommit: .mergeCommit.oid, number: .number, url: .url }]', // Flatten the structure provided by GitHub
  });

/**
 * Get the diff from the pull request
 * @param {FeatureChange} pull The pull request to test
 * @returns {{ added: string[]; removed: string[] }} The changes from the pull request
 */
const getDiff = (
  pull: FeatureChange,
): { added: string[]; removed: string[] } | null => {
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
    return null;
  }

  if (diff.added.length && diff.removed.length) {
    console.log(
      chalk` {blue ({green ${diff.added.length} added}, {red ${diff.removed.length} removed})}`,
    );
  } else if (diff.added.length) {
    console.log(chalk` {blue ({green ${diff.added.length} added})}`);
  } else if (diff.removed.length) {
    console.log(chalk` {blue ({red ${diff.removed.length} removed})}`);
  } else {
    console.log(chalk` {blue (No feature count changes)}`);
  }

  return diff;
};

/**
 * Get changes from the pull requests that have been merged since a specified date
 * @param {string} date The starting date to query pull requests from
 * @returns {Changes} The changes from all of the pull requests
 */
export const getChanges = async (date: string): Promise<Changes> => {
  const pulls = pullsFromGitHub(date);

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
