/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { spawn } from '../../utils/index.js';

interface Fields {
  value: string;
  headPath: string;
  basePath: string;
}

/**
 * Get the git merge base
 * @param x The first git reference
 * @param y The second git reference
 * @returns The output from the `git merge-base` command
 */
const getMergeBase = (x: string, y = 'HEAD'): string =>
  spawn('git', ['merge-base', x, y]);

/**
 * Parse fields from a git diff status output
 * @param fields The fields to parse
 * @returns The parsed fields
 */
const parseFields = (fields: string[]): Fields => ({
  value: fields[0],
  headPath: fields[2] || fields[1],
  basePath: fields[1],
});

/**
 * Get git diff statuses between two refs
 * @param base The first git ref
 * @param head The second git refs
 * @returns The diff statuses
 */
const getGitDiffStatuses = (base: string, head: string): Fields[] => {
  const stdout = spawn('git', ['diff', '--name-status', base, head]);

  if (!stdout) {
    return [];
  }

  return stdout
    .split('\n')
    .map((line) => line.split('\t'))
    .map(parseFields);
};

/**
 * Get file contents from a specific commit and file path
 * @param commit The commit hash to get contents from
 * @param path The file path to get contents from
 * @returns The file contents
 */
const getFileContent = (commit: string, path: string): string =>
  spawn('git', ['show', `${commit}:${path}`]);

/**
 * Get the current branch name
 * @returns The output from the `git rev-parse --abbrev-ref HEAD` command
 */
const getBranchName = (): string =>
  spawn('git', ['rev-parse', '--abbrev-ref', 'HEAD']);

/**
 * Get commit hash of HEAD
 * @returns The output from the `git rev-parse HEAD` command
 */
const getHashOfHEAD = (): string => spawn('git', ['rev-parse', 'HEAD']);

export {
  getMergeBase,
  getGitDiffStatuses,
  getFileContent,
  getBranchName,
  getHashOfHEAD,
};
