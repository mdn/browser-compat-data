/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import fixDescriptions from './descriptions.js';

describe('fix -> descriptions', () => {
  /**
   * Run the fixer over a walkable data object.
   * @param {string} filename The file path passed to the fixer.
   * @param {object} data The data object to fix.
   * @returns {object} The fixed data object.
   */
  const run = (filename, data) =>
    JSON.parse(fixDescriptions(filename, JSON.stringify(data)));

  /**
   * Build walkable data carrying the given description.
   * @param {string} description The description to attach.
   * @returns {object} A compat data tree carrying the description.
   */
  const withDescription = (description) => ({
    Foo: { bar: { __compat: { description, support: {} } } },
  });

  /** @type {{name: string, description: string, expected: string}[]} */
  const cases = [
    {
      name: 'replaces a <code> tag with backticks',
      description: 'A <code>foo</code> usage',
      expected: 'A `foo` usage',
    },
    {
      name: 'replaces an <a> tag with a Markdown link',
      description: "See <a href='https://example.com'>the docs</a>",
      expected: 'See [the docs](https://example.com)',
    },
    // The linter warns about these instead, so the fixer must not touch them.
    {
      name: 'leaves a <code> tag containing a backtick alone',
      description: 'A <code>a`b</code> usage',
      expected: 'A <code>a`b</code> usage',
    },
    {
      name: 'leaves adjacent <code> tags alone',
      description: 'A <code>a</code><code>b</code> usage',
      expected: 'A <code>a</code><code>b</code> usage',
    },
    {
      name: 'leaves link text containing a closing bracket alone',
      description: "See <a href='https://example.com'>a]b</a>",
      expected: "See <a href='https://example.com'>a]b</a>",
    },
  ];

  for (const { name, description, expected } of cases) {
    it(name, () => {
      assert.deepEqual(
        run('css/properties/foo.json', withDescription(description)),
        withDescription(expected),
      );
    });
  }
});
