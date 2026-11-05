/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { pruneImplicitMirror } from './mirror.js';

describe('pruneImplicitMirror', () => {
  const cases = [
    {
      name: 'removes mirror: true from legacy-only Edge statements',
      edge: [{ version_added: '16', mirror: true }],
      expected: [{ version_added: '16' }],
    },
    {
      name: 'keeps mirror: false as the opt-out marker',
      edge: { version_added: '16', mirror: false },
      expected: { version_added: '16', mirror: false },
    },
    {
      name: 'keeps mirror: true on blocks that are not legacy-only',
      edge: [
        { version_added: '90' },
        { version_added: '18', version_removed: '79', mirror: true },
      ],
      expected: [
        { version_added: '90' },
        { version_added: '18', version_removed: '79', mirror: true },
      ],
    },
  ];

  for (const { name, edge, expected } of cases) {
    it(name, () => {
      const bcd = {
        feature: {
          __compat: {
            support: { chrome: { version_added: '66' }, edge },
          },
        },
      };
      pruneImplicitMirror(/** @type {*} */ (bcd));
      assert.deepEqual(bcd.feature.__compat.support.edge, expected);
    });
  }
});
