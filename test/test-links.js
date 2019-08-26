'use strict';
const fs = require('fs');
const chalk = require('chalk');
const { platform } = require('os');
const { indexToPos } = require('./utils.js');

/** Determines if the OS is Windows */
const IS_WINDOWS = platform() === 'win32';

/**
 * @param {string} filename
 * @param {import('./utils').Logger} logger
 */
function processData(filename, logger) {
  let hasErrors = false;

  let actual = fs.readFileSync(filename, 'utf-8').trim();
  /** @type {import('../types').CompatData} */
  let dataObject = JSON.parse(actual);
  let expected = JSON.stringify(dataObject, null, 2);

  // prevent false positives from git.core.autocrlf on Windows
  if (IS_WINDOWS) {
    actual = actual.replace(/\r/g, '');
    expected = expected.replace(/\r/g, '');
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

  return hasErrors;
}

/**
 * @param {string} filename
 */
function testLinks(filename) {
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
    console.error(chalk`{red   Links – {bold ${errors.length}} ${errors.length === 1 ? 'error' : 'errors'}:}`);
    for (const error of errors) {
      console.error(`    ${error}`);
    }
    return true;
  }
  return false;
}

module.exports = testLinks;
