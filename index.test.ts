/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { CompatStatement } from './types/types.js';

import bcd from './index.js';

describe('Using BCD', () => {
  it('subscript notation', () => {
    const data: CompatStatement = bcd['api']['AbortController']['__compat'];
  });

  it('dot notation', () => {
    const data: CompatStatement = bcd.api.AbortController.__compat;
  });
});
