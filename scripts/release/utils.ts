/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import {
  execSync,
  ExecSyncOptionsWithStringEncoding,
  spawnSync,
  SpawnSyncOptionsWithStringEncoding,
} from 'node:child_process';

/**
 * Execute a command
 * @param command The command to execute
 * @param opts The options to pass to execSync
 * @returns The output from the command
 */
export const exec = (
  command: string,
  opts?: ExecSyncOptionsWithStringEncoding,
): string => execSync(command, { encoding: 'utf8', ...opts }).trim();

/**
 * Execute a command
 * @param command The command to execute
 * @param args The arguments to pass
 * @param opts The options to pass to spawnSync
 * @returns The output from the command
 */
export const spawn = (
  command: string,
  args: readonly string[],
  opts?: SpawnSyncOptionsWithStringEncoding,
): string => {
  const result = spawnSync(command, args, { encoding: 'utf8', ...opts });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      `The command '${command}' returned non-zero exit status ${result.status}: ${result.stderr}`,
    );
  }

  return result.stdout.trim();
};

/**
 * Check for GitHub CLI and exit the program if it's not existent
 */
export const requireGitHubCLI = (): void => {
  const command = 'gh auth status';
  try {
    execSync(command, { encoding: 'utf8', stdio: 'ignore' });
  } catch (err) {
    console.trace(err);
    console.error(`Error: ${command} failed.`);
    console.error('The GitHub CLI is required.');
    console.error('See https://cli.github.com/ for installation instructions.');
    process.exit(1);
  }
};

/**
 * Check for repository write permissions
 */
export const requireWriteAccess = () => {
  const username = exec('gh api user -q .login');
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
  JSON.parse(exec(`gh api /repos/mdn/browser-compat-data${endpoint}`));

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
  const args = Object.entries(searchDetails)
    .map(([key, value]) => `--${key}='${value}'`)
    .join(' ');
  const command = `gh pr list ${args}`;

  return JSON.parse(exec(command));
};

/**
 * Ensures main is fetched.
 */
export const fetchMain = (): void => {
  exec('git fetch origin main');
};

/**
 * Get the latest Git tag
 * @returns The latest Git tag
 */
export const getLatestTag = (): string =>
  exec('git describe --abbrev=0 --tags');

/**
 * Get the date of a specified ref
 * @param ref The ref to check
 * @param querySafe Format the string for HTML
 * @returns The ref date
 */
export const getRefDate = (ref: string, querySafe = false): string => {
  const rawDateString = exec(`git log -1 --format=%aI ${ref}`);

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
