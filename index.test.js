/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {InternalCompatStatement} from './types/index.js' */

import assert from 'node:assert/strict';

import bcd from './index.js';

describe('Using BCD', () => {
  it('subscript notation', () => {
    /** @type {InternalCompatStatement | undefined} */
    const data = bcd['api']['AbortController']['__compat'];
    assert.ok(data);
  });

  it('dot notation', () => {
    /** @type {InternalCompatStatement | undefined} */
    const data = bcd.api.AbortController.__compat;
    assert.ok(data);
  });
});
