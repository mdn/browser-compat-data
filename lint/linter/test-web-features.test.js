/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { expectedTags } from './test-web-features.js';

describe('web-features tags', () => {
  const cases = [
    {
      name: 'adds a missing mapped tag',
      tags: undefined,
      expected: ['web-features:aborting'],
    },
    {
      name: 'adds mapped tags while preserving other groups and snapshots',
      tags: [
        'web-features:old',
        'web-features:snapshot:ecmascript-2015',
        'web-features:other',
      ],
      expected: [
        'web-features:old',
        'web-features:snapshot:ecmascript-2015',
        'web-features:other',
        'web-features:aborting',
      ],
    },
    {
      name: 'keeps the current tag',
      tags: ['web-features:aborting'],
      expected: ['web-features:aborting'],
    },
  ];

  for (const { name, tags, expected } of cases) {
    it(name, () => {
      assert.deepEqual(expectedTags(tags, 'api.AbortController'), expected);
    });
  }

  it('leaves unmapped features alone', () => {
    const tags = ['web-features:manual'];
    assert.equal(expectedTags(tags, 'api.UnmappedFeature'), tags);
  });
});
