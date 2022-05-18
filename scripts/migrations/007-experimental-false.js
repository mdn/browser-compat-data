/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const fs = require('fs');
const path = require('path');

const { browsers } = require('../..');
const { walk } = require('../../utils');

/**
 * @param {object} bcd Parsed BCD object to be updated in place.
 */
const fixExperimental = (bcd) => {
  for (const { compat } of walk(undefined, bcd)) {
    if (!compat?.status?.experimental) {
      continue;
    }

    // This entry is marked as experimental. Check which browsers support it.

    const browserSupport = new Set();

    for (const [browser, support] of Object.entries(compat.support)) {
      // Consider only the first part of an array statement.
      const statement = Array.isArray(support) ? support[0] : support;
      // Ignore anything behind flag, prefix or alternative name
      if (statement.flags || statement.prefix || statement.alternative_name) {
        continue;
      }
      if (statement.version_added && !statement.version_removed) {
        browserSupport.add(browser);
      }
    }

    // Now check which of Blink, Gecko and WebKit support it.

    const engineSupport = new Set();

    for (const browser of browserSupport) {
      const currentRelease = Object.values(browsers[browser].releases).find(
        (r) => r.status === 'current',
      );
      const engine = currentRelease.engine;
      engineSupport.add(engine);
    }

    let engineCount = 0;
    for (const engine of ['Blink', 'Gecko', 'WebKit']) {
      if (engineSupport.has(engine)) {
        engineCount++;
      }
    }

    if (engineCount > 1) {
      compat.status.experimental = false;
    }
  }
};

/**
 * @param {string} filename Filename of BCD to be updated in place.
 */
const fixExperimentalFile = (filename) => {
  const actual = fs.readFileSync(filename, 'utf-8').trim();
  const bcd = JSON.parse(actual);
  fixExperimental(bcd);
  const expected = JSON.stringify(bcd, null, 2);

  if (actual !== expected) {
    fs.writeFileSync(filename, expected + '\n', 'utf-8');
  }
};

/**
 * @param {string[]} files
 */
function load(...files) {
  for (let file of files) {
    if (file.indexOf(__dirname) !== 0) {
      file = path.resolve(__dirname, '..', '..', file);
    }

    if (!fs.existsSync(file)) {
      continue; // Ignore non-existent files
    }

    if (fs.statSync(file).isFile()) {
      if (path.extname(file) === '.json') {
        fixExperimentalFile(file);
      }

      continue;
    }

    const subFiles = fs.readdirSync(file).map((subfile) => {
      return path.join(file, subfile);
    });

    load(...subFiles);
  }
}

if (require.main === module) {
  if (process.argv[2]) {
    load(process.argv[2]);
  } else {
    load(
      'api',
      'css',
      'html',
      'http',
      'svg',
      'javascript',
      'mathml',
      'test',
      'webdriver',
      'webextensions',
    );
  }
}

module.exports = { fixExperimental };
