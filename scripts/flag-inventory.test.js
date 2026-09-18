/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import flagInventory from './flag-inventory.js';

describe('flagInventory', () => {
  it('counts all explicit occurrences and sorts each grouping', () => {
    // The recursive InternalIdentifier index signature cannot type this fixture.
    // eslint-disable-next-line jsdoc/reject-any-type
    /** @type {*} */
    const data = {
      api: {
        Example: {
          __compat: {
            support: {
              firefox: [
                {
                  version_added: '2',
                  flags: [
                    { type: 'runtime_flag', name: 'z-flag' },
                    { type: 'preference', name: 'z-pref' },
                    {
                      type: 'preference',
                      name: 'a-pref',
                      value_to_set: 'true',
                    },
                  ],
                },
                {
                  version_added: '1',
                  version_removed: '2',
                  flags: [
                    {
                      type: 'preference',
                      name: 'a-pref',
                      value_to_set: 'false',
                    },
                  ],
                },
              ],
              firefox_android: 'mirror',
              chrome: {
                version_added: '1',
                flags: [{ type: 'preference', name: 'a-pref' }],
              },
              safari: { version_added: false },
            },
          },
          nested: {
            __compat: {
              support: {
                firefox: {
                  version_added: '1',
                  flags: [
                    { type: 'preference', name: 'a-pref' },
                    { type: 'runtime_flag', name: 'a-pref' },
                  ],
                },
              },
            },
          },
        },
      },
    };

    assert.equal(
      flagInventory(data),
      [
        'preference',
        '  chrome',
        '    a-pref: 1',
        '  firefox',
        '    a-pref: 3',
        '    z-pref: 1',
        'runtime_flag',
        '  firefox',
        '    a-pref: 1',
        '    z-flag: 1',
      ].join('\n'),
    );
  });

  it('returns empty output when there are no flags', () => {
    assert.equal(flagInventory({}), '');
  });
});
