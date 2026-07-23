/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {InternalCompatStatement} from '../../types/index.js' */
/** @import {LinterMessage} from '../types.js' */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Logger } from '../utils.js';

import specURLsLinter, { processData } from './test-spec-urls.js';

/**
 * Build a fake xref lookup that reports the given URLs as valid.
 * @param {string[]} [validURLs] URLs the lookup should treat as existing
 * @returns {(url: string) => object[]} The mock xref lookup function
 */
const mockLookup =
  (validURLs = []) =>
  (url) =>
    validURLs.includes(url) ? [{ source: 'dfns', entry: {} }] : [];

/**
 * Run processData against a fresh logger and return the messages.
 * @param {Partial<InternalCompatStatement>} data The data to test
 * @param {object} [deps] Injected dependencies
 * @param {(url: string) => object[]} [deps.lookup] The mock xref lookup
 * @param {string[]} [deps.exceptions] The host exceptions
 * @returns {LinterMessage[]} The logged messages
 */
const run = (data, { lookup = mockLookup(), exceptions = [] } = {}) => {
  const logger = new Logger('Spec URLs', 'test.feature');
  processData(/** @type {InternalCompatStatement} */ (data), logger, {
    lookup,
    exceptions,
  });
  return logger.messages;
};

describe('test-spec-urls', () => {
  describe('missing spec_url', () => {
    it('does nothing when spec_url is absent', () => {
      assert.equal(run({ support: {} }).length, 0);
    });

    it('does nothing when spec_url is an empty string', () => {
      assert.equal(run({ spec_url: '', support: {} }).length, 0);
    });
  });

  describe('exceptions', () => {
    it('skips a spec_url whose host is in the exception list', () => {
      const messages = run(
        { spec_url: 'https://example.com/skip/#anything', support: {} },
        { exceptions: ['https://example.com/skip/'] },
      );
      assert.equal(messages.length, 0);
    });

    it('validates a spec_url that only partially resembles an exception', () => {
      const messages = run(
        { spec_url: 'https://example.com/other/#frag', support: {} },
        { exceptions: ['https://example.com/skip/'], lookup: mockLookup() },
      );
      assert.equal(messages.length, 1);
    });
  });

  describe('spec_url without a fragment', () => {
    it('skips validation entirely (no lookup, no error)', () => {
      const messages = run(
        { spec_url: 'https://drafts.csswg.org/css-flexbox/', support: {} },
        { lookup: mockLookup() },
      );
      assert.equal(messages.length, 0);
    });
  });

  describe('spec_url with a fragment', () => {
    it('accepts a fragment found by the xref lookup', () => {
      const url = 'https://drafts.csswg.org/css-flexbox/#flex-containers';
      const messages = run(
        { spec_url: url, support: {} },
        { lookup: mockLookup([url]) },
      );
      assert.equal(messages.length, 0);
    });

    it('flags a fragment not found by the xref lookup', () => {
      const url = 'https://drafts.csswg.org/css-flexbox/#does-not-exist';
      const messages = run(
        { spec_url: url, support: {} },
        { lookup: mockLookup() },
      );
      assert.equal(messages.length, 1);
      assert.equal(messages[0].level, 'error');
      assert.match(messages[0].message, /Invalid specification URL found/);
      assert.match(messages[0].message, /does-not-exist/);
    });
  });

  describe('text fragments', () => {
    it('validates the section ID preceding a text fragment', () => {
      const messages = run(
        {
          spec_url:
            'https://drafts.csswg.org/css-flexbox/#flex-containers:~:text=flex%20container',
          support: {},
        },
        {
          // Only the trimmed URL (without the text fragment) is "known".
          lookup: mockLookup([
            'https://drafts.csswg.org/css-flexbox/#flex-containers',
          ]),
        },
      );
      assert.equal(messages.length, 0);
    });

    it('flags an invalid section ID preceding a text fragment', () => {
      const messages = run(
        {
          spec_url: 'https://drafts.csswg.org/css-flexbox/#bogus:~:text=foo',
          support: {},
        },
        { lookup: mockLookup() },
      );
      assert.equal(messages.length, 1);
      // The reported URL is trimmed of the text fragment.
      assert.match(messages[0].message, /css-flexbox\/#bogus\b(?!:~:text=)/);
    });

    it('skips a text fragment without a section ID', () => {
      const messages = run(
        {
          spec_url: 'https://drafts.csswg.org/css-flexbox/#:~:text=foo',
          support: {},
        },
        { lookup: mockLookup() },
      );
      assert.equal(messages.length, 0);
    });
  });

  describe('check (default dependencies)', () => {
    it('uses the real xref lookup and exceptions without erroring on a fragment-less URL', () => {
      const logger = new Logger('Spec URLs', 'test.feature');
      // Fragment-less URLs are skipped, so this exercises the default wiring
      // (real xref.lookup + real exceptions) without depending on volatile
      // fragment data.
      void specURLsLinter.check(logger, {
        data: /** @type {InternalCompatStatement} */ ({
          spec_url: 'https://drafts.csswg.org/css-flexbox/',
          support: {},
        }),
        path: { full: 'css.properties.flex', category: 'css' },
      });
      assert.equal(logger.messages.length, 0);
    });
  });

  describe('multiple spec URLs', () => {
    it('accepts an array where every URL is valid', () => {
      const a = 'https://drafts.csswg.org/css-flexbox/#flex-containers';
      const b = 'https://drafts.csswg.org/css-grid/#grid-containers';
      const messages = run(
        { spec_url: [a, b], support: {} },
        { lookup: mockLookup([a, b]) },
      );
      assert.equal(messages.length, 0);
    });

    it('flags only the invalid URL within an array', () => {
      const good = 'https://drafts.csswg.org/css-flexbox/#flex-containers';
      const bad = 'https://drafts.csswg.org/css-grid/#nope';
      const messages = run(
        { spec_url: [good, bad], support: {} },
        { lookup: mockLookup([good]) },
      );
      assert.equal(messages.length, 1);
      assert.match(messages[0].message, /#nope/);
    });
  });
});
