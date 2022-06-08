/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import {
  CompatData,
  CompatStatement,
  BrowserName,
  Identifier,
  BrowserStatement,
} from '../types/types.js';

import bcd from '../index.js';
import {
  isBrowser,
  isFeature,
  descendantKeys,
  joinPath,
} from './walkingUtils.js';
import query from './query.js';

type WalkOutput = {
  path: string;
  data: object;
  browser?: BrowserStatement;
  compat?: CompatStatement;
};

export function* lowLevelWalk(
  data: CompatData | BrowserStatement | CompatStatement | Identifier = bcd,
  path?: string,
  depth: number = Infinity,
): IterableIterator<WalkOutput> {
  if (path !== undefined && path !== '__meta') {
    const next: WalkOutput = {
      path,
      data,
    };

    if (isBrowser(data)) {
      next.browser = data as BrowserStatement;
    } else if (isFeature(data)) {
      next.compat = data.__compat;
    }
    yield next;
  }

  if (depth > 0) {
    for (const key of descendantKeys(data)) {
      yield* lowLevelWalk((data as any)[key], joinPath(path, key), depth - 1);
    }
  }
}

export default function* walk(
  entryPoints?: string | string[] | undefined,
  data: CompatData | CompatStatement | Identifier = bcd,
): IterableIterator<WalkOutput> {
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
        yield step;
      }
    }
  }
}
