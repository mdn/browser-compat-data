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
 * Return a stringified version of the releases list in a browser file, with a
 * prefix and suffix added, which will be removed after performing JSON
 * stringification. This is important because JavaScript wants to move object
 * entries with a floating point as the key to the very end of the list.
 * @param releases The release data
 * @returns The stringified releases
 */
export const stringifyReleases = (
  releases: Record<string, ReleaseStatement>,
): string => {
  const indentStep = '  '; // Constant with the indent step that sortStringify will use

  const sortedKeys = Object.keys(releases).sort(compareVersions);

  let result = '';
  for (let i = 0; i < sortedKeys.length; i++) {
    const k = sortedKeys[i];
    const v = JSON.stringify(releases[k], null, 2).replace(/\n/g, '\n  ');

    // Add it to the result
    result += `${indentStep}"${k}": ${v}`;

    // Check if this is the last entry or not: if not, add a comma
    if (i != sortedKeys.length - 1) {
      result += ',';
    }

    // We always need a carriage return
    result += '\n';
  }
  return `*#*#{\n${result}}#*#*`; // Close the brace and return the string
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

      value.browsers[browser].releases = stringifyReleases(
        value.browsers[browser].releases,
      );
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
    // Browser data needs to be stringified in a special way due to the release data
    return JSON.stringify(data, null, 2)
      .replace('"*#*#', '')
      .replace('#*#*"', '')
      .replace(/\\n/g, '\n      ')
      .replace(/\\"/g, '"');
  }

  return JSON.stringify(data, null, 2);
};

export default stringifyAndOrderProperties;
