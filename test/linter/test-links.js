'use strict';
const fs = require('fs');
const chalk = require('chalk');
const { IS_WINDOWS, indexToPos } = require('../utils.js');

/**
 * @param {string} filename
 * @param {import('../utils').Logger} logger
 */
function processData(filename, logger) {
  let hasErrors = false;

  let actual = fs.readFileSync(filename, 'utf-8').trim();
  /** @type {import('../../types').CompatData} */
  const dataObject = JSON.parse(actual);
  let expected = JSON.stringify(dataObject, null, 2);

  // prevent false positives from git.core.autocrlf on Windows
  if (IS_WINDOWS) {
    actual = actual.replace(/\r/g, '');
    expected = expected.replace(/\r/g, '');
  }

  /** @type {(regexp: string|RegExp, matchHandler: (match: RegExpMatchArray) => void) => void} */
  const processLinks = PROCESS_LINKS.bind(this, actual);

  processLinks(
    String.raw`https?://bugzilla\.mozilla\.org/show_bug\.cgi\?id=(\d+)`,
    match => {
      // use https://bugzil.la/1000000 instead
      hasErrors = true;
      logger.error(chalk`{red → ${indexToPos(actual, match.index)} – Use shortenable URL ({yellow ${match[0]}} → {green {bold https://bugzil.la/}${match[1]}}).}`);
    }
  );

  processLinks(
    String.raw`https?://bugs\.chromium\.org/p/chromium/issues/detail\?id=(\d+)`,
    match => {
      // use https://crbug.com/100000 instead
      hasErrors = true;
      logger.error(chalk`{red → ${indexToPos(actual, match.index)} – Use shortenable URL ({yellow ${match[0]}} → {green {bold https://crbug.com/}${match[1]}}).}`);
    }
  );

  processLinks(
    String.raw`https?://bugs\.webkit\.org/show_bug\.cgi\?id=(\d+)`,
    match => {
      // use https://webkit.org/b/100000 instead
      hasErrors = true;
      logger.error(chalk`{red → ${indexToPos(actual, match.index)} – Use shortenable URL ({yellow ${match[0]}} → {green {bold https://webkit.org/b/}${match[1]}}).}`);
    }
  );

  processLinks(
    // Bugzil.la links should use HTTPS and have "bug ###" as link text ("Bug ###" only at the begin of notes/sentences).
    String.raw`(....)<a href='(https?)://(bugzil\.la|crbug\.com|webkit\.org/b)/(\d+)'>(.*?)</a>`,
    match => {
      const [,
        before,
        protocol,
        domain,
        bugId,
        linkText,
      ] = match;

      if (protocol !== 'https') {
        hasErrors = true;
        logger.error(chalk`{red → ${indexToPos(actual, match.index)} – Use HTTPS URL ({yellow http://${domain}/${bugId}} → {green http{bold s}://${domain}/${bugId}}).}`);
      }

      if (domain !== 'bugzil.la') {
        return;
      }

      if (/^bug $/.test(before)) {
        hasErrors = true;
        logger.error(chalk`{red → ${indexToPos(actual, match.index)} – Move word "bug" into link text ({yellow "${before}<a href='...'>${linkText}</a>"} → {green "<a href='...'>{bold ${before}}${bugId}</a>"}).}`);
      } else if (linkText === `Bug ${bugId}`) {
        if (!/(\. |")$/.test(before)) {
          hasErrors = true;
          logger.error(chalk`{red → ${indexToPos(actual, match.index)} – Use lowercase "bug" word within sentence ({yellow "Bug ${bugId}"} → {green "{bold bug} ${bugId}"}).}`);
        }
      } else if (linkText !== `bug ${bugId}`) {
        hasErrors = true;
        logger.error(chalk`{red → ${indexToPos(actual, match.index)} – Use standard link text ({yellow "${linkText}"} → {green "bug ${bugId}"}).}`);
      }
    }
  )

  processLinks(
    String.raw`\b(https?)://((?:[a-z][a-z0-9-]*\.)*)developer.mozilla.org/(.*?)(?=["'\s])`,
    match => {
      const [url, protocol, subdomain, path] = match;
      const [, locale, expectedPath_] = /^(?:(\w\w(?:-\w\w)?)\/)?(.*)$/.exec(path);
      let expectedPath = expectedPath_

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
          chalk`{red → ${pos} – Use HTTPS MDN URL ({yellow ${protocol}://developer.mozilla.org/${path}} → {green https://developer.mozilla.org/${expectedPath}}).}`,
        );
      }

      if (subdomain) {
        hasErrors = true;
        logger.error(
          chalk`{red → ${pos} - Use correct MDN domain ({yellow ${protocol}://{red ${subdomain}}developer.mozilla.org/${path}} → {green https://developer.mozilla.org/${expectedPath}})}`,
        );
      }

      if (path !== expectedPath) {
        hasErrors = true;
        logger.error(
          chalk`{red → ${pos} – Use ${
            locale ? 'non-localized' : 'correct'
          } MDN URL ({yellow ${url}} → {green https://developer.mozilla.org/${expectedPath}}).}`,
        );
      }
    }
  );

  processLinks(
    String.raw`https?://developer.microsoft.com/(\w\w-\w\w)/(.*?)(?=["'\s])`,
    match => {
      hasErrors = true;
      logger.error(chalk`{red → ${indexToPos(actual, match.index)} – Use non-localized Microsoft Developer URL ({yellow ${match[0]}} → {green https://developer.microsoft.com/${match[2]}}).}`);
    }
  );

  return hasErrors;
}

/**
 * @param {string} actual
 * @param {string|RegExp} regexp
 * @param {(match: RegExpExecArray) => void} matchHandler
 */
const PROCESS_LINKS = function processLinks(actual, regexp, matchHandler) {
  const re = new RegExp(regexp, 'g');
  /** @type {RegExpExecArray} */
  let match;
  while ((match = re.exec(actual)) !== null) {
    matchHandler(match);
  }
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
      console.error(`  ${error}`);
    }
    return true;
  }
  return false;
}

module.exports = testLinks;
