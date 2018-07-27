'use strict';
const fs = require('fs');
const path = require('path');

function jsonDiff(actual, expected) {
  var actualLines = actual.split(/\n/);
  var expectedLines = expected.split(/\n/);

  for (var i = 0; i < actualLines.length; i++) {
    if (actualLines[i] !== expectedLines[i]) {
      return [
        '#' + (i + 1) + '\x1b[0m',
        '    Actual:   ' + actualLines[i],
        '    Expected: ' + expectedLines[i]
      ].join('\n');
    }
  }
}

function testStyle(filename) {
  let hasErrors = false;
  let actual = fs.readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(JSON.parse(actual), null, 2);

  const {platform} = require("os");
  if (platform() === "win32") { // prevent false positives from git.core.autocrlf on Windows
    actual = actual.replace(/\r/g, "");
    expected = expected.replace(/\r/g, "");
  }

  if (actual === expected) {
    console.log('\x1b[32m  Style – OK \x1b[0m');
  } else {
    hasErrors = true;
    console.error('\x1b[31m  File : ' + path.relative(process.cwd(), filename));
    console.error('\x1b[31m  Style – Error on line ' + jsonDiff(actual, expected));
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
    const regexp = new RegExp("(....)<a href='(https?)://bugzil.la/(\\d+)'>(.*?)</a>", 'g');
    let match;
    do {
      match = regexp.exec(actual);
      if (match) {
        const before = match[1];
        const protocol = match[2];
        const bugId = match[3];
        const linkText = match[4];

        if (protocol !== 'https') {
          hasErrors = true;
          console.error(`\x1b[33m  Style – Use HTTPS URL (http://bugzil.la/${bugId} → https://bugzil.la/${bugId}).\x1b[0m`);
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

  return hasErrors;
}

module.exports.testStyle = testStyle;
