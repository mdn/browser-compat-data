/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {CompatStatement} from './types/types.js' */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import bcd from './index.js';

describe('Using BCD', () => {
  it('subscript notation', () => {
    /** @type {CompatStatement | undefined} */
    const data = bcd['api']['AbortController']['__compat'];
    assert.ok(data);
  });

  it('dot notation', () => {
    /** @type {CompatStatement | undefined} */
    const data = bcd.api.AbortController.__compat;
    assert.ok(data);
  });
});
