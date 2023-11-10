/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import {
  CompatData,
  CompatStatement,
  Identifier,
  BrowserStatement,
  ReleaseStatement,
} from '../types/types.js';
import { DataType } from '../types/index.js';
import bcd from '../index.js';

import { isBrowser, descendantKeys, joinPath } from './walkingUtils.js';
import query from './query.js';

type BrowserReleaseWalkOutput = {
  path: string;
  data: DataType;
  browser: BrowserStatement;
  browserRelease: ReleaseStatement;
};

type LowLevelWalkOutput = {
  path: string;
  data: DataType;
  browser?: BrowserStatement;
  compat?: CompatStatement;
  browserRelease?: ReleaseStatement;
};

export type WalkOutput = {
  path: string;
  data: DataType;
  compat: CompatStatement;
};

/**
 * Walk through the browser releases
 * @param {DataType} data The data to iterate
 * @param {string?} path The current path
 * @yields {BrowserReleaseWalkOutput} The release info
 */
export function* browserReleaseWalk(
  data: DataType,
  path?: string,
): IterableIterator<BrowserReleaseWalkOutput> {
  for (const [release, releaseData] of Object.entries(data.releases)) {
    yield {
      path: joinPath(path, 'releases', release),
      data,
      browser: data,
      browserRelease: releaseData as ReleaseStatement,
    };
  }
}

/**
 * Walk through the compatibility statements
 * @param {DataType} data The data to iterate
 * @param {string?} path The current path
 * @param {number} depth The maximum depth to iterate
 * @yields {LowLevelWalkOutput} The feature info
 */
export function* lowLevelWalk(
  data: DataType = bcd,
  path?: string,
  depth = Infinity,
): IterableIterator<LowLevelWalkOutput> {
  if (path !== undefined && path !== '__meta') {
    const next: LowLevelWalkOutput = {
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
 * @param {string|string[]} entryPoints Entry points to iterate
 * @param {DataType} data The data to iterate
 * @yields {WalkOutput} The feature info
 */
export default function* walk(
  entryPoints?: string | string[],
  data: CompatData | CompatStatement | Identifier = bcd,
): IterableIterator<WalkOutput> {
  const walkers: IterableIterator<LowLevelWalkOutput>[] = [];

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
        yield step as WalkOutput;
      }
    }
  }
}
