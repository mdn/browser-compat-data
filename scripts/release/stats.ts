/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

export type Stats = {
  commits: number;
  changed: number;
  insertions: number;
  deletions: number;

  releaseContributors: number;
  totalContributors: number;
  features: number;
  stars: number;
  start: string;
  end: string;
};

type ChangeStats = Pick<
  Stats,
  'commits' | 'changed' | 'insertions' | 'deletions'
>;

import chalk from 'chalk-template';

import { walk } from '../../utils/index.js';
import pluralize from '../lib/pluralize.js';

import { exec, queryPRs, githubAPI } from './utils.js';

/**
 * Get stargazers for the repository
 * @returns {number} The number of stargazer
 */
const stargazers = async (): Promise<number> => {
  const json = githubAPI('');
  return json.stargazers_count;
};

/**
 * Get the number of contributors that have committed to the repository
 * @returns {number} The number of contributors that have contributed to the repository
 */
const contributors = (): number => {
  const data = exec(
    'gh api /repos/mdn/browser-compat-data/contributors?anon=1 --paginate',
  );
  return JSON.parse('[' + data.replace(/\]\[/g, '],[') + ']').flat(1).length;
};

/**
 * Get all of the stats for the release
 * @param {string} start The last version number
 * @returns {ChangeStats} The statistics
 */
const stats = (start: string): ChangeStats => {
  // Get just the diff stats summary
  const diff = exec(`git diff --shortstat ${start}...main`);
  if (diff === '') {
    console.error(chalk`{red No changes for which to generate statistics.}`);
    process.exit(1);
  }

  // Extract the numbers from a line like this:
  // 50 files changed, 1988 insertions(+), 2056 deletions(-)
  const match = diff.match(
    /(?<changed>\d+) files? changed(?:, (?<insertions>\d+) insertions?(\(\+\)))?(?:, (?<deletions>\d+) deletions?\(-\))?/,
  );
  if (!match) {
    console.error(chalk`{red No changes for which to generate statistics.}`);
    process.exit(1);
  }

  const { changed, insertions, deletions } = match.groups as any;

  // Get the number of commits
  const commits = exec(`git rev-list --count ${start}...main`);

  return {
    commits: Number(commits),
    changed: Number(changed) || 0,
    insertions: Number(insertions) || 0,
    deletions: Number(deletions) || 0,
  };
};

/**
 * Get the number of contributors that have committed to this release
 * @param {string} fromDate The date of the last release
 * @returns {Set<string>} The authors of the commits
 */
const getReleaseContributors = (fromDate: string): Set<string> => {
  const prs = queryPRs({
    json: 'author',
    search: `merged:>=${fromDate}`,
  });
  return new Set(prs.map((pr) => pr.author.login));
};

/**
 * Count the number of features in BCD
 * @returns {number} The number of features
 */
const countFeatures = (): number => [...walk()].length;

/**
 * Format the stats as Markdown
 * @param {Stats} details The stats to format
 * @returns {string} The formatted stats
 */
export const formatStats = (details: Stats): string =>
  [
    '### Statistics',
    '',
    `- ${pluralize('contributor', details.releaseContributors)} ${
      details.releaseContributors > 1 ? 'have' : 'has'
    } changed ${pluralize('file', details.changed)} with ${pluralize(
      'addition',
      details.insertions,
    )} and ${pluralize('deletion', details.deletions)} in ${pluralize(
      'commit',
      details.commits,
    )} ([\`${details.start}...${
      details.end
    }\`](https://github.com/mdn/browser-compat-data/compare/${
      details.start
    }...${details.end}))`,
    `- ${pluralize('total feature', details.features)}`,
    `- ${pluralize('total contributor', details.totalContributors)}`,
    `- ${pluralize('total stargazer', details.stars)}`,
    '',
  ].join('\n');

/**
 * Get the statistics for the release
 * @param {string} start The last release number
 * @param {string} end This release number
 * @param {string} startDate The date of the last release
 * @returns {Stats} The release statistics
 */
export const getStats = async (
  start: string,
  end: string,
  startDate: string,
): Promise<Stats> => ({
  start,
  end,
  ...stats(start),
  releaseContributors: getReleaseContributors(startDate).size,
  totalContributors: contributors(),
  stars: await stargazers(),
  features: countFeatures(),
});
