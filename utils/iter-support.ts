/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import {
  CompatData,
  CompatStatement,
  BrowserName,
  SimpleSupportStatement,
} from '../types/types.js';

export default function iterSupport(
  compat: CompatStatement,
  browser: BrowserName,
): SimpleSupportStatement[] {
  if (browser in compat.support) {
    const data = compat.support[browser];
    if (data) {
      return Array.isArray(data) ? data : [data];
    }
  }

  return [{ version_added: null }];
}
