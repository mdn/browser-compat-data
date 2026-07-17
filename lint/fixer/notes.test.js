/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import fixNotesFixer, { fixNotes } from './notes.js';

describe('fix -> notes', () => {
  /** @type {{name: string, input: string | string[], expected: string | string[]}[]} */
  const cases = [
    {
      name: 'replaces <code> tags with backticks in a string note',
      input: 'Before version 90, <code>foo</code> was required.',
      expected: 'Before version 90, `foo` was required.',
    },
    {
      name: 'replaces <code> tags in each note in an array',
      input: [
        'Before version 90, <code>foo</code> was required.',
        'Use `bar` instead.',
      ],
      expected: [
        'Before version 90, `foo` was required.',
        'Use `bar` instead.',
      ],
    },
    {
      name: 'leaves notes without <code> tags unchanged',
      input: 'Use `foo` instead.',
      expected: 'Use `foo` instead.',
    },
    {
      name: 'does not replace <code> inside backticks',
      input: 'The `<code>` element is not supported.',
      expected: 'The `<code>` element is not supported.',
    },
    {
      name: 'replaces <a> tags with Markdown links',
      input: "See <a href='https://bugzil.la/1'>bug 1</a>.",
      expected: 'See [bug 1](https://bugzil.la/1).',
    },
    {
      name: 'unwraps a nested <code> tag before converting the link',
      input: "Use <a href='https://example.com'><code>foo()</code></a>.",
      expected: 'Use [`foo()`](https://example.com).',
    },
  ];

  for (const { name, input, expected } of cases) {
    it(name, () => {
      assert.deepEqual(fixNotes(input), expected);
    });
  }

  describe('fixer', () => {
    /**
     * Run the default fixer over a walkable data object.
     * @param {string} filename The file path passed to the fixer.
     * @param {object} data The data object to fix.
     * @returns {object} The fixed data object.
     */
    const run = (filename, data) =>
      JSON.parse(fixNotesFixer(filename, JSON.stringify(data)));

    /**
     * Build walkable data with the given Chrome support statement(s).
     * @param {object | object[]} chrome A support statement or array of them.
     * @returns {object} A compat data tree carrying the statement(s).
     */
    const withSupportStatements = (chrome) => ({
      Foo: { __compat: { support: { chrome } } },
    });

    /** @type {{name: string, filename?: string, data: object, expected: object}[]} */
    const cases = [
      {
        name: 'fixes a string note in a support statement',
        data: withSupportStatements({
          version_added: '80',
          notes: 'Use <code>foo</code> instead.',
        }),
        expected: withSupportStatements({
          version_added: '80',
          notes: 'Use `foo` instead.',
        }),
      },
      {
        name: 'converts an HTML link and its nested <code> to Markdown',
        data: withSupportStatements({
          version_added: '80',
          notes:
            "See <a href='https://developer.mozilla.org/docs/Web/API/Foo'><code>Foo</code></a>.",
        }),
        expected: withSupportStatements({
          version_added: '80',
          notes: 'See [`Foo`](https://developer.mozilla.org/docs/Web/API/Foo).',
        }),
      },
      {
        name: 'fixes each note in an array-valued statement',
        data: withSupportStatements({
          version_added: '80',
          notes: ['Use <code>foo</code> instead.', 'And <code>bar</code> too.'],
        }),
        expected: withSupportStatements({
          version_added: '80',
          notes: ['Use `foo` instead.', 'And `bar` too.'],
        }),
      },
      {
        name: 'fixes notes across an array of support statements',
        data: withSupportStatements([
          { version_added: '80', notes: 'Use <code>foo</code>.' },
          { version_added: '10', notes: 'Old <code>bar</code>.' },
        ]),
        expected: withSupportStatements([
          { version_added: '80', notes: 'Use `foo`.' },
          { version_added: '10', notes: 'Old `bar`.' },
        ]),
      },
      {
        name: 'leaves browser data untouched',
        filename: '/browsers/chrome.json',
        data: { browsers: { chrome: { notes: 'Use <code>foo</code>.' } } },
        expected: { browsers: { chrome: { notes: 'Use <code>foo</code>.' } } },
      },
    ];

    for (const { name, filename = 'api/Foo.json', data, expected } of cases) {
      it(name, () => {
        assert.deepEqual(run(filename, data), expected);
      });
    }
  });
});
