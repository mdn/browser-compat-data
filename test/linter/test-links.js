/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const fs = require('fs');
const chalk = require('chalk');
const { IS_WINDOWS, indexToPos, indexToPosRaw } = require('../utils.js');

// {issue: string, pos: [?number, ?number], posString: string, expected: string, actualLink: string}

/**
 * @typedef {object} LinkError
 * @property {string} issue The description of the error
 * @property {Array.<?number>} pos The cursor position of the issue in number-array form
 * @property {string} posString The cursor position of the issue in string form
 * @property {?string} expected The expected string if applicable
 * @property {string} actualLink What the link currently is
 */

/**
 * Process the data for any errors within the links
 *
 * @param {string} filename The file to test
 * @returns {LinkError[]} A list of errors found in the links
 */
const processData = filename => {
  let errors = [];

  let actual = fs.readFileSync(filename, 'utf-8').trim();

  // prevent false positives from git.core.autocrlf on Windows
  if (IS_WINDOWS) {
    actual = actual.replace(/\r/g, '');
  }

  processLink(
    // use https://bugzil.la/1000000 instead
    errors,
    actual,
    String.raw`https?://bugzilla\.mozilla\.org/show_bug\.cgi\?id=(\d+)`,
    match => {
      return {
        issue: 'Use shortenable URL',
        expected: `https://bugzil.la/${match[1]}`,
      };
    },
  );

  processLink(
    // use https://crbug.com/100000 instead
    errors,
    actual,
    String.raw`https?://(bugs\.chromium\.org|code\.google\.com)/p/chromium/issues/detail\?id=(\d+)`,
    match => {
      return {
        issue: 'Use shortenable URL',
        expected: `https://crbug.com/${match[2]}`,
      };
    },
  );

  processLink(
    // use https://webkit.org/b/100000 instead
    errors,
    actual,
    String.raw`https?://bugs\.webkit\.org/show_bug\.cgi\?id=(\d+)`,
    match => {
      return {
        issue: 'Use shortenable URL',
        expected: `https://webkit.org/b/${match[1]}`,
      };
    },
  );

  processLink(
    // Bug links should use HTTPS and have "bug ###" as link text ("Bug ###" only at the begin of notes/sentences).
    errors,
    actual,
    String.raw`(....)<a href='((https?)://(bugzil\.la|crbug\.com|webkit\.org/b)/(\d+))'>(.*?)</a>`,
    match => {
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
    },
  );

  processLink(
    errors,
    actual,
    String.raw`\b(https?)://((?:[a-z][a-z0-9-]*\.)*)developer.mozilla.org/(.*?)(?=["'\s])`,
    match => {
      const [, protocol, subdomain, path] = match;
      const [, locale, expectedPath_] = /^(?:(\w\w(?:-\w\w)?)\/)?(.*)$/.exec(
        path,
      );
      let expectedPath = expectedPath_;

      if (!expectedPath.startsWith('docs/')) {
        // Convert legacy zone URLs (see https://bugzil.la/1462475):
        const [zone, index] = /** @returns {[string|null, number]} */ (() => {
          const match = expectedPath.match(
            /\b(Add-ons|Apps|Archive|Firefox|Learn|Web)\b/,
          );
          return match ? [match[1], match.index] : [null, -1];
        })();
        if (index >= 0) {
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
    },
  );

  processLink(
    errors,
    actual,
    String.raw`https?://developer.microsoft.com/(\w\w-\w\w)/(.*?)(?=["'\s])`,
    match => {
      return {
        issue: 'Use non-localized Microsoft Developer URL',
        expected: `https://developer.microsoft.com/${match[2]}`,
      };
    },
  );

  return errors;
};

/**
 * Given a RegEx expression, test the link for errors
 *
 * @param {LinkError[]} errors The errors object to push the new errors to
 * @param {string} actual The link to test
 * @param {string|RegExp} regexp The regex to test with
 * @param {(match: Array.<?string>) => object} matchHandler The callback
 * @returns {void}
 */
const processLink = (errors, actual, regexp, matchHandler) => {
  const re = new RegExp(regexp, 'g');
  /** @type {Array.<?string>} */
  let match;
  while ((match = re.exec(actual)) !== null) {
    let pos = indexToPosRaw(actual, match.index);
    let posString = indexToPos(actual, match.index);
    let result = matchHandler(match);

    if (result) {
      let { issue, expected, actualLink = match[0] } = result;
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
 * Test for any malformed links
 *
 * @param {string} filename The file to test
 * @returns {boolean} If the file contains errors
 */
const testLinks = filename => {
  /** @type {object[]} */
  let errors = processData(filename);

  if (errors.length) {
    console.error(
      chalk`{red   Links – {bold ${errors.length}} ${
        errors.length === 1 ? 'error' : 'errors'
      }:}`,
    );
    for (const error of errors) {
      console.error(
        chalk`  {red → ${error.posString} – ${error.issue} ({yellow ${error.actual}} → {green ${error.expected}}).}`,
      );
    }
    return true;
  }
  return false;
};

module.exports = testLinks;
