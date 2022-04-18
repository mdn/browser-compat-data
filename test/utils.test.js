'use strict';
const assert = require('assert');
const { escapeInvisibles } = require('./utils.js');

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
      assert.strictEqual(escapeInvisibles(char), expected);
    }
  });
});
