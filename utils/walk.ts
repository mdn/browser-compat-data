/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import {
  CompatData,
  CompatStatement,
  Identifier,
  BrowserStatement,
} from '../types/types.js';
import { DataType } from '../types/index.js';

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
  data: {
    browswer?: BrowserStatement;
    compat?: CompatStatement;
    data: DataType;
  };
  browser?: BrowserStatement;
  compat?: CompatStatement;
};

export function* lowLevelWalk(
  data: DataType = bcd,
  path?: string,
  depth = Infinity,
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
  const walkers: IterableIterator<WalkOutput>[] = [];

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
