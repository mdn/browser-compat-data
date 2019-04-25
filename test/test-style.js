'use strict';
const fs = require('fs');
const path = require('path');
const url = require('url');

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

function escapeInvisibles(str) {
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
 * @param {string} actual
 * @param {string} expected
 * @return {string}
 */
function jsonDiff(actual, expected) {
  var actualLines = actual.split(/\n/);
  var expectedLines = expected.split(/\n/);

  for (var i = 0; i < actualLines.length; i++) {
    if (actualLines[i] !== expectedLines[i]) {
      return [
        '#' + (i + 1) + '\x1b[0m',
        '    Actual:   ' + escapeInvisibles(actualLines[i]),
        '    Expected: ' + escapeInvisibles(expectedLines[i]),
      ].join('\n');
    }
  }
}

/**
 * @param {string} filename
 */
function testStyle(filename) {
  let hasErrors = false;
  let actual = fs.readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(JSON.parse(actual), null, 2);

  const {platform} = require("os");
  if (platform() === "win32") { // prevent false positives from git.core.autocrlf on Windows
    actual = actual.replace(/\r/g, "");
    expected = expected.replace(/\r/g, "");
  }

  if (actual !== expected) {
    hasErrors = true;
    console.error('\x1b[31m  File : ' + path.relative(process.cwd(), filename));
    console.error('\x1b[31m  Style – Error on line ' + jsonDiff(actual, expected));
  }

  let expectedSorting = JSON.stringify(JSON.parse(actual), orderSupportBlock, 2);
  if (actual !== expectedSorting) {
    hasErrors = true;
    console.error('\x1b[31m  File : ' + path.relative(process.cwd(), filename));
    console.error('\x1b[31m  Browser name sorting – Error on line ' + jsonDiff(actual, expectedSorting));
  }

  const bugzillaMatch = actual.match(String.raw`https?://bugzilla\.mozilla\.org/show_bug\.cgi\?id=(\d+)`);
  if (bugzillaMatch) {
    // use https://bugzil.la/1000000 instead
    hasErrors = true;
    console.error('\x1b[33m  Style – Use shortenable URL (%s → https://bugzil.la/%s).\x1b[0m', bugzillaMatch[0],
      bugzillaMatch[1]);
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
          console.error(`\x1b[33m  Style – Use HTTPS URL (http://${domain}/${bugId} → https://${domain}/${bugId}).\x1b[0m`);
        }

        if (domain !== 'bugzil.la') {
          continue;
        }

        if (/^bug $/.test(before)) {
          hasErrors = true;
          console.error(`\x1b[33m  Style – Move word "bug" into link text ("${before}<a href='...'>${linkText}</a>" → "<a href='...'>${before}${bugId}</a>").\x1b[0m`);
        } else if (linkText === `Bug ${bugId}`) {
          if (!/(\. |")$/.test(before)) {
            hasErrors = true;
            console.error(`\x1b[33m  Style – Use lowercase "bug" word within sentence ("Bug ${bugId}" → "bug ${bugId}").\x1b[0m`);
          }
        } else if (linkText !== `bug ${bugId}`) {
          hasErrors = true;
          console.error(`\x1b[33m  Style – Use standard link text ("${linkText}" → "bug ${bugId}").\x1b[0m`);
        }
      }
    } while (match != null);
  }

  const crbugMatch = actual.match(String.raw`https?://bugs\.chromium\.org/p/chromium/issues/detail\?id=(\d+)`);
  if (crbugMatch) {
    // use https://crbug.com/100000 instead
    hasErrors = true;
    console.error('\x1b[33m  Style – Use shortenable URL (%s → https://crbug.com/%s).\x1b[0m', crbugMatch[0],
      crbugMatch[1]);
  }

  const webkitMatch = actual.match(String.raw`https?://bugs\.webkit\.org/show_bug\.cgi\?id=(\d+)`);
  if (webkitMatch) {
    // use https://webkit.org/b/100000 instead
    hasErrors = true;
    console.error('\x1b[33m  Style – Use shortenable URL (%s → https://webkit.org/b/%s).\x1b[0m', webkitMatch[0],
      webkitMatch[1]);
  }

  const mdnUrlMatch = actual.match(String.raw`https?://developer.mozilla.org/(\w\w-\w\w)/(.*?)(?=["'\s])`);
  if (mdnUrlMatch) {
    hasErrors = true;
    console.error(
      '\x1b[33m  Style – Use non-localized MDN URL (%s → https://developer.mozilla.org/%s).\x1b[0m',
      mdnUrlMatch[0],
      mdnUrlMatch[2]);
  }

  let constructorMatch = actual.match(String.raw`"<code>([^)]*?)</code> constructor"`)
  if (constructorMatch) {
    hasErrors = true;
    console.error(
      '\x1b[33m  Style – Use parentheses in constructor description: %s → %s()\x1b[0m',
      constructorMatch[1],
      constructorMatch[1]
    );
  }

  if (actual.includes("href=\\\"")) {
    hasErrors = true;
    console.error('\x1b[33m  Style – Found \\" but expected \' for <a href>.\x1b[0m');
  }

  const regexp = new RegExp("<a href='([^'>]+)'>((?:.(?!\<\/a\>))*.)</a>", 'g');
  let match = regexp.exec(actual);
  if (match) {
    var a_url = url.parse(match[1]);
    if (a_url.hostname === null) {
      hasErrors = true;
      console.error(
        '\x1b[33m  Style – Include hostname in URL: %s → https://developer.mozilla.org/%s\x1b[0m', match[1], match[1]
      );
    }
  }

  return hasErrors;
}

module.exports = testStyle;
