/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { hasSupportHistory } from '../../test/linter/test-support-history.js';

import type { Identifier } from '../../types/types';

const check = (data: Identifier) => {
  let hasIssue = false;
  if (data.__compat && !hasSupportHistory(data.__compat)) {
    hasIssue = true;
  }
  for (const member in data) {
    if (member === '__compat') {
      continue;
    }
    if (check(data[member])) {
      delete data[member];
    }
  }
  return hasIssue;
};

const fixSupportHistory = (filename: string) => {
  const actual = readFileSync(filename, 'utf-8').trim();
  const data = JSON.parse(actual);

  check(data);
  const expected = JSON.stringify(data, null, 2);

  let target = data;
  while (Object.keys(target).length === 1) {
    target = Object.values(target)[0];
  }
  if (Object.keys(target).length) {
    writeFileSync(filename, expected + '\n', 'utf-8');
  } else {
    unlinkSync(filename);
  }
};

export default fixSupportHistory;
