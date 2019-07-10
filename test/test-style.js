'use strict';
const fs = require('fs');
const path = require('path');
const url = require('url');
const chalk = require('chalk');
const { platform } = require('os');

/** Determines if the OS is Windows */
const IS_WINDOWS = platform() === 'win32';

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

const compareFeatures = (a,b) => {
  if (a == '__compat') return -1;
  if (b == '__compat') return 1;
  
  const wordA = /^\w(\w|-|_)*$/.test(a);
  const wordB = /^\w(\w|-|_)*$/.test(b);

  if(wordA && wordB) return a.localeCompare(b, 'en');
  if(wordA || wordB) return (wordA && -1) || 1;
  return 1;
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
 * @param {string} str
 */
function escapeInvisibles(str) {
  /** @type {Array<[string, string]>} */
  const invisibles = [
    ['\b', '\\b'],
    ['\f', '\\f'],
    ['\n', '\\n'],
    ['\r', '\\r'],
    ['\v', '\\v'],
    ['\t', '\\t'],
    ['\0', '\\0'],
  ];
  let finalString = str;

  invisibles.forEach(([invisible, replacement]) => {
    finalString = finalString.replace(invisible, replacement);
  });

  return finalString;
}

/**
 * Gets the row and column matching the index in a string.
 *
 * @param {string} str
 * @param {number} index
 * @return {[number, number] | [null, null]}
 */
function indexToPosRaw(str, index) {
  let line = 1, col = 1;
  let prevChar = null;

  if (
    typeof str !== 'string' ||
    typeof index !== 'number' ||
    index > str.length
  ) {
    return [null, null];
  }

  for (let i = 0; i < index; i++) {
    let char = str[i];
    switch (char) {
      case '\n':
        if (prevChar === '\r') break;
      case '\r':
        line++;
        col = 1;
        break;
      case '\t':
        // Use JSON `tab_size` value from `.editorconfig`
        col += 2;
        break;
      default:
        col++;
        break;
    }
    prevChar = char;
  }

  return [line, col];
}

/**
 * Gets the row and column matching the index in a string and formats it.
 *
 * @param {string} str
 * @param {number} index
 * @return {string} The line and column in the form of: `"(Ln <ln>, Col <col>)"`
 */
function indexToPos(str, index) {
  const [line, col] = indexToPosRaw(str, index);
  return `(Ln ${line}, Col ${col})`;
}

/**
 * @param {string} actual
 * @param {string} expected
 * @return {string}
 */
function jsonDiff(actual, expected) {
  var actualLines = actual.split(/\n/);
  var expectedLines = expected.split(/\n/);

  for (var i = 0; i < actualLines.length; i++) {
    if (actualLines[i] !== expectedLines[i]) {
      return `#${i + 1}
    Actual:   ${escapeInvisibles(actualLines[i])}
    Expected: ${escapeInvisibles(expectedLines[i])}`;
    }
  }
}

/**
 * @param {string} filename
 * @param {{error:function(...unknown):void}} logger
 */
function processData(filename, logger) {
  let hasErrors = false;

  let actual = fs.readFileSync(filename, 'utf-8').trim();
  /** @type {import('../types').CompatData} */
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
    logger.error(chalk`{red Browser sorting error on {bold line ${jsonDiff(expected, expectedSorting)}}}\n{blue     Tip: Run {bold npm run fix} to fix sorting automatically}`);
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
    logger.error(chalk`{red ${indexToPos(actual, webkitMatch.index)} – Use shortenable URL ({yellow ${webkitMatch[0]}} → }{green {bold https://webkit.org/b/}${webkitMatch[1]}}).}`);
  }

  const mdnUrlMatch = actual.match(String.raw`https?://developer.mozilla.org/(\w\w-\w\w)/(.*?)(?=["'\s])`);
  if (mdnUrlMatch) {
    hasErrors = true;
    logger.error(chalk`{red ${indexToPos(actual, mdnUrlMatch.index)} – Use non-localized MDN URL ({yellow ${mdnUrlMatch[0]}} → {green https://developer.mozilla.org/${mdnUrlMatch[2]}}).}`);
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
