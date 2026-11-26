/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import fixLinks from './links.js';

describe('fix -> links', () => {
  /** @type {{name: string, input: string, expected: string}[]} */
  const cases = [
    {
      name: 'replaces a link label between matching URL substrings',
      input:
        '{"before":{"impl_url":"https://crbug.com/493736782"},"notes":"[bug](https://crbug.com/40229450)","after":{"impl_url":"https://crbug.com/593736782"}}',
      expected:
        '{"before":{"impl_url":"https://crbug.com/493736782"},"notes":"[bug 40229450](https://crbug.com/40229450)","after":{"impl_url":"https://crbug.com/593736782"}}',
    },
    {
      name: 'applies errors in source order when rule discovery order differs',
      input:
        '{"notes":"[x](https://crbug.com/40229450) and https://issues.chromium.org/issues/12345678"}',
      expected:
        '{"notes":"[bug 40229450](https://crbug.com/40229450) and https://crbug.com/12345678"}',
    },
  ];

  for (const { name, input, expected } of cases) {
    it(name, async () => {
      assert.equal(await fixLinks('api/Foo.json', input), expected);
    });
  }
});
