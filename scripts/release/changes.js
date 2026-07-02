/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/**
 * @typedef {object} FeatureChange
 * @property {string} [mergeCommit]
 * @property {number} number
 * @property {string} url
 * @property {string} feature
 */

/**
 * @typedef {object} FeatureRename
 * @property {number} number
 * @property {string} url
 * @property {string} from
 * @property {string} to
 */

/**
 * @typedef {object} Changes
 * @property {FeatureChange[]} added
 * @property {FeatureChange[]} removed
 * @property {FeatureRename[]} renamed
 */

import { styleText } from 'node:util';

import cliProgress from 'cli-progress';

import diffFeatures from '../diff-features.js';

import { detectRenames } from './detect-renames.js';
import { queryPRs } from './utils.js';

/**
 * Format a feature change in Markdown
 * @param {FeatureChange} obj The feature change to format
 * @returns {string} The formatted feature change
 */
const featureBullet = (obj) =>
  `- \`${obj.feature}\` ([#${obj.number}](${obj.url}))`;

/**
 * Format a feature rename in Markdown
 * @param {FeatureRename} obj The rename to format
 * @returns {string} The formatted rename
 */
const renameBullet = (obj) =>
  `- \`${obj.from}\` to \`${obj.to}\` ([#${obj.number}](${obj.url}))`;

/**
 * Format all the feature changes in Markdown
 * @param {Changes} changes The changes to format
 * @returns {string} The formatted changes
 */
export const formatChanges = (changes) => {
  /** @type {string[]} */
  const output = [];

  if (changes.renamed.length) {
    output.push('### Renamings', '');
    for (const rename of changes.renamed) {
      output.push(renameBullet(rename));
    }
    output.push('');
  }

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
const pullsFromGitHub = (fromDate) =>
  queryPRs({
    search: `is:pr merged:>=${fromDate}`,
    json: 'number,url,mergeCommit',
    jq: '[.[] | { mergeCommit: .mergeCommit.oid, number: .number, url: .url }]', // Flatten the structure provided by GitHub
  });

/**
 * Get the diff from the pull request
 * @param {FeatureChange} pull The pull request to test
 * @returns {Promise<{ added: string[]; removed: string[]; renamed: Array<{ from: string; to: string }> }>} The changes from the pull request
 */
const getDiff = async (pull) => {
  let diff;

  try {
    diff = await diffFeatures({ ref1: pull.mergeCommit, quiet: true });
  } catch (e) {
    throw new Error(
      `${styleText('red', String(e))}\n ${styleText('yellow', `(Failed to diff features for #${pull.number}, skipping)`)}`,
    );
  }

  /** @type {Array<{ from: string; to: string }>} */
  let renamed = [];
  if (pull.mergeCommit) {
    try {
      renamed = detectRenames(pull.mergeCommit, diff.added, diff.removed);
    } catch (e) {
      console.error(
        styleText(
          'yellow',
          `(Failed to detect renames for #${pull.number}: ${String(e)})`,
        ),
      );
    }
  }

  if (renamed.length) {
    const renamedFrom = new Set(renamed.map((r) => r.from));
    const renamedTo = new Set(renamed.map((r) => r.to));
    diff.added = diff.added.filter((f) => !renamedTo.has(f));
    diff.removed = diff.removed.filter((f) => !renamedFrom.has(f));
  }

  /** @type {string[]} */
  const counts = [];
  if (diff.added.length) {
    counts.push(styleText('green', `${diff.added.length} added`));
  }
  if (diff.removed.length) {
    counts.push(styleText('red', `${diff.removed.length} removed`));
  }
  if (renamed.length) {
    counts.push(styleText('cyan', `${renamed.length} renamed`));
  }
  console.log(
    ` | #${pull.number} - ${styleText('blue', counts.length ? `(${counts.join(', ')})` : '(No feature count changes)')}`,
  );

  return { ...diff, renamed };
};

/**
 * Get changes from the pull requests that have been merged since a specified date
 * @param {string} date The starting date to query pull requests from
 * @returns {Promise<Changes>} The changes from all of the pull requests
 */
export const getChanges = async (date) => {
  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic,
  );
  const pulls = pullsFromGitHub(date);

  /** @type {Changes} */
  const changes = {
    added: [],
    removed: [],
    renamed: [],
  };

  progressBar.start(pulls.length, 0);

  await Promise.all(
    pulls.map(async (pull) => {
      const diff = await getDiff(pull);

      changes.added.push(
        ...diff.added.map((feature) => ({
          number: pull.number,
          url: pull.url,
          feature,
        })),
      );

      changes.removed.push(
        ...diff.removed.map((feature) => ({
          number: pull.number,
          url: pull.url,
          feature,
        })),
      );

      changes.renamed.push(
        ...diff.renamed.map(({ from, to }) => ({
          number: pull.number,
          url: pull.url,
          from,
          to,
        })),
      );

      progressBar.increment();
    }),
  );

  progressBar.stop();
  console.log('\n');

  changes.added.sort((a, b) => a.feature.localeCompare(b.feature));
  changes.removed.sort((a, b) => a.feature.localeCompare(b.feature));
  changes.renamed.sort((a, b) => a.from.localeCompare(b.from));

  return changes;
};
