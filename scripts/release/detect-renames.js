/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {CompatData} from '../../types/types.js' */

import dataFolders from '../lib/data-folders.js';
import { deepMerge } from '../lib/deep-merge.js';
import { detectMoves } from '../lib/detect-moves.js';
import { getFileContent, getGitDiffStatuses } from '../lib/git.js';

/**
 * Build a base/head BCD content tree pair for a single PR by reading the
 * JSON files that changed between `mergeCommit^` and `mergeCommit`.
 * @param {string} mergeCommit the merge commit hash.
 * @returns {{ base: CompatData; head: CompatData }} the merged trees.
 */
const loadTrees = (mergeCommit) => {
  /** @type {CompatData} */
  const base = /** @type {*} */ ({});
  /** @type {CompatData} */
  const head = /** @type {*} */ ({});

  for (const status of getGitDiffStatuses(`${mergeCommit}^`, mergeCommit)) {
    if (
      !(
        status.headPath.endsWith('.json') &&
        dataFolders.some((folder) => status.headPath.startsWith(`${folder}/`))
      )
    ) {
      continue;
    }

    const baseFileContents = /** @type {CompatData} */ (
      status.value !== 'A'
        ? JSON.parse(getFileContent(`${mergeCommit}^`, status.basePath))
        : {}
    );
    const headFileContents = /** @type {CompatData} */ (
      status.value !== 'D'
        ? JSON.parse(getFileContent(mergeCommit, status.headPath))
        : {}
    );

    deepMerge(base, baseFileContents);
    deepMerge(head, headFileContents);
  }

  return { base, head };
};

/**
 * Detect rename pairs within a single PR by reading its changed JSON files
 * and running the shared move-detection heuristic.
 *
 * Only pairs where `from` is in the PR's `removed` list and `to` is in the
 * PR's `added` list are returned — this filters out spurious matches where
 * the heuristic would otherwise pair an unrelated removal with an unrelated
 * addition that happen to share a URL.
 * @param {string} mergeCommit the PR's merge commit hash.
 * @param {string[]} added paths added by the PR (per `diffFeatures`).
 * @param {string[]} removed paths removed by the PR (per `diffFeatures`).
 * @returns {Array<{ from: string; to: string }>} detected renames.
 */
export const detectRenames = (mergeCommit, added, removed) => {
  if (added.length === 0 || removed.length === 0) {
    return [];
  }

  const { base, head } = loadTrees(mergeCommit);
  const moves = detectMoves(base, head);

  const addedSet = new Set(added);
  const removedSet = new Set(removed);

  /** @type {Array<{ from: string; to: string }>} */
  const renames = [];
  for (const [from, to] of moves) {
    if (removedSet.has(from) && addedSet.has(to)) {
      renames.push({ from, to });
    }
  }
  return renames;
};
