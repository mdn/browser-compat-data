/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { CompatStatement } from './types/types.js';

import bcd from './index.js';

describe('Using BCD', () => {
  it('subscript notation', () => {
    const data: CompatStatement | undefined =
      bcd['api']['AbortController']['__compat'];
    assert.ok(data);
  });

  it('dot notation', () => {
    const data: CompatStatement | undefined = bcd.api.AbortController.__compat;
    assert.ok(data);
  });
});
