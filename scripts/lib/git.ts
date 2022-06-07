/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import child_process from 'node:child_process';

/**
 * @param {string} x
 * @param {string} y
 */
export function getMergeBase(x: string, y = 'HEAD'): string {
  return child_process
    .execSync(`git merge-base ${x} ${y}`, { encoding: 'utf-8' })
    .trim();
}

/**
 * @param {string} base
 * @param {string} head
 */
export function getGitDiffStatuses(base: string, head: string): object {
  function parseFields(fields: string[]) {
    return {
      value: fields[0],
      headPath: fields[2] || fields[1],
      basePath: fields[1],
    };
  }

  return child_process
    .execSync(`git diff --name-status ${base} ${head}`, { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .map((line) => line.split('\t'))
    .map(parseFields);
}

/**
 * @param {string} commit
 * @param {string} path
 */
export function getFileContent(commit: string, path: string): string {
  return child_process
    .execSync(`git show ${commit}:${path}`, {
      encoding: 'utf-8',
      stdio: 'pipe',
    })
    .trim();
}
