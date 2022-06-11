/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { CompatStatement } from '../types/types.js';

import bcd from '../index.js';
import query from './query.js';
import { descendantKeys, joinPath, isFeature } from './walkingUtils.js';

const BREAK = Symbol('break');
const CONTINUE = Symbol('continue');

export default function visit(
  visitor: (
    visitorPath: string,
    compat?: CompatStatement,
  ) => string | symbol | undefined,
  options: {
    entryPoint?: string;
    data?;
    test?: (entryPoint: string, data?) => boolean;
  } = {},
): string | symbol | undefined {
  const { entryPoint, data } = options;
  const test = options.test !== undefined ? options.test : () => true;
  const entryPointReal = entryPoint || '';

  const tree = entryPoint === undefined ? bcd : query(entryPoint, data);

  let outcome: string | symbol | undefined;
  if (isFeature(tree) && test(entryPointReal, tree.__compat)) {
    outcome = visitor(entryPointReal, tree.__compat);
  }
  if (outcome === BREAK) {
    return outcome;
  }
  if (outcome !== CONTINUE) {
    for (const key of descendantKeys(tree)) {
      const suboutcome = visit(visitor, {
        entryPoint: joinPath(entryPointReal, key),
        test,
        data,
      });
      if (suboutcome === BREAK) {
        return suboutcome;
      }
    }
  }
  return outcome;
}

visit.BREAK = BREAK;
visit.CONTINUE = CONTINUE;
