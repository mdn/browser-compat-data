/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import child_process from 'node:child_process';

type Fields = {
  value: string;
  headPath: string;
  basePath: string;
};

/**
 * Get the git merge base
 * @param {string} x The first git reference
 * @param {string} y The second git reference
 * @returns {string} The output from the `git merge-base` command
 */
const getMergeBase = (x: string, y = 'HEAD'): string =>
  child_process
    .execSync(`git merge-base ${x} ${y}`, { encoding: 'utf-8' })
    .trim();

/**
 * Parse fields from a git diff status output
 * @param {string[]} fields The fields to parse
 * @returns {Fields} The parsed fields
 */
const parseFields = (fields: string[]): Fields => ({
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
const getGitDiffStatuses = (base: string, head: string): Fields[] =>
  child_process
    .execSync(`git diff --name-status ${base} ${head}`, { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .map((line) => line.split('\t'))
    .map(parseFields);

/**
 * Get file contents from a specific commit and file path
 * @param {string} commit The commit hash to get contents from
 * @param {string} path The file path to get contents from
 * @returns {string} The file contents
 */
const getFileContent = (commit: string, path: string): string =>
  child_process
    .execSync(`git show ${commit}:${path}`, {
      encoding: 'utf-8',
      stdio: 'pipe',
    })
    .trim();

export { getMergeBase, getGitDiffStatuses, getFileContent };
