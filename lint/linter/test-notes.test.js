/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {CompatStatement} from '../../types/types.js' */
/** @import {LinterMessage} from '../types.js' */

import assert from 'node:assert/strict';

import { Logger } from '../utils.js';

import testNotes from './test-notes.js';

/**
 * Run the notes linter check and return logged messages.
 * @param {CompatStatement} data
 * @returns {Promise<LinterMessage[]>}
 */
const check = async (data) => {
  const logger = new Logger('Notes', 'test.feature');
  await testNotes.check(logger, {
    data,
    path: { full: 'test.feature', category: 'api' },
  });
  return logger.messages;
};

describe('test-notes', () => {
  describe('code tag in notes', () => {
    it('flags a note with a <code> tag', async () => {
      /** @type {CompatStatement} */
      const data = {
        support: {
          chrome: {
            version_added: '80',
            notes: 'Before version 90, <code>foo</code> was required.',
          },
        },
      };
      const messages = await check(data);
      assert.ok(messages.some((m) => m.fixable));
    });

    it('flags each note in an array with a <code> tag', async () => {
      /** @type {CompatStatement} */
      const data = {
        support: {
          chrome: {
            version_added: '80',
            notes: [
              'Before version 90, <code>foo</code> was required.',
              'Use `bar` instead.',
            ],
          },
        },
      };
      const messages = await check(data);
      assert.equal(messages.filter((m) => m.fixable).length, 1);
    });

    it('does not flag a note using backtick Markdown', async () => {
      /** @type {CompatStatement} */
      const data = {
        support: {
          chrome: {
            version_added: '80',
            notes: 'Before version 90, `foo` was required.',
          },
        },
      };
      const messages = await check(data);
      assert.ok(!messages.some((m) => m.fixable));
    });

    it('does not flag a <code> tag inside backticks', async () => {
      /** @type {CompatStatement} */
      const data = {
        support: {
          chrome: {
            version_added: '80',
            notes: 'The `<code>` element is not supported.',
          },
        },
      };
      const messages = await check(data);
      assert.ok(!messages.some((m) => m.fixable));
    });
  });
});
