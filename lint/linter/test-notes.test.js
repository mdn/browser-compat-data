/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {InternalCompatStatement} from '../../types/index.js' */
/** @import {LinterMessage} from '../types.js' */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Logger } from '../utils.js';

import testNotes from './test-notes.js';

/**
 * Run the notes linter check and return logged messages.
 * @param {InternalCompatStatement} data The compat statement to check.
 * @returns {Promise<LinterMessage[]>} The messages logged by the check.
 */
const check = async (data) => {
  const logger = new Logger('Notes', 'test.feature');
  await testNotes.check(logger, {
    data,
    path: { full: 'test.feature', category: 'api' },
  });
  return logger.messages;
};

/**
 * Build a compat statement with the given note(s) on a support statement.
 * @param {string | string[]} notes The note(s) to attach to the statement.
 * @returns {InternalCompatStatement} A compat statement carrying the note(s).
 */
const withNotes = (notes) => ({
  support: {
    chrome: {
      version_added: '80',
      notes: /** @type {string | [string, string, ...string[]]} */ (notes),
    },
  },
});

describe('test-notes', () => {
  /** @type {{group: string, cases: {name: string, notes: string | string[], expectedFixable: number}[]}[]} */
  const groups = [
    {
      group: 'code tag in notes',
      cases: [
        {
          name: 'flags a note with a <code> tag',
          notes: 'Before version 90, <code>foo</code> was required.',
          expectedFixable: 1,
        },
        {
          name: 'flags each note in an array with a <code> tag',
          notes: [
            'Before version 90, <code>foo</code> was required.',
            'Use `bar` instead.',
          ],
          expectedFixable: 1,
        },
        {
          name: 'does not flag a note using backtick Markdown',
          notes: 'Before version 90, `foo` was required.',
          expectedFixable: 0,
        },
        {
          name: 'does not flag a <code> tag inside backticks',
          notes: 'The `<code>` element is not supported.',
          expectedFixable: 0,
        },
      ],
    },
    {
      group: 'link tag in notes',
      cases: [
        {
          name: 'flags a note with an <a> tag',
          notes: "See <a href='https://bugzil.la/1'>bug 1</a>.",
          expectedFixable: 1,
        },
        {
          name: 'does not flag a note using a Markdown link',
          notes: 'See [bug 1](https://bugzil.la/1).',
          expectedFixable: 0,
        },
      ],
    },
  ];

  for (const { group, cases } of groups) {
    describe(group, () => {
      for (const { name, notes, expectedFixable } of cases) {
        it(name, async () => {
          const messages = await check(withNotes(notes));
          assert.equal(
            messages.filter((m) => m.fixable).length,
            expectedFixable,
          );
        });
      }
    });
  }
});
