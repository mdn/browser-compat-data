/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {InternalCompatData} from '../types/index.js' */
/** @import {SimpleSupportStatement} from '../types/public.js' */

/**
 * @typedef {'html' | 'plain'} Format
 */

import { styleText } from 'node:util';

import { diffArrays } from 'diff';
import esMain from 'es-main';
import stripAnsi from 'strip-ansi';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import bcd from '../index.js';
import { spawn, walk } from '../utils/index.js';

import { addVersionLast, applyMirroring, transformMD } from './build/index.js';
import { getMergeBase, getFileContent, getGitDiffStatuses } from './lib/git.js';
import dataFolders from './lib/data-folders.js';

const BROWSER_NAMES = Object.keys(bcd.browsers);

/** @type {Format[]} */
const FORMATS = ['html', 'plain'];

const DEFAULT_FORMAT = 'plain';

// FIXME This is bad.
/** @type {string[]} */
const allFlags = [];
/** @type {string[]} */
const allNotes = [];

/**
 * Formats a flag reference.
 * @param {number} index the flag index.
 * @returns {string} formatted reference.
 */
const formatFlagIndex = (index) => `[^f${index + 1}]`;

/**
 * Formats a flag reference.
 * @param {number} index the flag index.
 * @returns {string} formatted reference.
 */
const formatNoteIndex = (index) => `[^n${index + 1}]`;

/**
 * Flattens an object.
 * @param {*} obj the object to flatten.
 * @param {string} [parentKey] the parent key path.
 * @param {Record<string, *>} [result] the intermediate result.
 * @returns {Record<string, *>} the flattened object.
 */
const flattenObject = (obj, parentKey = '', result = {}) => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      if (
        key !== 'version' &&
        typeof obj[key] === 'string' &&
        obj[key] === 'mirror'
      ) {
        obj[key] = {
          version: 'mirror',
        };
      }

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Merge values.
        if ('status' in obj[key]) {
          const { deprecated, standard_track, experimental } = obj[key].status;
          const statusFlags = [
            deprecated && 'deprecated',
            standard_track && 'standard_track',
            experimental && 'experimental',
          ].filter(Boolean);

          obj[key].status = statusFlags.join(',');
        }

        if ('tags' in obj[key]) {
          obj[key].tags = obj[key].tags.join(',');
        }

        if ('version_added' in obj[key]) {
          if ('flags' in obj[key]) {
            // Deduplicate flag.
            const flagsJson = JSON.stringify(obj[key].flags);
            if (!allFlags.includes(flagsJson)) {
              allFlags.push(flagsJson);
            }
            const flagIndex = allFlags.indexOf(flagsJson);
            obj[key].flags = formatFlagIndex(flagIndex);
          }

          if ('notes' in obj[key]) {
            const notes = toArray(obj[key].notes);
            obj[key].notes = notes
              .map((note) => {
                const notesJson = JSON.stringify(note);
                if (!allNotes.includes(notesJson)) {
                  allNotes.push(notesJson);
                }
                const noteIndex = allNotes.indexOf(notesJson);
                return noteIndex;
              })
              .sort()
              .map((index) => formatNoteIndex(index))
              .join(',');
          }

          // After addVersionLast() ran, statements have version_last, so the
          // public SimpleSupportStatement type fits.
          const {
            version_added,
            version_last,
            partial_implementation,
            alternative_name,
            prefix,
            flags,
            notes,
          } = /** @type {SimpleSupportStatement} */ (obj[key]);

          const parts = [
            typeof version_added === 'string'
              ? typeof version_last === 'string'
                ? `${version_added}−${version_last}`
                : `${version_added}+`
              : `${version_added}`,
            partial_implementation && '(partial)',
            flags,
            prefix && `prefix=${prefix}`,
            alternative_name && `altname=${alternative_name}`,
            notes,
          ].filter(Boolean);

          obj[key].version = parts.join(' ');
          delete obj[key].version_added;
          delete obj[key].version_last;
          delete obj[key].version_removed;
          delete obj[key].partial_implementation;
          delete obj[key].alternative_name;
          delete obj[key].prefix;
          delete obj[key].flags;
          delete obj[key].notes;
        }

        // Recursively flatten nested objects
        flattenObject(
          BROWSER_NAMES.includes(key) ? toArray(obj[key]).reverse() : obj[key],
          fullKey,
          result,
        );
      } else {
        // Assign value to the flattened key
        result[fullKey] = obj[key];
      }
    }
  }

  return result;
};

/**
 * Converts value to array unless it isn't.
 * @param {*} value array or any value.
 * @returns {*[]} the array, or an array with the value as a single item.
 */
const toArray = (value) => {
  if (!Array.isArray(value)) {
    value = [value];
  }

  return value;
};

/**
 * Formats a key diff'ed with the previous key.
 * @param {string} key the current key
 * @param {string} lastKey the previous key
 * @param {object} options Options
 * @param {number} [options.fill] The number of characters to fill up to
 * @param {Format} options.format Whether to return HTML, otherwise plaintext
 * @returns {string} diffed key
 */
const diffKeys = (key, lastKey, options) => {
  const len = key.length;
  let fill = options.fill ?? 0;
  /**
   * Filters out irrelevant keys.
   * @param {string} part the key part.
   * @returns {boolean} true, if the part should be ignored, false otherwise
   */
  const keyFilter = (part) => part !== '__compat' && part !== 'support';
  return diffArrays(
    lastKey.split('.').filter(keyFilter),
    key.split('.').filter(keyFilter),
  )
    .filter((part) => !part.removed)
    .map((part) => {
      const key = part.value.join('.');

      if (part.added) {
        const space = fill && len < fill ? ' '.repeat(fill - len) : '';
        fill = 0;
        return (
          (options.format === 'html'
            ? `<strong>${key}</strong>`
            : styleText('blue', key)) + space
        );
      }

      return key;
    })
    .join('.');
};

/**
 * Deeply merges a source object into a target object.
 * @param {*} target The target object to merge into.
 * @param {*} source The source object to merge.
 * @returns {*} the target object with source merged.
 */
const deepMerge = (target, source) => {
  if (typeof target !== 'object' || target === null) {
    return source;
  }
  if (typeof source !== 'object' || source === null) {
    return source;
  }

  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (
      typeof sourceValue === 'object' &&
      typeof targetValue === 'object' &&
      sourceValue !== null &&
      targetValue !== null
    ) {
      target[key] = deepMerge({ ...targetValue }, sourceValue);
    } else {
      target[key] = sourceValue;
    }
  }

  return target;
};

/**
 * Collects URL fingerprints (spec_url and mdn_url) for each feature, and
 * includes features without URLs as empty entries so they're available to
 * the token-based fallback matcher.
 * @param {*} contents the merged data tree.
 * @returns {Map<string, Set<string>>} map from feature path to URL set (possibly empty).
 */
const collectFeatures = (contents) => {
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
const tokenizeLeaf = (path) => {
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
const getAt = (root, path) => {
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
 * Writes a value at a dot-separated path within a tree, creating intermediate
 * plain objects as needed.
 * @param {*} root the root object.
 * @param {string} path dot-separated path.
 * @param {*} value the value to set.
 * @returns {void}
 */
const setAt = (root, path, value) => {
  const parts = path.split('.');
  let node = root;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof node[parts[i]] !== 'object' || node[parts[i]] === null) {
      node[parts[i]] = {};
    }
    node = node[parts[i]];
  }
  node[parts[parts.length - 1]] = value;
};

/**
 * Relocates each move's `__compat` block from its source path to its
 * destination path within the base tree. After projection, the diff treats
 * each move as if the feature had always lived at the new path with the
 * old values, so a pure rename produces no add/remove noise.
 * @param {*} baseContents the base data tree (mutated).
 * @param {Map<string, string>} moves source → destination paths.
 * @returns {void}
 */
const projectMoves = (baseContents, moves) => {
  for (const [from, to] of moves) {
    const source = getAt(baseContents, from);
    if (!source || typeof source !== 'object' || !source.__compat) {
      continue;
    }
    const dest = getAt(baseContents, to);
    if (dest && typeof dest === 'object') {
      dest.__compat = source.__compat;
    } else {
      setAt(baseContents, to, { __compat: source.__compat });
    }
    delete source.__compat;
  }
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
const detectMoves = (baseContents, headContents) => {
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

/**
 * Formats a moved feature path as `prefix.{from → to}.suffix`, with the
 * differing middle segments highlighted (from in red, to in green) and the
 * shared head/tail segments unstyled.
 * @param {string} from the source path.
 * @param {string} to the destination path.
 * @param {object} options Options
 * @param {Format} options.format Whether to return HTML, otherwise plaintext.
 * @returns {string} the formatted move string.
 */
/**
 * Formats a moved feature path as an inline diff, with chunks added in head
 * (green) and chunks present only in base (red) interleaved next to the
 * shared parts. Tokenizes each path so `.`/`_` separators stay attached to
 * the preceding word — partial-word overlaps like `er` in `parameter` and
 * `referrer` aren't matched.
 * @param {string} from the source path.
 * @param {string} to the destination path.
 * @param {object} options Options
 * @param {Format} options.format Whether to return HTML, otherwise plaintext.
 * @returns {string} the formatted move string.
 */
const formatMove = (from, to, options) => {
  /**
   * Tokenizes a path into words and separators (`.`/`_`) so each can be
   * matched independently by the diff.
   * @param {string} s the path to tokenize.
   * @returns {string[]} interleaved word and separator tokens.
   */
  const tokenize = (s) => s.split(/([._])/);
  return diffArrays(tokenize(to), tokenize(from))
    .map((part) => {
      // Note: removed/added is deliberately inverted here, to have additions
      // first — matching the convention used for value diffs.
      const value = part.value.join('');
      if (part.removed) {
        return options.format == 'html'
          ? `<ins style="color: green">${value}</ins>`
          : styleText('green', value);
      } else if (part.added) {
        return options.format == 'html'
          ? `<del style="color: red">${value}</del>`
          : styleText('red', value);
      }
      return value;
    })
    .join('');
};

/**
 * Print diffs
 * @param {string} base Base ref
 * @param {string} head Head ref
 * @param {object} options Options
 * @param {boolean} options.group Whether to group by value, rather than the common feature
 * @param {Format} options.format What output format to use ("color", "html" or "patch")
 * @param {boolean} options.mirror Whether to apply mirroring, rather than ignore "mirror" values
 * @param {boolean} options.transform Whether to apply transforms
 * @returns {void}
 */
const printDiffs = (base, head, options) => {
  if (options.format === 'html') {
    console.log('<pre style="font-family: monospace">');
  }

  /** @type {Map<string, Set<string>>} */
  const groups = new Map();

  /** @type {InternalCompatData} */
  const baseContents = /** @type {*} */ ({});
  /** @type {InternalCompatData} */
  const headContents = /** @type {*} */ ({});

  for (const status of getGitDiffStatuses(base, head)) {
    if (!(
      status.headPath.endsWith('.json') &&
      dataFolders.some((folder) => status.headPath.startsWith(`${folder}/`))
    )) {
      continue;
    }

    const baseFileContents = /** @type {InternalCompatData} */ (
      status.value !== 'A'
        ? JSON.parse(getFileContent(base, status.basePath))
        : {}
    );
    const headFileContents = /** @type {InternalCompatData} */ (
      status.value !== 'D'
        ? JSON.parse(getFileContent(head, status.headPath))
        : {}
    );

    deepMerge(baseContents, baseFileContents);
    deepMerge(headContents, headFileContents);
  }

  if (options.mirror) {
    for (const feature of walk(undefined, baseContents)) {
      applyMirroring(feature);
    }
    for (const feature of walk(undefined, headContents)) {
      applyMirroring(feature);
    }
  }
  for (const feature of walk(undefined, baseContents)) {
    addVersionLast(feature);
  }
  for (const feature of walk(undefined, headContents)) {
    addVersionLast(feature);
  }
  if (options.transform) {
    for (const feature of walk(undefined, baseContents)) {
      transformMD(feature);
    }
    for (const feature of walk(undefined, headContents)) {
      transformMD(feature);
    }
  }

  const moves = detectMoves(baseContents, headContents);

  const baseFeaturePaths = collectFeatures(baseContents);
  const headFeaturePaths = collectFeatures(headContents);
  const movedDests = new Set(moves.values());
  const addedFeatures = [...headFeaturePaths.keys()]
    .filter((p) => !baseFeaturePaths.has(p) && !movedDests.has(p))
    .sort();
  const removedFeatures = [...baseFeaturePaths.keys()]
    .filter((p) => !headFeaturePaths.has(p) && !moves.has(p))
    .sort();

  projectMoves(baseContents, moves);

  const baseData = flattenObject(baseContents);
  const headData = flattenObject(headContents);

  const keys = [
    ...new Set([...Object.keys(baseData), ...Object.keys(headData)]).values(),
  ].sort();

  if (!keys.length) {
    console.log('✔ No data file changed.');
    return;
  }

  const prefix = diffArrays(
    keys.at(0)?.split('.') ?? [],
    keys.at(-1)?.split('.') ?? [],
  )[0]?.value.join('.');

  const commonName =
    options.format === 'html' ? `<h3>${prefix}</h3>` : `${prefix}`;

  /**
   * Renders a colored inline diff between two stringified field values,
   * matching the convention used elsewhere: green for additions in head, red
   * for removals from base. Returns an empty string when the diff would be
   * empty (e.g. null → "mirror" / "false").
   * @param {string} baseValue stringified base value (or `"null"`).
   * @param {string} headValue stringified head value (or `"null"`).
   * @returns {string} the colored diff string.
   */
  const formatValueDiff = (baseValue, headValue) => {
    const splitRegexp =
      /(?<=^")|(?<=[\],/ ])|(?=[[,/ ])|(?="$)|(?<=\d)(?=−)|(?<=−)(?=\d)|(?=#)/;
    let headValueForDiff = headValue;
    let baseValueForDiff = baseValue;

    if (baseValue == 'null') {
      baseValueForDiff = '';
      if (headValue == '"mirror"' || headValue == '"false"') {
        headValueForDiff = '';
      }
    } else if (headValue == 'null') {
      headValueForDiff = '';
    }

    return diffArrays(
      headValueForDiff.split(splitRegexp),
      baseValueForDiff.split(splitRegexp),
    )
      .map((part) => {
        // Note: removed/added is deliberately inverted here, to have
        // additions first.
        const value = part.value.join('');
        if (part.removed) {
          return options.format == 'html'
            ? `<ins style="color: green">${value}</ins>`
            : styleText('green', value);
        } else if (part.added) {
          return options.format == 'html'
            ? `<del style="color: red">${value}</del>`
            : styleText('red', value);
        }
        return value;
      })
      .join('');
  };

  /** @type {Set<string>} */
  const consumedKeys = new Set();
  for (const [, to] of moves) {
    consumedKeys.add(`${to}.__compat.description`);
  }
  for (const path of [...addedFeatures, ...removedFeatures]) {
    consumedKeys.add(`${path}.__compat.description`);
  }

  /**
   * Returns the colored description diff at a feature path, or empty if
   * unchanged.
   * @param {string} path the feature path.
   * @returns {string} the colored description diff (or empty).
   */
  const featureDescriptionDiff = (path) => {
    const key = `${path}.__compat.description`;
    const baseValue = JSON.stringify(baseData[key] ?? null);
    const headValue = JSON.stringify(headData[key] ?? null);
    if (baseValue === headValue) {
      return '';
    }
    return formatValueDiff(baseValue, headValue);
  };

  let lastKey = '';

  for (const key of keys) {
    if (consumedKeys.has(key)) {
      continue;
    }
    const baseValue = JSON.stringify(baseData[key] ?? null);
    const headValue = JSON.stringify(headData[key] ?? null);
    if (baseValue === headValue) {
      continue;
    }
    if (!lastKey) {
      lastKey = key;
    }
    const keyDiff = diffKeys(
      key.slice(prefix.length),
      lastKey.slice(prefix.length),
      options,
    );

    const valueDiff = formatValueDiff(baseValue, headValue);
    const value = valueDiff;

    if (!value.length) {
      // e.g. null => "mirror"
      continue;
    }

    if (options.group) {
      const reverseKeyParts = key.split('.').reverse();
      const browser = reverseKeyParts.find((part) =>
        BROWSER_NAMES.includes(part),
      );
      const field = reverseKeyParts.find((part) => !/^\d+$/.test(part));
      const groupKey = `${!browser ? '' : options.format == 'html' ? `<strong>${browser}</strong>.` : `${styleText('cyan', browser)}.`}${field} = ${value}`;
      const groupValue = key
        .split('.')
        .map((part) => (part !== browser && part !== field ? part : '{}'))
        .reverse()
        .filter((value, index) => index > 0 || value !== '{}')
        .reverse()
        .map((value) =>
          value !== '{}'
            ? value
            : options.format == 'html'
              ? '<small>{}</small>'
              : styleText('dim', '{}'),
        )
        .join('.');
      const group = groups.get(groupKey) ?? new Set();
      group.add(groupValue);
      groups.set(groupKey, group);
    } else {
      const change = `${keyDiff} = ${value}`;
      const group = groups.get(commonName) ?? new Set();
      group.add(change);
      groups.set(commonName, group);
    }
    lastKey = key;
  }

  if (
    groups.size === 0 &&
    !addedFeatures.length &&
    !removedFeatures.length &&
    !moves.size
  ) {
    console.log('✔ No changes.');
    return;
  }

  /** @type {[string, string[]][]} */
  const originalEntries = [...groups.entries()].map(([key, set]) => [
    key,
    [...set.values()],
  ]);

  /** @type {Map<string, string[]>} */
  const entryGroups = new Map();
  for (const [key, values] of originalEntries) {
    const groupKey = JSON.stringify(values);
    const keys = entryGroups.get(groupKey) ?? [];
    keys.push(key);
    entryGroups.set(groupKey, keys);
  }

  const rawEntries = [...entryGroups.entries()];

  if (options.group) {
    // Natural sort.
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base',
    });
    rawEntries.sort(([, a], [, b]) =>
      collator.compare(
        stripAnsi(/** @type {string} */ (a.at(0))),
        stripAnsi(/** @type {string} */ (b.at(0))),
      ),
    );
  }

  const entries = rawEntries.map(([valuesJson, keys]) => [
    keys,
    JSON.parse(valuesJson),
  ]);

  const json = JSON.stringify(entries);
  for (const flagIndex of allFlags.keys()) {
    if (!json.includes(formatFlagIndex(flagIndex))) {
      allFlags[flagIndex] = '';
    }
  }
  for (const noteIndex of allNotes.keys()) {
    if (!json.includes(formatNoteIndex(noteIndex))) {
      allNotes[noteIndex] = '';
    }
  }

  /**
   * Prints references found in the inputs.
   * @param {...string} inputs the inputs to scan for references.
   * @returns {void}
   */
  const printRefs = (...inputs) => {
    /** @type {string[]} */
    const lines = [];
    for (const [index, content] of allFlags.entries()) {
      const ref = formatFlagIndex(index);
      if (inputs.some((input) => input.includes(ref))) {
        lines.push(`${ref}: ${content}`);
      }
    }
    for (const [index, content] of allNotes.entries()) {
      const ref = formatNoteIndex(index);
      if (inputs.some((input) => input.includes(ref))) {
        lines.push(`${ref}: ${content}`);
      }
    }
    if (lines.length > 0) {
      console.log();
      lines.forEach((line) =>
        console.log(
          options.format == 'html'
            ? `<em>${line}</em>`
            : styleText('italic', line),
        ),
      );
    }
  };

  /**
   * @typedef {object} ListingItem
   * @property {string} section section header.
   * @property {string} rendered styled key (path or move).
   * @property {number} visibleLen visible length of `rendered` (no styling).
   * @property {string} desc styled description diff (or empty).
   */

  /** @type {ListingItem[]} */
  const listingItems = [];
  for (const path of addedFeatures) {
    const lastDot = path.lastIndexOf('.');
    const parent = lastDot === -1 ? '' : path.slice(0, lastDot + 1);
    const leaf = lastDot === -1 ? path : path.slice(lastDot + 1);
    const styledLeaf =
      options.format === 'html'
        ? `<ins style="color: green">${leaf}</ins>`
        : styleText('green', leaf);
    listingItems.push({
      section: 'New features',
      rendered: `${parent}${styledLeaf}`,
      visibleLen: path.length,
      desc: featureDescriptionDiff(path),
    });
  }
  for (const path of removedFeatures) {
    const lastDot = path.lastIndexOf('.');
    const parent = lastDot === -1 ? '' : path.slice(0, lastDot + 1);
    const leaf = lastDot === -1 ? path : path.slice(lastDot + 1);
    const styledLeaf =
      options.format === 'html'
        ? `<del style="color: red">${leaf}</del>`
        : styleText('red', leaf);
    listingItems.push({
      section: 'Removed features',
      rendered: `${parent}${styledLeaf}`,
      visibleLen: path.length,
      desc: featureDescriptionDiff(path),
    });
  }
  for (const [from, to] of moves) {
    const rendered = formatMove(from, to, options);
    const visibleLen =
      options.format === 'html'
        ? rendered.replace(/<[^>]+>/g, '').length
        : stripAnsi(rendered).length;
    listingItems.push({
      section: 'Moved features',
      rendered,
      visibleLen,
      desc: featureDescriptionDiff(to),
    });
  }

  if (listingItems.length) {
    const maxLen = Math.max(...listingItems.map((i) => i.visibleLen));
    const hasAnyDesc = listingItems.some((i) => i.desc);
    let lastSection = '';
    for (const item of listingItems) {
      if (item.section !== lastSection) {
        if (lastSection) {
          console.log('');
        }
        const title = `${item.section}:`;
        const styledTitle =
          options.format === 'html'
            ? `<strong>${title}</strong>`
            : styleText('bold', title);
        let header = styledTitle;
        if (hasAnyDesc) {
          const padding = ' '.repeat(Math.max(1, maxLen + 3 - title.length));
          const descLabel = 'description =';
          header +=
            padding +
            (options.format === 'html'
              ? `<em>${descLabel}</em>`
              : styleText('italic', descLabel));
        }
        console.log(header);
        lastSection = item.section;
      }
      let line = `  ${item.rendered}`;
      if (item.desc) {
        const padding = ' '.repeat(1 + maxLen - item.visibleLen);
        const styledDesc =
          options.format === 'html'
            ? `<em>${item.desc}</em>`
            : styleText('italic', item.desc);
        line += padding + styledDesc;
      }
      console.log(line);
    }
    console.log('');
  }

  if (addedFeatures.length || removedFeatures.length || moves.size) {
    console.log('');
  }

  for (const entry of entries) {
    /** @type {string | null} */
    let previousKey = null;
    if (options.group) {
      const [values, keys] = entry;
      if (keys.length == 1) {
        const key = /** @type {string} */ (keys.at(0));
        const keyDiff = diffKeys(key, previousKey ?? key, options);
        values.forEach((value) => console.log(`${value}`));
        console.log(`  ${keyDiff}`);
        printRefs(...values);
        previousKey = key;
      } else {
        previousKey = null;
        console.log(values.join('\n'));
        const maxKeyLength = Math.max(...keys.map((key) => key.length));
        if (options.format == 'html') {
          process.stdout.write(
            `<details><summary>${keys.length} ${keys.length === 1 ? 'path' : 'paths'}</summary>`,
          );
        }
        for (const key of keys) {
          const keyDiff = diffKeys(
            key,
            previousKey ?? /** @type {string} */ (keys.at(1)),
            {
              ...options,
              fill: maxKeyLength,
            },
          );
          console.log(`  ${keyDiff}`);
          previousKey = key;
        }
        if (options.format == 'html') {
          process.stdout.write('</details>');
        }
        printRefs(...values);
        previousKey = null;
      }
    } else {
      const [keys, values] = entry;
      if (values.length == 1) {
        for (const key of keys) {
          const keyDiff = diffKeys(key, previousKey ?? key, options);
          console.log(`${keyDiff}`);
          previousKey = key;
        }
        values.forEach((value) => console.log(`  ${value}`));
        printRefs(...values);
      } else {
        for (const key of keys) {
          const keyDiff = diffKeys(key, previousKey ?? key, options);
          console.log(`${keyDiff}`);
          previousKey = key;
        }
        values.forEach((value) => console.log(`  ${value}`));
        printRefs(...values);
      }
      previousKey = null;
    }
    console.log('');
  }

  if (options.format == 'html') {
    console.log('</pre>');
  }
};

if (esMain(import.meta)) {
  const argv = yargs(hideBin(process.argv))
    .command(
      '$0 [base] [head]',
      'Print a formatted diff for changes between base and head commits',
    )
    .positional('base', {
      describe:
        'The base commit; may be commit hash or other git ref (e.g. "origin/main")',
      type: 'string',
      default: 'origin/main',
    })
    .positional('head', {
      describe:
        'The head commit that changes are applied to; may be commit hash or other git ref (e.g. "origin/main")',
      type: 'string',
      default: 'HEAD',
    })
    .option('format', {
      alias: 'f',
      type: 'string',
      default: DEFAULT_FORMAT,
      choices: /** @type {Readonly<Format[]>} */ (FORMATS),
      /**
       * Coerce the format option value
       * @param {string} value The raw option value
       * @returns {Format} The coerced format
       */
      coerce: (value) => FORMATS.find((f) => f === value) ?? DEFAULT_FORMAT,
    })
    .option('group', {
      type: 'boolean',
      default: true,
    })
    .option('mirror', {
      type: 'boolean',
      default: false,
    })
    .option('transform', {
      type: 'boolean',
      default: false,
    })
    .parseSync();

  const options = argv;

  if (/^\d+$/.test(options.base)) {
    options.head = `pull/${options.base}/merge`;
    options.base = 'origin/main';
  }

  const remote =
    spawn('git', ['remote', '-v'])
      .split('\n')
      .find((line) => line.includes('mdn/browser-compat-data'))
      ?.split(/\s+/, 2)
      .at(0) ?? 'origin';

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

  /**
   * Resolves and fetches the reference.
   * @param {string} ref - the reference to fetch and resolve.
   * @returns {string} Commit hash corresponding to the reference.
   */
  const fetchAndResolve = (ref) => {
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

  options.base = fetchAndResolve(options.base);
  options.head = fetchAndResolve(options.head);

  const { base, head, group, format, mirror, transform } = options;

  printDiffs(getMergeBase(base, head), head, {
    group,
    format,
    mirror,
    transform,
  });
}
