/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {InternalSimpleSupportStatement} from '../types/index.js' */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  convertHtmlToMarkdown,
  createStatementGroupKey,
  escapeInvisibles,
  jsonDiff,
  preservesRenderedHtml,
  replaceCodeTagsWithBackticks,
  replaceLinkTagsWithMarkdown,
} from './utils.js';

describe('utils', () => {
  it('`escapeInvisibles()` works correctly', () => {
    const EXPECTED = [
      /* ␀ */ ['\0', '\\0'],
      /* ␁ */ '\x01',
      /* ␂ */ '\x02',
      /* ␃ */ '\x03',
      /* ␄ */ '\x04',
      /* ␅ */ '\x05',
      /* ␆ */ '\x06',
      /* ␇ */ '\x07',
      /* ␈ */ ['\b', '\\b'],
      /* ␉ */ ['\t', '\\t'],
      /* ␊ */ ['\n', '\\n'],
      /* ␋ */ ['\v', '\\v'],
      /* ␌ */ ['\f', '\\f'],
      /* ␍ */ ['\r', '\\r'],
      /* ␏ */ '\x0F',
      /* ␎ */ '\x0E',
      /* ␐ */ '\x10',
      /* ␑ */ '\x11',
      /* ␒ */ '\x12',
      /* ␓ */ '\x13',
      /* ␔ */ '\x14',
      /* ␕ */ '\x15',
      /* ␖ */ '\x16',
      /* ␗ */ '\x17',
      /* ␘ */ '\x18',
      /* ␙ */ '\x19',
      /* ␚ */ '\x1A',
      /* ␛ */ '\x1B',
      /* ␜ */ '\x1C',
      /* ␝ */ '\x1D',
      /* ␞ */ '\x1E',
      /* ␟ */ '\x1F',
      /* ␠ */ ' ',
      /* ␡ */ '\x7F',
    ];

    for (const data of EXPECTED) {
      let char, expected;
      if (typeof data === 'string') {
        char = data;
        expected = data;
      } else {
        [char, expected = char] = data;
      }
      assert.equal(escapeInvisibles(char), expected);
    }
  });

  it('jsonDiff() works correctly', () => {
    assert.notEqual(
      jsonDiff(
        JSON.stringify({ a: 1, b: 2 }, null, 2),
        JSON.stringify({ a: 1 }, null, 2),
      ),
      null,
    );
    assert.notEqual(
      jsonDiff(
        JSON.stringify({ a: 1 }, null, 2),
        JSON.stringify({ a: 2 }, null, 2),
      ),
      null,
    );
  });

  it('`replaceCodeTagsWithBackticks()` works correctly', () => {
    assert.equal(
      replaceCodeTagsWithBackticks('<code>transient_attachment</code> usage'),
      '`transient_attachment` usage',
    );
    assert.equal(
      replaceCodeTagsWithBackticks('<code>foo</code> and <code>bar</code>'),
      '`foo` and `bar`',
    );
    assert.equal(
      replaceCodeTagsWithBackticks('`already` markdown'),
      '`already` markdown',
    );
    assert.equal(
      replaceCodeTagsWithBackticks('Use `<code>` element'),
      'Use `<code>` element',
    );
  });

  it('`replaceLinkTagsWithMarkdown()` works correctly', () => {
    assert.equal(
      replaceLinkTagsWithMarkdown(
        "See <a href='https://bugzil.la/1'>bug 1</a>.",
      ),
      'See [bug 1](https://bugzil.la/1).',
    );
    assert.equal(
      replaceLinkTagsWithMarkdown(
        'See <a href="https://bugzil.la/1">bug 1</a>.',
      ),
      'See [bug 1](https://bugzil.la/1).',
    );
    assert.equal(
      replaceLinkTagsWithMarkdown(
        "<a href='https://bugzil.la/1'>bug 1</a> and <a href='https://bugzil.la/2'>bug 2</a>",
      ),
      '[bug 1](https://bugzil.la/1) and [bug 2](https://bugzil.la/2)',
    );
    assert.equal(
      replaceLinkTagsWithMarkdown(
        "<a href='https://example.com'>`code` text</a>",
      ),
      '[`code` text](https://example.com)',
    );
    assert.equal(
      replaceLinkTagsWithMarkdown('[already](https://example.com) markdown'),
      '[already](https://example.com) markdown',
    );
    assert.equal(
      replaceLinkTagsWithMarkdown(
        "<a href='https://example.com'><code>code</code></a>",
      ),
      "<a href='https://example.com'><code>code</code></a>",
    );
  });

  describe('`convertHtmlToMarkdown()` round-trips through `mdToHtml()`', () => {
    /**
     * Each case states the Markdown the conversion should produce, or `null`
     * when the guard must reject it because converting would change the HTML
     * the build renders.
     * @type {{name: string, input: string, expected: string | null}[]}
     */
    const cases = [
      // Conversions that appear in the data, and must keep working.
      {
        name: 'a code tag',
        input: 'The <code>webgpu</code> context.',
        expected: 'The `webgpu` context.',
      },
      {
        name: 'two code tags separated by text',
        input: '<code>foo</code> and <code>bar</code>',
        expected: '`foo` and `bar`',
      },
      {
        name: 'a single-quoted link',
        input: "See <a href='https://bugzil.la/1774135'>bug 1774135</a>.",
        expected: 'See [bug 1774135](https://bugzil.la/1774135).',
      },
      {
        name: 'a double-quoted link',
        input: 'See <a href="https://crbug.com/40630890">bug 40630890</a>.',
        expected: 'See [bug 40630890](https://crbug.com/40630890).',
      },
      {
        name: 'a code tag nested in a link',
        input:
          "See <a href='https://developer.mozilla.org/docs/Web/API/ServiceWorkerRegistration/showNotification'><code>ServiceWorkerRegistration.showNotification()</code></a>.",
        expected:
          'See [`ServiceWorkerRegistration.showNotification()`](https://developer.mozilla.org/docs/Web/API/ServiceWorkerRegistration/showNotification).',
      },
      // Markdown syntax that neither a code span nor raw HTML interprets.
      {
        name: 'brackets inside a code tag',
        input: '<code>[a]</code>',
        expected: '`[a]`',
      },
      {
        name: 'an escaped entity inside a code tag',
        input: '<code>&lt;div&gt;</code>',
        expected: '`&lt;div&gt;`',
      },
      {
        name: 'balanced parentheses in an href',
        input:
          '<a href="https://en.wikipedia.org/wiki/Foo_(bar)">Foo (bar)</a>',
        expected: '[Foo (bar)](https://en.wikipedia.org/wiki/Foo_(bar))',
      },
      {
        name: 'brackets in link text',
        input: '<a href="https://example.com">a [x] b</a>',
        expected: '[a [x] b](https://example.com)',
      },
      // Markdown inside raw HTML is interpreted before the conversion too, so
      // moving it into a Markdown link changes nothing.
      {
        name: 'emphasis markers in link text',
        input: '<a href="https://example.com">*x*</a>',
        expected: '[*x*](https://example.com)',
      },

      // Conversions the regular expressions match but cannot express in
      // Markdown. These must be rejected, not applied.
      //
      // A code span does suppress Markdown, but a raw <code> tag does not, so
      // converting emphasis markers inside one stops them being interpreted.
      // That is a fix, but it is also a change, so a human has to make it.
      {
        name: 'emphasis markers inside a code tag',
        input: '<code>_foo_</code> and <code>a*b*c</code>',
        expected: null,
      },
      {
        name: 'a backtick inside a code tag',
        input: '<code>a`b</code>',
        expected: null,
      },
      {
        name: 'an empty code tag',
        input: '<code></code>',
        expected: null,
      },
      {
        name: 'a code tag holding only a backtick',
        input: '<code>`</code>',
        expected: null,
      },
      {
        name: 'two adjacent code tags',
        input: '<code>a</code><code>b</code>',
        expected: null,
      },
      {
        name: 'a closing bracket in link text',
        input: 'See <a href="https://example.com">a]b</a>.',
        expected: null,
      },
      {
        name: 'whitespace in an href',
        input: 'See <a href="https://example.com/a b">x</a>.',
        expected: null,
      },
      // Rejected although the difference is only cosmetic: the guard compares
      // strictly, and failing to convert is the safe direction.
      {
        name: 'a raw ampersand inside a code tag',
        input: '<code>a && b</code>',
        expected: null,
      },
    ];

    for (const { name, input, expected } of cases) {
      it(`${expected === null ? 'rejects' : 'accepts'} ${name}`, () => {
        const converted = convertHtmlToMarkdown(input);
        assert.notEqual(
          converted,
          input,
          'expected the conversion to change the string',
        );
        assert.equal(
          preservesRenderedHtml(input, converted),
          expected !== null,
        );
        if (expected !== null) {
          assert.equal(converted, expected);
        }
      });
    }

    it('holds for a string that needs no conversion', () => {
      const input = 'Use `foo`, see [bug 1](https://bugzil.la/1).';
      assert.equal(convertHtmlToMarkdown(input), input);
      assert.equal(preservesRenderedHtml(input, input), true);
    });
  });

  it('createStatementGroupKey() works correctly', () => {
    /** @type {Record<string, InternalSimpleSupportStatement>} */
    const tests = {
      'normal name': {
        version_added: '1',
      },
      'alt. name: foobar': {
        version_added: '2',
        alternative_name: 'foobar',
      },
      'prefix: -moz-': {
        version_added: '3',
        prefix: '-moz-',
      },
      'preference: #service-worker-payment-apps': {
        version_added: '4',
        flags: [
          {
            type: 'preference',
            name: '#service-worker-payment-apps',
            value_to_set: 'Enabled',
          },
        ],
      },
      'alt. name: foobar / preference: #service-worker-payment-apps': {
        version_added: '4',
        alternative_name: 'foobar',
        flags: [
          {
            type: 'preference',
            name: '#service-worker-payment-apps',
            value_to_set: 'Enabled',
          },
        ],
      },
    };

    for (const [expected, input] of Object.entries(tests)) {
      assert.equal(createStatementGroupKey(input), expected);
    }
  });
});
