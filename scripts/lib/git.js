/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { spawn } from '../../utils/index.js';

/**
 * @typedef {object} Fields
 * @property {string} value
 * @property {string} headPath
 * @property {string} basePath
 */

/**
 * Get the git merge base
 * @param {string} x The first git reference
 * @param {string} [y] The second git reference
 * @returns {string} The output from the `git merge-base` command
 */
const getMergeBase = (x, y = 'HEAD') => spawn('git', ['merge-base', x, y]);

/**
 * Parse fields from a git diff status output
 * @param {string[]} fields The fields to parse
 * @returns {Fields} The parsed fields
 */
const parseFields = (fields) => ({
  value: fields[0],
  headPath: fields[2] || fields[1],
  basePath: fields[1],
});

/**
 * Get git diff statuses between two refs
 * @param {string} base The first git ref
 * @param {string} head The second git refs
 * @returns {Fields[]} The diff statuses
 */
const getGitDiffStatuses = (base, head) => {
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
 * @param {string} commit The commit hash to get contents from
 * @param {string} path The file path to get contents from
 * @returns {string} The file contents
 */
const getFileContent = (commit, path) =>
  spawn('git', ['show', `${commit}:${path}`]);

/**
 * Get the current branch name
 * @returns {string} The output from the `git rev-parse --abbrev-ref HEAD` command
 */
const getBranchName = () => spawn('git', ['rev-parse', '--abbrev-ref', 'HEAD']);

/**
 * Get commit hash of HEAD
 * @returns {string} The output from the `git rev-parse HEAD` command
 */
const getHashOfHEAD = () => spawn('git', ['rev-parse', 'HEAD']);

export {
  getMergeBase,
  getGitDiffStatuses,
  getFileContent,
  getBranchName,
  getHashOfHEAD,
};
