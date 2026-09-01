/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { spawn } from '../../utils/index.js';

/**
 * @typedef {object} Fields
 * @property {string} value The status value of the change
 * @property {string} headPath The file path at the head commit
 * @property {string} basePath The file path at the base commit
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

/**
 * Get the name of the git remote that points at the upstream repository
 * @returns {string} The remote name, or "origin" if there is no such remote
 */
const getUpstreamRemote = () =>
  spawn('git', ['remote', '-v'])
    .split('\n')
    .find((line) => line.includes('mdn/browser-compat-data'))
    ?.split(/\s+/, 2)
    .at(0) ?? 'origin';

/**
 * Fetch a git reference and resolve it to a commit hash
 * @param {string} ref The reference to fetch and resolve
 * @returns {string} The commit hash corresponding to the reference
 */
const fetchAndResolveRef = (ref) => {
  const remote = getUpstreamRemote();

  /**
   * Runs `git fetch` for a reference.
   * @param {string} ref - the reference to fetch.
   * @returns {string} Combined standard output/error of the command.
   */
  const gitFetch = (ref) => spawn('git', ['fetch', remote, ref]);

  /**
   * Runs `git rev-parse` for a reference.
   * @param {string} ref - the reference to parse.
   * @returns {string} Standard output of the command.
   */
  const gitRevParse = (ref) => spawn('git', ['rev-parse', ref]);

  if (ref.startsWith('origin/')) {
    const remoteRef = ref.slice('origin/'.length);
    gitFetch(remoteRef);
    return gitRevParse(ref);
  } else if (ref.startsWith(`${remote}/`)) {
    const remoteRef = ref.slice(`${remote}/`.length);
    gitFetch(remoteRef);
    return gitRevParse(ref);
  } else if (ref.startsWith('pull/')) {
    gitFetch(ref);
    return gitRevParse('FETCH_HEAD');
  } else if (ref.includes(':')) {
    const remoteRef = `gh pr view ${ref} --json headRefOid -q '.headRefOid'`;
    gitFetch(remoteRef);
    return remoteRef;
  } else if (/^[0-9a-f]{40}$/.test(ref)) {
    try {
      gitRevParse(ref);
    } catch {
      gitFetch(ref);
    }
    return ref;
  }

  return gitRevParse(ref);
};

/**
 * Resolve the base and head references of a diff, expanding a pull request
 * number given as base into the pull request's merge commit
 * @param {string} base The base reference, or a pull request number
 * @param {string} head The head reference
 * @returns {{ base: string; head: string }} The resolved commit hashes
 */
const resolveDiffRefs = (base, head) => {
  if (/^\d+$/.test(base)) {
    head = `pull/${base}/merge`;
    base = 'origin/main';
  }

  return { base: fetchAndResolveRef(base), head: fetchAndResolveRef(head) };
};

export {
  getMergeBase,
  getGitDiffStatuses,
  getFileContent,
  getUpstreamRemote,
  fetchAndResolveRef,
  resolveDiffRefs,
  getBranchName,
  getHashOfHEAD,
};
