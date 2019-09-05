'use strict';
const fs = require('fs');
const url = require('url');
const chalk = require('chalk');
const { IS_WINDOWS, indexToPos, jsonDiff } = require('../utils.js');
const compareFeatures = require('../../scripts/compare-features');

/**
 * Return a new "support_block" object whose first-level properties
 * (browser names) have been ordered according to Array.prototype.sort,
 * and so will be stringified in that order as well. This relies on
 * guaranteed "own" property ordering, which is insertion order for
 * non-integer keys (which is our case).
 *
 * @param {string} key The key in the object
 * @param {*} value The value of the key
 *
 * @returns {*} The new value
 */
function orderSupportBlock(key, value) {
  if (key === '__compat') {
    value.support = Object.keys(value.support).sort().reduce((result, key) => {
      result[key] = value.support[key];
      return result;
    }, {});
  }
  return value;
}

/**
 * Return a new feature object whose first-level properties have been
 * ordered according to Array.prototype.sort, and so will be
 * stringified in that order as well. This relies on guaranteed "own"
 * property ordering, which is insertion order for non-integer keys
 * (which is our case).
 *
 * @param {string} key The key in the object
 * @param {*} value The value of the key
 *
 * @returns {*} The new value
 */
function orderFeatures(key, value) {
  if (value instanceof Object && '__compat' in value) {
    value = Object.keys(value).sort(compareFeatures).reduce((result, key) => {
      result[key] = value[key];
      return result;
    }, {});
  }
  return value;
}

/**
 * @param {string} filename
 * @param {import('../utils').Logger} logger
 */
function processData(filename, logger) {
  let hasErrors = false;

  let actual = fs.readFileSync(filename, 'utf-8').trim();
  /** @type {import('../../types').CompatData} */
  let dataObject = JSON.parse(actual);
  let expected = JSON.stringify(dataObject, null, 2);
  let expectedBrowserSorting = JSON.stringify(dataObject, orderSupportBlock, 2);
  let expectedFeatureSorting = JSON.stringify(JSON.parse(actual), orderFeatures, 2);

  // prevent false positives from git.core.autocrlf on Windows
  if (IS_WINDOWS) {
    actual = actual.replace(/\r/g, '');
    expected = expected.replace(/\r/g, '');
    expectedBrowserSorting = expectedBrowserSorting.replace(/\r/g, '');
    expectedFeatureSorting = expectedFeatureSorting.replace(/\r/g, '');
  }

  if (actual !== expected) {
    hasErrors = true;
    logger.error(chalk`{red Error on {bold line ${jsonDiff(actual, expected)}}}`);
  }

  if (expected !== expectedBrowserSorting) {
    hasErrors = true;
    logger.error(chalk`{red Browser sorting error on {bold line ${jsonDiff(expected, expectedBrowserSorting)}}}\n{blue     Tip: Run {bold npm run fix} to fix sorting automatically}`);
  }

  if (actual !== expectedFeatureSorting) {
    hasErrors = true;
    logger.error(chalk`{red Feature sorting error on {bold line ${jsonDiff(expected, expectedFeatureSorting)}}}\n{blue     Tip: Run {bold npm run fix} to fix sorting automatically}`);
  }

  const bugzillaMatch = actual.match(String.raw`https?://bugzilla\.mozilla\.org/show_bug\.cgi\?id=(\d+)`);
  if (bugzillaMatch) {
    // use https://bugzil.la/1000000 instead
    hasErrors = true;
    logger.error(chalk`{red ${indexToPos(actual, bugzillaMatch.index)} – Use shortenable URL ({yellow ${bugzillaMatch[0]} → {green {bold https://bugzil.la/}${bugzillaMatch[1]}}).}`);
  }

  {
    // Bugzil.la links should use HTTPS and have "bug ###" as link text ("Bug ###" only at the begin of notes/sentences).
    const regexp = new RegExp(String.raw`(....)<a href='(https?)://(bugzil\.la|crbug\.com|webkit\.org/b)/(\d+)'>(.*?)</a>`, 'g');
    /** @type {RegExpExecArray} */
    let match;
    do {
      match = regexp.exec(actual);
      if (match) {
        const [,
          before,
          protocol,
          domain,
          bugId,
          linkText,
        ] = match;

        if (protocol !== 'https') {
          hasErrors = true;
          logger.error(chalk`{red ${indexToPos(actual, match.index)} – Use HTTPS URL ({yellow http://${domain}/${bugId}} → {green http{bold s}://${domain}/${bugId}}).}`);
        }

        if (domain !== 'bugzil.la') {
          continue;
        }

        if (/^bug $/.test(before)) {
          hasErrors = true;
          logger.error(chalk`{red ${indexToPos(actual, match.index)} – Move word "bug" into link text ({yellow "${before}<a href='...'>${linkText}</a>"} → {green "<a href='...'>{bold ${before}}${bugId}</a>"}).}`);
        } else if (linkText === `Bug ${bugId}`) {
          if (!/(\. |")$/.test(before)) {
            hasErrors = true;
            logger.error(chalk`{red ${indexToPos(actual, match.index)} – Use lowercase "bug" word within sentence ({yellow "Bug ${bugId}"} → {green "{bold bug} ${bugId}"}).}`);
          }
        } else if (linkText !== `bug ${bugId}`) {
          hasErrors = true;
          logger.error(chalk`{red ${indexToPos(actual, match.index)} – Use standard link text ({yellow "${linkText}"} → {green "bug ${bugId}"}).}`);
        }
      }
    } while (match != null);
  }

  const crbugMatch = actual.match(String.raw`https?://bugs\.chromium\.org/p/chromium/issues/detail\?id=(\d+)`);
  if (crbugMatch) {
    // use https://crbug.com/100000 instead
    hasErrors = true;
    logger.error(chalk`{red ${indexToPos(actual, crbugMatch.index)} – Use shortenable URL ({yellow ${crbugMatch[0]}} → {green {bold https://crbug.com/}${crbugMatch[1]}}).}`);
  }

  const webkitMatch = actual.match(String.raw`https?://bugs\.webkit\.org/show_bug\.cgi\?id=(\d+)`);
  if (webkitMatch) {
    // use https://webkit.org/b/100000 instead
    hasErrors = true;
    logger.error(chalk`{red ${indexToPos(actual, webkitMatch.index)} – Use shortenable URL ({yellow ${webkitMatch[0]}} → {green {bold https://webkit.org/b/}${webkitMatch[1]}}).}`);
  }

  {
    const regexp = new RegExp(
      String.raw`\b(https?)://((?:[a-z][a-z0-9-]*\.)*)developer.mozilla.org/(.*?)(?=["'\s])`,
      'g',
    );
    /** @type {RegExpExecArray} */
    let match;
    while ((match = regexp.exec(actual)) !== null) {
      const [url, protocol, subdomain, path] = match;
      let [, locale, expectedPath] = /^(?:(\w\w(?:-\w\w)?)\/)?(.*)$/.exec(path);

      if (!expectedPath.startsWith('docs/')) {
        // Convert legacy zone URLs (see https://bugzil.la/1462475):
        const [zone, index] = (/** @return {[string|null, number]} */() => {
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
      const pos = indexToPos(match.input, match.index);

      if (protocol !== 'https') {
        hasErrors = true;
        logger.error(
          chalk`{red ${pos} – Use HTTPS MDN URL ({yellow ${protocol}://developer.mozilla.org/${path}} → {green https://developer.mozilla.org/${expectedPath}}).}`,
        );
      }

      if (subdomain) {
        hasErrors = true;
        logger.error(
          chalk`{red ${pos} - Use correct MDN domain ({yellow ${protocol}://{red ${subdomain}}developer.mozilla.org/${path}} → {green https://developer.mozilla.org/${expectedPath}})}`,
        );
      }

      if (path !== expectedPath) {
        hasErrors = true;
        logger.error(
          chalk`{red ${pos} – Use ${
            locale ? 'non-localized' : 'correct'
          } MDN URL ({yellow ${url}} → {green https://developer.mozilla.org/${expectedPath}}).}`,
        );
      }
    }
  }

  const msdevUrlMatch = actual.match(String.raw`https?://developer.microsoft.com/(\w\w-\w\w)/(.*?)(?=["'\s])`);
  if (msdevUrlMatch) {
    hasErrors = true;
    logger.error(chalk`{red ${indexToPos(actual, msdevUrlMatch.index)} – Use non-localized Microsoft Developer URL ({yellow ${msdevUrlMatch[0]}} → {green https://developer.microsoft.com/${msdevUrlMatch[2]}}).}`);
  }

  let constructorMatch = actual.match(String.raw`"<code>([^)]*?)</code> constructor"`)
  if (constructorMatch) {
    hasErrors = true;
    logger.error(chalk`{red ${indexToPos(actual, constructorMatch.index)} – Use parentheses in constructor description ({yellow ${constructorMatch[1]}} → {green ${constructorMatch[1]}{bold ()}}).}`);
  }

  let hrefDoubleQuoteIndex = actual.indexOf('href=\\"');
  if (hrefDoubleQuoteIndex >= 0) {
    hasErrors = true;
    logger.error(chalk`{red ${indexToPos(actual, hrefDoubleQuoteIndex)} - Found {yellow \\"}, but expected {green \'} for <a href>.}`);
  }

  const regexp = new RegExp(String.raw`<a href='([^'>]+)'>((?:.(?!</a>))*.)</a>`, 'g');
  let match = regexp.exec(actual);
  if (match) {
    var a_url = url.parse(match[1]);
    if (a_url.hostname === null) {
      hasErrors = true;
      logger.error(chalk`{red ${indexToPos(actual, constructorMatch.index)} - Include hostname in URL ({yellow ${match[1]}} → {green {bold https://developer.mozilla.org/}${match[1]}}).}`);
    }
  }

  return hasErrors;
}

function testStyle(filename) {
  /** @type {string[]} */
  const errors = [];
  const logger = {
    /** @param {...unknown} message */
    error: (...message) => {
      errors.push(message.join(' '));
    },
  };

  processData(filename, logger);

  if (errors.length) {
    console.error(chalk`{red   Style – {bold ${errors.length}} ${errors.length === 1 ? 'error' : 'errors'}:}`);
    for (const error of errors) {
      console.error(`    ${error}`);
    }
    return true;
  }
  return false;
}

module.exports = testStyle;
