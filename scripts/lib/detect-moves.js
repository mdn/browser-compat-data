/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { walk } from '../../utils/index.js';

/**
 * Converts a value to an array unless it already is one.
 * @param {*} value array or any value.
 * @returns {*[]} the array, or an array with the value as a single item.
 */
const toArray = (value) => (Array.isArray(value) ? value : [value]);

/**
 * Collects URL fingerprints (spec_url and mdn_url) for each feature, and
 * includes features without URLs as empty entries so they're available to
 * the token-based fallback matcher.
 * @param {*} contents the merged data tree.
 * @returns {Map<string, Set<string>>} map from feature path to URL set (possibly empty).
 */
export const collectFeatures = (contents) => {
  /** @type {Map<string, Set<string>>} */
  const features = new Map();
  for (const { path, compat } of walk(undefined, contents)) {
    /** @type {Set<string>} */
    const urls = new Set();
    if (compat.spec_url) {
      for (const url of toArray(compat.spec_url)) {
        urls.add(`spec:${url}`);
      }
    }
    if (compat.mdn_url) {
      urls.add(`mdn:${compat.mdn_url}`);
    }
    features.set(path, urls);
  }
  return features;
};

/**
 * Tokenizes a feature path's leaf segment into lowercase words, splitting on
 * `_`, `.` and camelCase boundaries. Returns a Set so each word counts once
 * per feature.
 * @param {string} path the feature path.
 * @returns {Set<string>} the leaf tokens.
 */
export const tokenizeLeaf = (path) => {
  const leaf = path.split('.').pop() ?? '';
  return new Set(
    leaf
      .split(/[_.]+|(?=[A-Z])/)
      .filter(Boolean)
      .map((w) => w.toLowerCase()),
  );
};

/**
 * Reads the value at a dot-separated path within a tree.
 * @param {*} root the root object.
 * @param {string} path dot-separated path.
 * @returns {*} the value, or undefined if any segment is missing.
 */
export const getAt = (root, path) => {
  let node = root;
  for (const part of path.split('.')) {
    if (typeof node !== 'object' || node === null) {
      return undefined;
    }
    node = node[part];
  }
  return node;
};

/**
 * Detects features that were moved (renamed) in two passes:
 *   1. Match by shared spec_url/mdn_url, with longest-shared-path-prefix as
 *      tiebreaker when multiple candidates share a URL.
 *   2. For features still unmatched, match by common ancestor path plus
 *      shared non-scaffold leaf words (`keepalive`, `signal`, etc.).
 *      Scaffold tokens — those appearing in more than half of unmatched
 *      removed or added features (e.g. `init`, `parameter`) — are ignored.
 * @param {*} baseContents the merged base data tree.
 * @param {*} headContents the merged head data tree.
 * @returns {Map<string, string>} map from removed path to added path.
 */
export const detectMoves = (baseContents, headContents) => {
  const baseFeatures = collectFeatures(baseContents);
  const headFeatures = collectFeatures(headContents);

  /** @type {Map<string, string[]>} */
  const addedByUrl = new Map();
  for (const [path, urls] of headFeatures) {
    if (baseFeatures.has(path)) {
      continue;
    }
    for (const url of urls) {
      const list = addedByUrl.get(url) ?? [];
      list.push(path);
      addedByUrl.set(url, list);
    }
  }

  /** @type {Map<string, string>} */
  const moves = new Map();
  /** @type {Set<string>} */
  const matchedDests = new Set();
  for (const [removedPath, urls] of baseFeatures) {
    if (headFeatures.has(removedPath) || urls.size === 0) {
      continue;
    }
    /** @type {Set<string>} */
    const candidates = new Set();
    for (const url of urls) {
      for (const candidate of addedByUrl.get(url) ?? []) {
        candidates.add(candidate);
      }
    }
    if (candidates.size === 0) {
      continue;
    }

    const removedParts = removedPath.split('.');
    let best = '';
    let bestScore = -1;
    for (const candidate of candidates) {
      const candidateParts = candidate.split('.');
      let score = 0;
      while (
        score < removedParts.length &&
        score < candidateParts.length &&
        removedParts[score] === candidateParts[score]
      ) {
        score++;
      }
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    }
    moves.set(removedPath, best);
    matchedDests.add(best);
  }

  // Pass 2: token + common-ancestor matching for the rest.
  const unmatchedRemoved = [...baseFeatures.keys()].filter(
    (p) => !headFeatures.has(p) && !moves.has(p),
  );
  const unmatchedAdded = [...headFeatures.keys()].filter(
    (p) => !baseFeatures.has(p) && !matchedDests.has(p),
  );
  if (unmatchedRemoved.length === 0 || unmatchedAdded.length === 0) {
    return moves;
  }

  /** @type {Map<string, Set<string>>} */
  const removedTokens = new Map();
  /** @type {Map<string, Set<string>>} */
  const addedTokens = new Map();
  /** @type {Map<string, number>} */
  const removedFreq = new Map();
  /** @type {Map<string, number>} */
  const addedFreq = new Map();
  for (const p of unmatchedRemoved) {
    const tokens = tokenizeLeaf(p);
    removedTokens.set(p, tokens);
    for (const t of tokens) {
      removedFreq.set(t, (removedFreq.get(t) ?? 0) + 1);
    }
  }
  for (const p of unmatchedAdded) {
    const tokens = tokenizeLeaf(p);
    addedTokens.set(p, tokens);
    for (const t of tokens) {
      addedFreq.set(t, (addedFreq.get(t) ?? 0) + 1);
    }
  }
  /**
   * @param {string} token
   * @returns {boolean} true if the token is too common to be distinctive.
   */
  const isScaffold = (token) =>
    (removedFreq.get(token) ?? 0) > unmatchedRemoved.length / 2 ||
    (addedFreq.get(token) ?? 0) > unmatchedAdded.length / 2;

  for (const removedPath of unmatchedRemoved) {
    const rTokens = /** @type {Set<string>} */ (removedTokens.get(removedPath));
    const rParts = removedPath.split('.');
    let best = '';
    let bestScore = -1;

    for (const addedPath of unmatchedAdded) {
      if (matchedDests.has(addedPath)) {
        continue;
      }
      const aTokens = /** @type {Set<string>} */ (addedTokens.get(addedPath));
      const aParts = addedPath.split('.');

      let ancestor = 0;
      while (
        ancestor < rParts.length - 1 &&
        ancestor < aParts.length - 1 &&
        rParts[ancestor] === aParts[ancestor]
      ) {
        ancestor++;
      }
      if (ancestor === 0) {
        continue;
      }

      let tokenScore = 0;
      for (const t of rTokens) {
        if (aTokens.has(t) && !isScaffold(t)) {
          const freq = (removedFreq.get(t) ?? 0) + (addedFreq.get(t) ?? 0) || 1;
          tokenScore += 1 / freq;
        }
      }
      if (tokenScore === 0) {
        continue;
      }

      const score = ancestor * 1000 + tokenScore;
      if (score > bestScore) {
        best = addedPath;
        bestScore = score;
      }
    }

    if (best) {
      moves.set(removedPath, best);
      matchedDests.add(best);
    }
  }

  return moves;
};
