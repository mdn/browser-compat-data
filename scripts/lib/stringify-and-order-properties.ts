/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { compareVersions } from 'compare-versions';

import {
  CompatStatement,
  SimpleSupportStatement,
  StatusBlock,
  BrowserStatement,
  ReleaseStatement,
} from '../../types/types.js';

const propOrder = {
  browsers: {
    browser: [
      'name',
      'type',
      'upstream',
      'preview_name',
      'pref_url',
      'accepts_flags',
      'accepts_webextensions',
      'releases',
    ],
    release: [
      'version',
      'release_date',
      'release_notes',
      'status',
      'engine',
      'engine_version',
    ],
  },
  data: {
    __compat: [
      'description',
      'mdn_url',
      'spec_url',
      'tags',
      'support',
      'status',
    ],
    support: [
      'alternative_name',
      'prefix',
      'version_added',
      'version_removed',
      'flags',
      'impl_url',
      'partial_implementation',
      'notes',
    ],
    status: ['experimental', 'standard_track', 'deprecated'],
  },
};

/**
 * Perform property ordering
 * @param value The object to order properties for
 * @param order The order to follow
 * @returns The ordered object
 */
const doOrder = <T>(value: T, order: string[]): T => {
  if (value && typeof value === 'object') {
    return order.reduce((result: Record<string, any>, key: string) => {
      if (key in value) {
        result[key] = value[key];
      }
      return result;
    }, {}) as T;
  }
  return value;
};

/**
 * Return a new feature object whose first-level properties have been
 * ordered according to doOrder, and so will be stringified in that
 * order as well. This relies on guaranteed "own" property ordering,
 * which is insertion order for non-integer keys (which is our case).
 * @param key The key in the object
 * @param value The value of the key
 * @returns The new value
 */
export const orderProperties = (key: string, value: any): any => {
  if (value instanceof Object) {
    // Order properties for data
    if ('__compat' in value) {
      value.__compat = doOrder(
        value.__compat as CompatStatement,
        propOrder.data.__compat,
      );

      for (const browser of Object.keys(value.__compat.support)) {
        const result: SimpleSupportStatement[] = [];
        let data = value.__compat.support[browser];
        if (!Array.isArray(data)) {
          data = [data];
        }

        for (const statement of data) {
          result.push(
            doOrder(
              statement as SimpleSupportStatement,
              propOrder.data.support,
            ),
          );
        }

        value.__compat.support[browser] =
          result.length === 1 ? result[0] : result;
      }

      if ('status' in value.__compat) {
        value.__compat.status = doOrder(
          value.__compat.status as StatusBlock,
          propOrder.data.status,
        );
      }
    }

    // Order properties for browsers
    if ('browsers' in value) {
      const browser = Object.keys(value.browsers)[0];

      value.browsers[browser] = doOrder(
        value.browsers[browser] as BrowserStatement,
        propOrder.browsers.browser,
      );

      for (const r of Object.keys(value.browsers[browser].releases)) {
        value.browsers[browser].releases[r] = doOrder(
          value.browsers[browser].releases[r] as ReleaseStatement,
          propOrder.browsers.release,
        );
      }
    }
  }
  return value;
};

/**
 * Stringify an object in a specific order of properties
 * @param rawdata The object to stringify
 * @returns The stringified object
 */
const stringifyAndOrderProperties = (rawdata: any): string => {
  if (rawdata instanceof Object) {
    rawdata = JSON.stringify(rawdata);
  }
  const data = JSON.parse(rawdata, orderProperties);

  if ('browsers' in data) {
    for (const browserName of Object.keys(data.browsers)) {
      const browser = data.browsers[browserName] as BrowserStatement;
      browser.releases = browser.releases.sort(
        ({ version: a }, { version: b }) => compareVersions(a, b),
      );
    }
  }

  return JSON.stringify(data, null, 2);
};

export default stringifyAndOrderProperties;
