/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

type Question = {
  name: string;
  message: string;
};

type Answers = Record<Question['name'], number>;

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
type ContributorStats = Pick<
  Stats,
  'releaseContributors' | 'totalContributors'
>;

import http from 'node:https';
import readline from 'readline';
import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { exec, releaseYargsBuilder, ReleaseYargs } from './utils.js';
import { walk } from '../../utils/index.js';

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
 *
 * @param {string} query
 * @returns {string}
 */
const question = async (query: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const response = await new Promise<string>((resolve) =>
    rl.question(query, resolve),
  );
  rl.close();
  console.log();
  return response;
};

/**
 *
 * @param {Question[]} questions
 * @returns {Answers}
 */
const prompt = async (questions: Question[]): Promise<Answers> => {
  const results: Answers = {};
  for (const q of questions) {
    results[q.name] = await question(`${q.message} `).then(Number);
  }
  return results;
};

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
 *
 * @param {string} start
 * @param {string} end
 * @returns {ChangeStats}
 */
const stats = (start: string, end: string): ChangeStats => {
  // Get just the diff stats summary
  const diff = exec(`git diff --shortstat ${start}...${end}`);
  if (diff === '') {
    console.log('No changes for which to generate statistics.');
    process.exit(1);
  }

  // Extract the numbers from a line like this:
  // 50 files changed, 1988 insertions(+), 2056 deletions(-)
  const match = diff.match(
    /(\d+) files* changed, (\d+) insertions*\(\+\), (\d+) deletions*/,
  );
  const [, changed, insertions, deletions] = match as string[];

  // Get the number of commits
  const commits = exec(`git rev-list --count ${start}...${end}`);

  return {
    commits: Number(commits),
    changed: Number(changed),
    insertions: Number(insertions),
    deletions: Number(deletions),
  };
};

/**
 *
 * @param {string} start
 * @param {string} end
 * @returns {ContributorStats}
 */
const contributors = (start: string, end: string): Promise<ContributorStats> =>
  prompt([
    {
      name: 'releaseContributors',
      message: `Find "contributors" at https://github.com/mdn/browser-compat-data/compare/${start}...${end}\nHow many people have contributed to this release?`,
    },
    {
      name: 'totalContributors',
      message:
        'Find "contributors" at https://github.com/mdn/browser-compat-data/\nHow many people have contributed to browser-compat-data overall?',
    },
  ]) as unknown as Promise<
    Pick<Stats, 'releaseContributors' | 'totalContributors'>
  >;

/**
 * @returns {number}
 */
const countFeatures = (): number => [...walk()].length;

const formatter = new Intl.NumberFormat('en-US');

/**
 *
 * @param {number} n
 * @returns {string}
 */
const formatNumber = (n: number): string => formatter.format(n);

/**
 *
 * @param {Stats} details
 * @returns {string}
 */
const formatStats = (details: Stats): string => {
  const releaseContributors = formatNumber(details.releaseContributors);
  const totalContributors = formatNumber(details.totalContributors);
  const changed = formatNumber(details.changed);
  const insertions = formatNumber(details.insertions);
  const deletions = formatNumber(details.deletions);
  const commits = formatNumber(details.commits);
  const features = formatNumber(details.features);
  const stars = formatNumber(details.stars);
  const { start, end } = details;

  return `\
### Statistics

<!-- TODO: replace 'main' with the release version number -->

- ${releaseContributors} contributors have changed ${changed} files with ${insertions} additions and ${deletions} deletions in ${commits} commits ([\`${start}...${end}\`](https://github.com/mdn/browser-compat-data/compare/${start}...${end}))
- ${features} total features
- ${totalContributors} total contributors
- ${stars} total stargazers`;
};

/**
 *
 * @param {ReleaseYargs} argv
 */
const main = async (argv: ReleaseYargs): Promise<void> => {
  const { startVersionTag: start, endVersionTag: end } = argv;
  const contributorStats = await contributors(start, end);

  console.log(
    formatStats({
      start,
      end,
      ...stats(start, end),
      ...contributorStats,
      stars: await stargazers(),
      features: countFeatures(),
    }),
  );
};

if (esMain(import.meta)) {
  const { argv } = yargs(hideBin(process.argv)).command(
    '$0 [start-version-tag [end-version-tag]]',
    'Generate statistics for release notes',
    releaseYargsBuilder,
  );

  await main(argv as unknown as ReleaseYargs);
}
