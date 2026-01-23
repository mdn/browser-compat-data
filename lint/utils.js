/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { platform } from 'node:os';

import chalk from 'chalk-template';

/** @import {DataType} from '../types/index.js' */
/** @import {BrowserName, SimpleSupportStatement} from '../types/types.js' */

/**
 * @typedef {object} LintOptions
 * @property {string[]} [only]
 */

/**
 * @typedef {'file' | 'feature' | 'browser' | 'tree'} LinterScope
 */

/**
 * @typedef {'error' | 'warning' | 'info'} LinterMessageLevel
 */

/**
 * @typedef {object} LinterMessage
 * @property {LinterMessageLevel} level
 * @property {string} title
 * @property {string} path
 * @property {string} message
 * @property {true} [fixable]
 * @property {string} [tip]
 * @property {*} [actual]
 * @property {*} [expected]
 */

/**
 * @typedef {object} LinterPath
 * @property {string} full
 * @property {string} category
 * @property {BrowserName} [browser]
 */

/**
 * @typedef {object} LinterData
 * @property {DataType} data
 * @property {string} rawdata
 * @property {LinterPath} path
 */

/**
 * @typedef {object} Linter
 * @property {string} name
 * @property {string} description
 * @property {LinterScope} scope
 * @property {function(Logger, object): void | Promise<void>} check
 * @property {string[]} [exceptions]
 */

/** @type {Readonly<Record<string, string>>} */
const INVISIBLES_MAP = Object.freeze(
  Object.assign(Object.create(null), {
    '\0': '\\0', // ␀ (0x00)
    '\b': '\\b', // ␈ (0x08)
    '\t': '\\t', // ␉ (0x09)
    '\n': '\\n', // ␊ (0x0A)
    '\v': '\\v', // ␋ (0x0B)
    '\f': '\\f', // ␌ (0x0C)
    '\r': '\\r', // ␍ (0x0D)
  }),
);

/* eslint-disable-next-line no-control-regex */
export const INVISIBLES_REGEXP = /[\0\x08-\x0D]/g;

/** Used to check if the process is running in a CI environment. */
export const IS_CI = process.env.CI?.toLowerCase() === 'true';

/** Determines if the OS is Windows */
export const IS_WINDOWS = platform() === 'win32';

export const VALID_ELEMENTS = ['code', 'kbd', 'em', 'strong', 'a'];

/**
 * Escapes common invisible characters.
 * @param {string} str The string to escape invisibles for
 * @returns {string} The string with invisibles escaped
 */
export const escapeInvisibles = (str) =>
  INVISIBLES_REGEXP[Symbol.replace](
    str,
    (char) => INVISIBLES_MAP[char] || char,
  );

/**
 * Gets the row and column matching the index in a string.
 * @param {string} str The string
 * @param {number} index The character index
 * @returns {[number, number] | [null, null]} The position from the index
 */
export const indexToPosRaw = (str, index) => {
  let line = 1,
    col = 1;

  if (
    typeof str !== 'string' ||
    typeof index !== 'number' ||
    index > str.length
  ) {
    return [null, null];
  }

  for (let i = 0; i < index; i++) {
    const char = str[i];
    switch (char) {
      case '\r':
        line++;
        col = 1;
        if (i + 1 < index && str[i + 1] === '\r') {
          i++;
        }
        break;
      case '\t':
        // Use JSON `tab_size` value from `.editorconfig`
        col += 2;
        break;
      default:
        col++;
        break;
    }
  }

  return [line, col];
};

/**
 * Gets the row and column matching the index in a string and formats it.
 * @param {string} str The string
 * @param {number} index The character index
 * @returns {string} The line and column in the form of: `"(Ln <ln>, Col <col>)"`
 */
export const indexToPos = (str, index) => {
  const [line, col] = indexToPosRaw(str, index);
  return `(Ln ${line}, Col ${col})`;
};

/**
 * Get the stringified difference between two JSON strings
 * @param {string} actual Actual JSON string
 * @param {string} expected Expected JSON string
 * @returns {string | null} Statement explaining the difference in provided JSON strings
 */
export const jsonDiff = (actual, expected) => {
  const actualLines = actual.split(/\n/);
  const expectedLines = expected.split(/\n/);

  if (actualLines.length !== expectedLines.length) {
    return chalk`{bold different number of lines:
    {yellow → Actual:   {bold ${actualLines.length}}}
    {green → Expected: {bold ${expectedLines.length}}}}`;
  }

  for (let i = 0; i < actualLines.length; i++) {
    if (actualLines[i] !== expectedLines[i]) {
      return chalk`{bold line #${i + 1}}:
      {yellow → Actual:   {bold ${escapeInvisibles(actualLines[i])}}}
      {green → Expected: {bold ${escapeInvisibles(expectedLines[i])}}}`;
    }
  }

  return null;
};

/**
 * Linter logger class
 */
export class Logger {
  /** @type {string} */
  title;
  /** @type {string} */
  path;
  /** @type {LinterMessage[]} */
  messages;

  /**
   * Construct the logger
   * @param {string} title Logger title
   * @param {string} path The scope path
   */
  constructor(title, path) {
    this.title = title;
    this.path = path;
    this.messages = [];
  }

  /**
   * Report an error
   * @param {string} message Message string
   * @param {object} [options] Additional options (ex. actual, expected)
   * @returns {void}
   */
  error(message, options) {
    this.messages.push({
      level: 'error',
      title: this.title,
      path: this.path,
      message,
      ...options,
    });
  }

  /**
   * Report a warning
   * @param {string} message Message string
   * @param {object} [options] Additional options (ex. actual, expected)
   * @returns {void}
   */
  warning(message, options) {
    this.messages.push({
      level: 'warning',
      title: this.title,
      path: this.path,
      message,
      ...options,
    });
  }

  /**
   * Report an info
   * @param {string} message Message string
   * @param {object} [options] Additional options (ex. actual, expected)
   * @returns {void}
   */
  info(message, options) {
    this.messages.push({
      level: 'info',
      title: this.title,
      path: this.path,
      message,
      ...options,
    });
  }
}

/**
 * Linters class
 */
export class Linters {
  /** @type {Linter[]} */
  linters;
  /** @type {Record<string, LinterMessage[]>} */
  messages;
  /**
   * Contains all seen tested objects, boolean means:
   * false - failure occurred (good)
   * true - failure did not occur (bad)
   * @type {Record<string, Record<string, boolean>>}
   */
  missingExpectedFailures;

  /**
   * Construct the linters
   * @param {Linter[]} linters All the linters
   */
  constructor(linters) {
    this.linters = linters;
    this.messages = {
      File: [],
    };
    this.missingExpectedFailures = {};

    for (const linter of this.linters) {
      this.messages[linter.name] = [];
      this.missingExpectedFailures[linter.name] = {};
    }
  }

  /**
   * Run the linters for a specific scope
   * @param {LinterScope} scope The scope to run
   * @param {LinterData} data The data to lint
   * @returns {Promise<void>}
   */
  async runScope(scope, data) {
    const linters = this.linters.filter((linter) => linter.scope === scope);
    for (const linter of linters) {
      const logger = new Logger(linter.name, data.path.full);
      try {
        const shouldFail = linter.exceptions?.includes(data.path.full);
        await linter.check(logger, data);
        if (shouldFail) {
          this.missingExpectedFailures[linter.name][data.path.full] =
            logger.messages.length === 0;
        } else {
          this.messages[linter.name].push(...logger.messages);
        }
      } catch (e) {
        this.messages[linter.name].push({
          level: 'error',
          title: linter.name,
          path: data.path.full,
          message: 'Linter failure! ' + /** @type {Error} */ (e).stack,
        });
      }
    }
  }
}

/**
 * Returns the key for the group that this statement belongs to.
 * @param {SimpleSupportStatement} support The support statement.
 * @returns {string} The key of the support statement group.
 */
export const createStatementGroupKey = (support) => {
  /** @type {string[]} */
  const parts = [];
  if (support.prefix) {
    parts.push(`prefix: ${support.prefix}`);
  }

  if (support.alternative_name) {
    parts.push(`alt. name: ${support.alternative_name}`);
  }

  if (support.flags) {
    parts.push(...support.flags.map((flag) => `${flag.type}: ${flag.name}`));
  }

  if (parts.length === 0) {
    return 'normal name';
  }

  return parts.join(' / ');
};
