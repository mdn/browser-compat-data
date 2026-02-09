/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { styleText } from 'node:util';

import { IS_WINDOWS, indexToPos, indexToPosRaw } from '../utils.js';

/** @import {Linter, LinterData} from '../types.js' */
/** @import {Logger} from '../utils.js' */

/**
 * @typedef {object} LinkError
 * @property {string} issue
 * @property {[number, number] | [null, null]} pos
 * @property {string} posString
 * @property {string} actual
 * @property {string} [expected]
 */

/**
 * Given a RegEx expression, test the link for errors
 * @param {LinkError[]} errors The errors object to push the new errors to
 * @param {string} actual The link to test
 * @param {string | RegExp} regexp The regex to test with
 * @param {(match: RegExpMatchArray) => Promise<{ issue: string; expected?: string; actualLink?: string; } | null>} matchHandler The callback
 * @returns {Promise<void>}
 */
const processLink = async (errors, actual, regexp, matchHandler) => {
  const re = new RegExp(regexp, 'g');
  let match;
  while ((match = re.exec(actual)) !== null) {
    const pos = indexToPosRaw(actual, match.index);
    const posString = indexToPos(actual, match.index);
    const result = await matchHandler(match);

    if (result) {
      const { issue, expected, actualLink = match[0] } = result;
      errors.push({
        issue: issue,
        pos: pos,
        posString: posString,
        actual: actualLink,
        expected: expected,
      });
    }
  }
};

/** @type {Map<string, string>} */
const CRBUG_CACHE = new Map();

/**
 * Resolves legacy Chrome bugs from the Monorail era.
 * @param {string} oldId the old bug id.
 * @returns {Promise<string>} the new bug id.
 */
const resolveCrbug = async (oldId) => {
  if (oldId.length >= 8) {
    // This isn't an old id.
    return oldId;
  }

  let newId = CRBUG_CACHE.get(oldId);
  if (newId) {
    return newId;
  }

  const res = await fetch(`https://crbug.com/${oldId}`);
  const text = await res.text();
  const match = text.match(/https:\/\/issues.chromium.org\/(\d{8,})/);

  newId = match ? match[1] : oldId;

  CRBUG_CACHE.set(oldId, newId);

  return newId;
};

/**
 * Process the data for any errors within the links
 * @param {string} rawData The raw contents of the file to test
 * @returns {Promise<LinkError[]>} A list of errors found in the links
 */
export const processData = async (rawData) => {
  /** @type {LinkError[]} */
  const errors = [];

  let actual = rawData;

  // prevent false positives from git.core.autocrlf on Windows
  /* c8 ignore start */
  if (IS_WINDOWS) {
    actual = actual.replace(/\r/g, '');
  }
  /* c8 ignore stop */

  await processLink(
    // use https://bugzil.la/1000000 instead
    errors,
    actual,
    /https?:\/\/bugzilla\.mozilla\.org\/show_bug\.cgi\?id=(\d+)/g,
    async (match) => ({
      issue: 'Use shortenable URL',
      expected: `https://bugzil.la/${match[1]}`,
    }),
  );

  await processLink(
    // use https://crbug.com/100000 instead
    errors,
    actual,
    /https?:\/\/(issues\.chromium\.org)\/issues\/(\d+)/g,
    async (match) => ({
      issue: 'Use shortenable URL',
      expected: `https://crbug.com/${match[2]}`,
    }),
  );

  await processLink(
    // use https://crbug.com/100000 instead
    errors,
    actual,
    /https?:\/\/(bugs\.chromium\.org|code\.google\.com)\/p\/chromium\/issues\/detail\?id=(\d+)/g,
    async (match) => ({
      issue: 'Use shortenable URL',
      expected: `https://crbug.com/${match[2]}`,
    }),
  );

  await processLink(
    // use https://crbug.com/category/100000 instead
    errors,
    actual,
    /https?:\/\/(bugs\.chromium\.org|code\.google\.com)\/p\/((?!chromium)\w+)\/issues\/detail\?id=(\d+)/g,
    async (match) => ({
      issue: 'Use shortenable URL',
      expected: `https://crbug.com/${match[2]}/${match[3]}`,
    }),
  );

  await processLink(
    // use https://crbug.com/category/100000 instead
    errors,
    actual,
    /https?:\/\/chromium\.googlesource\.com\/chromium\/src\/\+\/([\w\d]+)/g,
    async (match) => ({
      issue: 'Use shortenable URL',
      expected: `https://crrev.com/${match[1]}`,
    }),
  );

  await processLink(
    // use https://crbug.com/400000000 instead
    errors,
    actual,
    /https?:\/\/crbug.com\/(\d{1,7})(?!\d)(?:#c(\d+))?/g,
    async (match) => ({
      issue: 'Use new Google Issue ID',
      expected: `https://crbug.com/${await resolveCrbug(match[1])}${match[2] ? `#comment${Number(match[2]) + 1}` : ''}`,
    }),
  );

  await processLink(
    // use https://webkit.org/b/100000 instead
    errors,
    actual,
    /https?:\/\/bugs\.webkit\.org\/show_bug\.cgi\?id=(\d+)/g,
    async (match) => ({
      issue: 'Use shortenable URL',
      expected: `https://webkit.org/b/${match[1]}`,
    }),
  );

  await processLink(
    // Bug links should use HTTPS and have "bug ###" as link text ("Bug ###" only at the beginning of notes/sentences).
    errors,
    actual,
    /(\w*\s?)\[([^[\]]*)\]\(((https?):\/\/(bugzil\.la|crbug\.com|webkit\.org\/b)\/(\d+))\)/g,
    async (match) => {
      const [, before, linkText, url, protocol, domain, bugId] = match;

      if (protocol !== 'https') {
        return {
          issue: 'Use HTTPS for bug links',
          expected: `https://${domain}/${bugId}`,
          actualLink: url,
        };
      }

      if (/^bug $/.test(before)) {
        return {
          issue: 'Move word "bug" into link text',
          expected: `[${before}${bugId}](${url})`,
          actualLink: `${before}[${linkText}](${url})`,
        };
      } else if (linkText === `Bug ${bugId}`) {
        if (!/(\. |")$/.test(before)) {
          return {
            issue: 'Use lowercase "bug" word within sentence',
            expected: `bug ${bugId}`,
            actualLink: `Bug ${bugId}`,
          };
        }
      } else if (linkText !== `bug ${bugId}`) {
        return {
          issue: 'Use standard link text',
          expected: `bug ${bugId}`,
          actualLink: linkText,
        };
      }

      return null;
    },
  );

  await processLink(
    errors,
    actual,
    /(https?):\/\/((?:[a-z][a-z0-9-]*\.)*)?developer.mozilla.org\/(.*?)(?=["'\s])/g,
    async (match) => {
      const [, protocol, subdomain, path] = match;

      if (protocol !== 'https') {
        return {
          issue: 'Use HTTPS MDN URL',
          expected: `https://developer.mozilla.org/${path}`,
        };
      }

      if (subdomain) {
        return {
          issue: 'Use correct MDN domain',
          expected: `https://developer.mozilla.org/${path}`,
        };
      }

      if (!path.startsWith('docs/')) {
        const pathMatch = /^(?:(\w\w(?:-\w\w)?)\/)?(.*)$/.exec(path);

        if (pathMatch) {
          return {
            issue: 'Use non-localized MDN URL',
            expected: `https://developer.mozilla.org/${pathMatch[2]}`,
          };
        }

        return {
          issue: 'MDN URL is invalid',
        };
      }

      return null;
    },
  );

  await processLink(
    errors,
    actual,
    /https?:\/\/developer.microsoft.com\/(\w\w-\w\w)\/(.*?)(?=["'\s])/g,
    async (match) => ({
      issue: 'Use non-localized Microsoft Developer URL',
      expected: `https://developer.microsoft.com/${match[2]}`,
    }),
  );

  await processLink(
    errors,
    actual,
    /\[((?:.(?<!\]))*.)\]\(([^)]+)\)/g,
    async (match) => {
      if (new URL(match[2]).hostname === null) {
        return {
          issue: 'Include hostname in URL',
          actualLink: match[2],
          expected: `https://developer.mozilla.org/${match[2]}`,
        };
      }

      return null;
    },
  );

  return errors;
};

/** @type {Linter} */
export default {
  name: 'Links',
  description:
    'Test links in the file to ensure they conform to BCD guidelines',
  scope: 'file',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: async (logger, { rawdata = '' }) => {
    const errors = await processData(rawdata);

    for (const error of errors) {
      logger.error(
        `${error.posString} – ${error.issue} (${styleText('yellow', error.actual)} → ${styleText('green', error.expected ?? '')}).`,
        { fixable: true },
      );
    }
  },
};
