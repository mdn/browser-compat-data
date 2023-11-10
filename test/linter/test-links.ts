/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import {
  Linter,
  Logger,
  LinterData,
  IS_WINDOWS,
  indexToPos,
  indexToPosRaw,
} from '../utils.js';

type LinkError = {
  issue: string;
  pos: [number, number] | [null, null];
  posString: string;
  actual: string;
  expected?: string;
};

/**
 * Given a RegEx expression, test the link for errors
 * @param {LinkError[]} errors The errors object to push the new errors to
 * @param {string} actual The link to test
 * @param {string|RegExp} regexp The regex to test with
 * @param {(match: Array.<?string>) => object?} matchHandler The callback
 */
const processLink = (
  errors: LinkError[],
  actual: string,
  regexp: string | RegExp,
  matchHandler: (match: RegExpMatchArray) => {
    issue: string;
    expected?: string;
    actualLink?: string;
  } | null,
): void => {
  const re = new RegExp(regexp, 'g');
  /** @type {RegExpExecArray} */
  let match;
  while ((match = re.exec(actual)) !== null) {
    const pos = indexToPosRaw(actual, match.index);
    const posString = indexToPos(actual, match.index);
    const result = matchHandler(match);

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

/**
 * Process the data for any errors within the links
 * @param {string} rawData The raw contents of the file to test
 * @returns {LinkError[]} A list of errors found in the links
 */
export const processData = (rawData: string): LinkError[] => {
  const errors: LinkError[] = [];

  let actual = rawData;

  // prevent false positives from git.core.autocrlf on Windows
  if (IS_WINDOWS) {
    actual = actual.replace(/\r/g, '');
  }

  processLink(
    // use https://bugzil.la/1000000 instead
    errors,
    actual,
    String.raw`https?://bugzilla\.mozilla\.org/show_bug\.cgi\?id=(\d+)`,
    (match) => ({
      issue: 'Use shortenable URL',
      expected: `https://bugzil.la/${match[1]}`,
    }),
  );

  processLink(
    // use https://crbug.com/100000 instead
    errors,
    actual,
    String.raw`https?://(bugs\.chromium\.org|code\.google\.com)/p/chromium/issues/detail\?id=(\d+)`,
    (match) => ({
      issue: 'Use shortenable URL',
      expected: `https://crbug.com/${match[2]}`,
    }),
  );

  processLink(
    // use https://crbug.com/category/100000 instead
    errors,
    actual,
    String.raw`https?://(bugs\.chromium\.org|code\.google\.com)/p/((?!chromium)\w+)/issues/detail\?id=(\d+)`,
    (match) => ({
      issue: 'Use shortenable URL',
      expected: `https://crbug.com/${match[2]}/${match[3]}`,
    }),
  );

  processLink(
    // use https://crbug.com/category/100000 instead
    errors,
    actual,
    String.raw`https?://chromium\.googlesource\.com/chromium/src/\+/([\w\d]+)`,
    (match) => ({
      issue: 'Use shortenable URL',
      expected: `https://crrev.com/${match[1]}`,
    }),
  );

  processLink(
    // use https://webkit.org/b/100000 instead
    errors,
    actual,
    String.raw`https?://bugs\.webkit\.org/show_bug\.cgi\?id=(\d+)`,
    (match) => ({
      issue: 'Use shortenable URL',
      expected: `https://webkit.org/b/${match[1]}`,
    }),
  );

  processLink(
    // Bug links should use HTTPS and have "bug ###" as link text ("Bug ###" only at the begin of notes/sentences).
    errors,
    actual,
    String.raw`(....)<a href='((https?)://(bugzil\.la|crbug\.com|webkit\.org/b)/(\d+))'>(.*?)</a>`,
    (match) => {
      const [, before, url, protocol, domain, bugId, linkText] = match;

      if (protocol !== 'https') {
        return {
          issue: 'Use HTTPS for bug links',
          expected: `https://${domain}/${bugId}`,
          actualLink: url,
        };
      }

      if (domain == 'bugzil.la') {
        if (/^bug $/.test(before)) {
          return {
            issue: 'Move word "bug" into link text',
            expected: `<a href='...'>${before}${bugId}</a>`,
            actualLink: `${before}<a href='...'>${linkText}</a>`,
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
      }

      return null;
    },
  );

  processLink(
    errors,
    actual,
    String.raw`\b(https?)://((?:[a-z][a-z0-9-]*\.)*)developer.mozilla.org/(.*?)(?=["'\s])`,
    (match) => {
      const [, protocol, subdomain, path] = match;
      const pathMatch = /^(?:(\w\w(?:-\w\w)?)\/)?(.*)$/.exec(path);

      if (!pathMatch) {
        return null;
      }

      const locale = pathMatch[1];
      let expectedPath = pathMatch[2];

      if (!expectedPath.startsWith('docs/')) {
        // Convert legacy zone URLs (see https://bugzil.la/1462475):
        const [zone, index] = ((): [string | null, number | undefined] => {
          const match = expectedPath.match(
            /\b(Add-ons|Apps|Archive|Firefox|Learn|Web)\b/,
          );
          return match ? [match[1], match.index] : [null, -1];
        })();
        if (index && index >= 0) {
          expectedPath = expectedPath.substring(index);
          switch (zone) {
            case 'Add-ons':
            case 'Firefox':
              expectedPath = 'Mozilla/' + expectedPath;
              break;
            case 'Apps':
              expectedPath = 'Web/' + expectedPath;
              break;
          }
        }
        expectedPath = 'docs/' + expectedPath;
      }

      if (protocol !== 'https') {
        return {
          issue: 'Use HTTPS MDN URL',
          expected: `https://developer.mozilla.org/${expectedPath}`,
        };
      }

      if (subdomain) {
        return {
          issue: 'Use correct MDN domain',
          expected: `https://developer.mozilla.org/${expectedPath}`,
        };
      }

      if (path !== expectedPath) {
        return {
          issue: `Use ${locale ? 'non-localized' : 'correct'} MDN URL`,
          expected: `https://developer.mozilla.org/${expectedPath}`,
        };
      }

      return null;
    },
  );

  processLink(
    errors,
    actual,
    String.raw`https?://developer.microsoft.com/(\w\w-\w\w)/(.*?)(?=["'\s])`,
    (match) => ({
      issue: 'Use non-localized Microsoft Developer URL',
      expected: `https://developer.microsoft.com/${match[2]}`,
    }),
  );

  processLink(
    errors,
    actual,
    String.raw`<a href='([^'>]+)'>((?:.(?!</a>))*.)</a>`,
    (match) => {
      if (new URL(match[1]).hostname === null) {
        return {
          issue: 'Include hostname in URL',
          actualLink: match[1],
          expected: `https://developer.mozilla.org/${match[1]}`,
        };
      }

      return null;
    },
  );

  return errors;
};

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
  check: (logger: Logger, { rawdata }: LinterData) => {
    const errors = processData(rawdata);

    for (const error of errors) {
      logger.error(
        chalk`${error.posString} – ${error.issue} ({yellow ${error.actual}} → {green ${error.expected}}).`,
        { fixable: true },
      );
    }
  },
} as Linter;
