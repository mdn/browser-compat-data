/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

type Stats = {
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
import http from 'node:https';

import { exec, queryPRs } from './utils.js';
import { walk } from '../../utils/index.js';
import pluralize from '../lib/pluralize.js';

/**
 *
 * @param {string} url
 * @returns {any}
 */
const getJSON = (url: string): Promise<any> =>
  new Promise((resolve, reject) =>
    http.get(
      url,
      { headers: { 'User-Agent': 'bcd-release-script' } },
      (response) => {
        let body = '';
        response.on('data', (data) => {
          body += data;
        });
        response.on('error', (error) => reject(error));
        response.on('end', () => {
          resolve(JSON.parse(body));
        });
      },
    ),
  );

/**
 * @returns {number}
 */
const stargazers = async (): Promise<number> => {
  const json = await getJSON(
    'https://api.github.com/repos/mdn/browser-compat-data',
  );
  return json.stargazers_count;
};

/**
 * @returns {number}
 */
const contributors = async (): Promise<number> => {
  let count = 0;
  let page = 1;

  while (page > 0) {
    // GitHub doesn't just expose the count on its own so we have to query further
    const json = await getJSON(
      `https://api.github.com/repos/mdn/browser-compat-data/contributors?per_page=100&page=${page}`,
    );
    if (json.length === 0) {
      break;
    }
    count += json.length;
    page++;
  }

  return count;
};

/**
 *
 * @param {string} start
 * @returns {ChangeStats}
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

const getReleaseContributors = (fromDate: string): Set<string> => {
  const prs = queryPRs({
    json: 'author',
    search: `merged:>=${fromDate}`,
  });
  return new Set(prs.map((pr) => pr.author.login));
};

/**
 * @returns {number}
 */
const countFeatures = (): number => [...walk()].length;

/**
 *
 * @param {Stats} details
 * @returns {string}
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

export const getStats = async (
  start: string,
  end: string,
  startDate: string,
): Promise<Stats> => ({
  start,
  end,
  ...stats(start),
  releaseContributors: getReleaseContributors(startDate).size,
  totalContributors: await contributors(),
  stars: await stargazers(),
  features: countFeatures(),
});
