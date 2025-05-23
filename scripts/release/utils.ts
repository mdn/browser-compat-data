/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { spawn } from '../../utils/index.js';

/**
 * Check for GitHub CLI and exit the program if it's not existent
 */
export const requireGitHubCLI = (): void => {
  try {
    spawn('gh', ['auth', 'status'], { stdio: 'ignore' });
  } catch (err) {
    console.trace(err);
    console.error('Error: gh failed.');
    console.error('The GitHub CLI is required.');
    console.error('See https://cli.github.com/ for installation instructions.');
    process.exit(1);
  }
};

/**
 * Check for repository write permissions
 */
export const requireWriteAccess = () => {
  const username = spawn('gh', ['api', 'user', '-q', '.login']);
  const authStats = githubAPI(`/collaborators/${username}/permission`);

  if (authStats.permission === 'read') {
    console.error(
      'Error: you must have write access to mdn/browser-compat-data to use this script.',
    );
    process.exit(1);
  }
};

/**
 * Run a query on the GitHub API using the GitHub CLI
 * @param endpoint The API endpoint to query
 * @returns The response from the API
 */
export const githubAPI = (endpoint: string): any =>
  JSON.parse(spawn('gh', ['api', `/repos/mdn/browser-compat-data${endpoint}`]));

/**
 * Query pull requests
 * @param queryArgs The CLI arguments for the query
 * @returns The response from the API
 */
export const queryPRs = (queryArgs: any): any => {
  const searchDetails = {
    limit: 1000, // As many PRs as GitHub will allow
    json: 'number',
    ...queryArgs,
  };
  const args = Object.entries(searchDetails).flatMap(([key, value]) => [
    `--${key}`,
    `${value}`,
  ]);

  return JSON.parse(spawn('gh', ['pr', 'list', ...args]));
};

/**
 * Ensures main is fetched.
 */
export const fetchMain = (): void => {
  spawn('git', ['fetch', 'origin', 'main']);
};

/**
 * Get the latest Git tag
 * @returns The latest Git tag
 */
export const getLatestTag = (): string =>
  spawn('git', ['describe', '--abbrev=0', '--tags']);

/**
 * Get the date of a specified ref
 * @param ref The ref to check
 * @param querySafe Format the string for HTML
 * @returns The ref date
 */
export const getRefDate = (ref: string, querySafe = false): string => {
  const rawDateString = spawn('git', ['log', '-1', '--format=%aI', ref]);

  if (querySafe) {
    return rawDateString.replaceAll('+', '%2B');
  }
  return rawDateString;
};

/**
 * Wait for a key press
 * @returns Once the key is pressed, return
 */
export const keypress = async () => {
  process.stdin.setRawMode(true);
  return new Promise((resolve) =>
    process.stdin.once('data', () => {
      process.stdin.setRawMode(false);
      resolve(true);
    }),
  );
};
