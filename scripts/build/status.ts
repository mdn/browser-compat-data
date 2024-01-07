/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import bcd from '../../index.js';
import {
  CompatStatement,
  StatusBlock,
  BrowserName,
  SimpleSupportStatement,
} from '../../types/types.js';
import { InternalSupportStatement } from '../../types/index.js';

const { browsers } = bcd;

const now = new Date();

const twoYearsAgo = new Date();
twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

/**
 * Check if experimental should be true or false
 * @param data The data to check
 * @returns The expected experimental status
 */
export const checkExperimental = (data: CompatStatement): boolean => {
  if (data.status?.experimental) {
    // Check if experimental should be false (code copied from migration 007)

    const browserSupport = new Set<BrowserName>();

    for (const [browser, support] of Object.entries(
      data.support as InternalSupportStatement,
    )) {
      if (support === 'mirror') {
        // We don't need to check mirrored statements when calculating experimental status
        continue;
      }

      for (const statement of Array.isArray(support) ? support : [support]) {
        if (!statement.version_added) {
          // Ignore statements without support
          continue;
        }

        if (statement.flags || statement.prefix || statement.alternative_name) {
          // Ignore anything behind flag, prefix or alternative name
          continue;
        }

        if (statement.version_added === 'preview') {
          // Ignore preview browsers
          continue;
        }

        if (statement.version_removed) {
          // Ignore browsers that removed support
          continue;
        }

        if (typeof statement.version_added === 'string') {
          const release =
            browsers[browser].releases[
              statement.version_added.replace('≤', '')
            ];

          if (release.status !== 'current') {
            // Experimental status is only set based upon support in stable  browser releases
            continue;
          }

          if (new Date(release.date) <= twoYearsAgo) {
            // If any browser supported the feature for over two years, experimental should be false
            return false;
          }
        }

        // We'll need to check support by engine if the above conditions don't apply
        browserSupport.add(browser as BrowserName);
      }
    }

    // Now check which of Blink, Gecko and WebKit support it.
    const engineSupport = new Set();

    for (const browser of browserSupport) {
      const currentRelease = Object.values(browsers[browser].releases).find(
        (r) => r.status === 'current',
      );
      const engine = currentRelease?.engine;
      if (engine) {
        engineSupport.add(engine);
      }
    }

    let engineCount = 0;
    for (const engine of ['Blink', 'Gecko', 'WebKit']) {
      if (engineSupport.has(engine)) {
        engineCount++;
      }
    }

    if (engineCount > 1) {
      return false;
    }
  }

  // If none of the conditions matched, the feature is experimental
  return true;
};

/**
 * Automatically set the status blocks for features
 * @param data The data to update
 * @returns The updated data
 */
const getStatus = (
  ident: string,
  data: CompatStatement,
): StatusBlock | null => {
  if (ident.startsWith('webextensions')) {
    // Web extensions data doesn't have a status block
    return null;
  }
  const status = {
    deprecated: data.status?.deprecated || false,
    experimental: checkExperimental(data),
    standard_track: !!data.spec_url,
  };

  if (status.deprecated) {
    // Deprecated takes priority over experimental
    status.experimental = false;
  }

  return status;
};

export default getStatus;
