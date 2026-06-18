/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import pluralize from './pluralize.js';

describe('Pluralize', () => {
  it('should return singular form when quantifier is 1', () => {
    const result = pluralize('apple', 1);
    assert.equal(result, '1 apple');
  });

  it('should return plural form when quantifier is not 1', () => {
    const result = pluralize('apple', 2);
    assert.equal(result, '2 apples');
  });

  it('should return formatted string with chalk when useChalk is true', () => {
    const result = pluralize('apple', 2, true);
    assert.equal(result, '\u001b[1m2\u001b[22m apples');
  });
});
