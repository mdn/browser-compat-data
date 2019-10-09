'use strict';
const ora = require('ora');
const chalk = require('chalk');
const { IS_CI, escapeInvisibles } = require('./utils.js');

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
    console.assert(
      escapeInvisibles(char) === expected,
      chalk`{red Character ${escape(char)} does not get correctly escaped.}`,
    );
  }
});

/**
 * TODO: Maybe use a real test suite for this?
 *
 * @param {string} message
 * @param {() => void | Promise<void>} testCase
 */
function it(message, testCase) {
  const spinner = ora({
    stream: process.stdout,
    text: message,
  });

  if (!IS_CI) {
    // Continuous integration environments don't allow overwriting
    // previous lines using VT escape sequences, which is how
    // the spinner animation is implemented.
    spinner.start();
  }

  let result;
  let err;

  try {
    result = testCase();
  } catch (e) {
    err = e;
  }
  if (err) {
    spinner.fail(chalk.red.bold(message));
    console.error(err);
    return;
  }
  if (result && typeof result.then === 'function') {
    Promise.resolve(result).then(
      () => {
        spinner.succeed();
      },
      err => {
        spinner.fail(chalk.red.bold(message));
        console.error(err);
      },
    );
    return;
  }
  spinner.succeed();
}
