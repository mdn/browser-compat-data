import chalk from 'chalk-template';
import { Linter, Logger } from '../utils.js';

import type {
  CompatStatement,
  SimpleSupportStatement,
} from '../../types/types';

function stringOrArrayIncludes(
  target: SimpleSupportStatement['notes'],
  str: string,
) {
  if (!target) {
    return false;
  }
  if (Array.isArray(target)) {
    return target.some((item) => item.includes(str));
  }
  return target.includes(str);
}

function includesTrackingBug(statement: SimpleSupportStatement) {
  return (
    stringOrArrayIncludes(statement.notes, 'crbug.com') ||
    stringOrArrayIncludes(statement.notes, 'bugzil.la') ||
    stringOrArrayIncludes(statement.notes, 'webkit.org/b/')
  );
}

export function hasSupportHistory(compat: CompatStatement) {
  return Object.values(compat.support).some(
    (c) => Array.isArray(c) || !!c.version_added || includesTrackingBug(c),
  );
}

export default {
  name: 'Support history',
  description: 'Ensure that prefixes in support statements are valid',
  scope: 'feature',
  check(logger: Logger, { data }: { data: CompatStatement }) {
    if (!hasSupportHistory(data)) {
      logger.error(chalk`No support and no tracking bug`);
    }
  },
} as Linter;
