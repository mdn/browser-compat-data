/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import child_process from 'node:child_process';

type Fields = {
  value: string;
  headPath: string;
  basePath: string;
};

/**
 * @param {string} x
 * @param {string} y
 * @returns {string}
 */
const getMergeBase = (x: string, y = 'HEAD'): string => {
  return child_process
    .execSync(`git merge-base ${x} ${y}`, { encoding: 'utf-8' })
    .trim();
};

/**
 *
 * @param {string[]} fields
 * @returns {Fields}
 */
const parseFields = (fields: string[]): Fields => {
  return {
    value: fields[0],
    headPath: fields[2] || fields[1],
    basePath: fields[1],
  };
};

/**
 * @param {string} base
 * @param {string} head
 * @returns {Fields[]}
 */
const getGitDiffStatuses = (base: string, head: string): Array<Fields> => {
  return child_process
    .execSync(`git diff --name-status ${base} ${head}`, { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .map((line) => line.split('\t'))
    .map(parseFields);
};

/**
 * @param {string} commit
 * @param {string} path
 * @returns {string}
 */
const getFileContent = (commit: string, path: string): string => {
  return child_process
    .execSync(`git show ${commit}:${path}`, {
      encoding: 'utf-8',
      stdio: 'pipe',
    })
    .trim();
};

export { getMergeBase, getGitDiffStatuses, getFileContent };
