/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { parseReleaseDate } from './edge.js';

describe('parseReleaseDate', () => {
  it('should parse date with abbreviated month correctly', () => {
    const result = parseReleaseDate('12-Mar-2026');
    assert.equal(result.getUTCFullYear(), 2026);
    assert.equal(result.getUTCMonth(), 2); // March is 0-indexed as 2
    assert.equal(result.getUTCDate(), 12);
  });
});
