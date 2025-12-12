/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import bcd from '../index.js';

import { isBrowser, descendantKeys, joinPath } from './walkingUtils.js';
import query from './query.js';

/**
 * @typedef {import('../types/types.js').CompatData} CompatData
 * @typedef {import('../types/types.js').CompatStatement} CompatStatement
 * @typedef {import('../types/types.js').Identifier} Identifier
 * @typedef {import('../types/types.js').BrowserStatement} BrowserStatement
 * @typedef {import('../types/types.js').ReleaseStatement} ReleaseStatement
 * @typedef {import('../types/index.js').DataType} DataType
 */

/**
 * @typedef {object} BrowserReleaseWalkOutput
 * @property {string} path
 * @property {DataType} data
 * @property {BrowserStatement} browser
 * @property {ReleaseStatement} browserRelease
 */

/**
 * @typedef {object} LowLevelWalkOutput
 * @property {string} path
 * @property {DataType} data
 * @property {BrowserStatement} [browser]
 * @property {CompatStatement} [compat]
 * @property {ReleaseStatement} [browserRelease]
 */

/**
 * @typedef {object} WalkOutput
 * @property {string} path
 * @property {DataType} data
 * @property {CompatStatement} compat
 */

/**
 * Walk through the browser releases
 * @param {DataType} data The data to iterate
 * @param {string} [path] The current path
 * @yields {BrowserReleaseWalkOutput} The release info
 * @returns {IterableIterator<BrowserReleaseWalkOutput>}
 */
export function* browserReleaseWalk(data, path) {
  for (const [release, releaseData] of Object.entries(data.releases)) {
    yield {
      path: joinPath(path, 'releases', release),
      data,
      browser: data,
      browserRelease: /** @type {ReleaseStatement} */ (releaseData),
    };
  }
}

/**
 * Walk through the compatibility statements
 * @param {DataType} [data] The data to iterate
 * @param {string} [path] The current path
 * @param {number} [depth] The maximum depth to iterate
 * @yields {LowLevelWalkOutput} The feature info
 * @returns {IterableIterator<LowLevelWalkOutput>}
 */
export function* lowLevelWalk(data = bcd, path, depth = Infinity) {
  if (path !== undefined && path !== '__meta') {
    /** @type {LowLevelWalkOutput} */
    const next = {
      path,
      data,
    };

    if (isBrowser(data)) {
      next.browser = data;
      yield next;
      yield* browserReleaseWalk(data, path);
    } else {
      if (data.__compat !== undefined) {
        next.compat = data.__compat;
      }
      yield next;
    }
  }

  if (depth > 0) {
    for (const key of descendantKeys(data)) {
      yield* lowLevelWalk(data[key], joinPath(path, key), depth - 1);
    }
  }
}

/**
 * Walk the data for compat features
 * @param {string | string[]} [entryPoints] Entry points to iterate
 * @param {CompatData | CompatStatement | Identifier} [data] The data to iterate
 * @yields {WalkOutput} The feature info
 * @returns {IterableIterator<WalkOutput>}
 */
export default function* walk(entryPoints, data = bcd) {
  /** @type {IterableIterator<LowLevelWalkOutput>[]} */
  const walkers = [];

  if (entryPoints === undefined) {
    walkers.push(lowLevelWalk(data));
  } else {
    entryPoints = Array.isArray(entryPoints) ? entryPoints : [entryPoints];
    walkers.push(
      ...entryPoints.map((entryPoint) =>
        lowLevelWalk(query(entryPoint, data), entryPoint),
      ),
    );
  }

  for (const walker of walkers) {
    for (const step of walker) {
      if (step.compat) {
        yield /** @type {WalkOutput} */ (step);
      }
    }
  }
}
