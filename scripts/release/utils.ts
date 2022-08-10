/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'fs/promises';
import { execSync } from 'node:child_process';

/**
 *
 * @param {string} command
 * @returns {string}
 */
export const exec = (command: string, opts?: any): string =>
  execSync(command, { encoding: 'utf8', ...opts }).trim();

/**
 *
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

export const requireWriteAccess = async () => {
  const ghconfig = (
    await fs.readFile(process.env.HOME + '/.config/gh/hosts.yml')
  ).toString();
  const username = (
    ghconfig.match(/user: ([\w_-]+)/) as unknown as string[]
  )[1];
  const authStats = githubAPI(`/collaborators/${username}/permission`);

  if (authStats.permission === 'read') {
    console.error(
      'Error: you must have write access to mdn/browser-compat-data to use this script.',
    );
    process.exit(1);
  }
};

export const githubAPI = (endpoint: string): any =>
  JSON.parse(exec(`gh api /repos/mdn/browser-compat-data${endpoint}`));

export const queryPRs = (queryArgs): any => {
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
 * @returns {string}
 */
export const getLatestTag = (): string =>
  exec('git describe --abbrev=0 --tags');

/**
 *
 * @param {string} ref
 * @param {boolean} querySafe
 * @returns {string}
 */
export const getRefDate = (ref: string, querySafe = false): string => {
  const rawDateString = exec(`git log -1 --format=%aI ${ref}`);

  if (querySafe) {
    return rawDateString.replace('+', '%2B');
  }
  return rawDateString;
};

export const keypress = async () => {
  process.stdin.setRawMode(true);
  return new Promise((resolve) =>
    process.stdin.once('data', () => {
      process.stdin.setRawMode(false);
      resolve(true);
    }),
  );
};
