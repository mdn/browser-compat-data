/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { shouldWaitForStable } from './firefox.js';

describe('shouldWaitForStable', () => {
  const cases = [
    {
      name: 'normal cycle: beta is stable + 1',
      beta: 157,
      stable: 156,
      expected: false,
    },
    {
      name: 'release day: beta is stable + 2',
      beta: 157,
      stable: 155,
      expected: true,
    },
    { name: 'beta equals stable', beta: 156, stable: 156, expected: false },
  ];

  for (const { name, beta, stable, expected } of cases) {
    it(`returns ${expected} for ${name}`, () => {
      assert.equal(shouldWaitForStable(beta, stable), expected);
    });
  }
});
