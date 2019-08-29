#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const fs = require('fs');
const path = require('path');
const { platform } = require('os');

const { argv } = require('yargs').command('$0 <browser> [feature]', 'Mirror values onto a specified browser if "version_added" is true/null, based upon its parent or a specified source', (yargs) => {
  yargs.positional('browser', {
    describe: 'The destination browser',
    type: 'string'
  }).positional('feature', {
    describe: 'A specific feature to test against',
    type: 'string',
    default: undefined
  }).option('source', {
    describe: 'Use a specified source browser rather than the default',
    type: 'string',
    default: undefined
  }).option('force', {
    alias: 'f',
    describe: 'Force a mirroring of the data even when "version_added" is not true/null',
    type: 'boolean'
  });
});

const getSource = (browser) => {
  if (argv.source) {
    return argv.source;
  } else if (['chrome_android', 'opera'].includes(browser)) {
    return 'chrome';
  } else if (['opera_android', 'samsunginternet_android', 'webview_android'].includes(browser)) {
    return 'chrome_android';
  } else if (browser == 'firefox_android') {
    return 'firefox';
  } else if (browser == 'edge') {
    return 'ie';
  } else if (browser == 'safari_ios') {
    return 'safari';
  }
}

const bumpVersion = (data, destination, source) => {
  data[destination] = data[source];
  return data;
}

const traverseMirrorData = (obj) => {
  var newData = {};

  for (let i in obj) {
    if (!!obj[i] && typeof(obj[i]) == "object" && i !== '__compat') {
      if (obj[i].__compat) {
        let comp = obj[i].__compat.support;
        let browser = argv.browser;

        newData[i] = bumpVersion(comp, browser, getSource(browser));
      } else {
        newData[i] = obj[i];
      }
      traverseMirrorData(obj[i]);
    }

  return newData;
  }
}

 /**
  * @param {Promise<void>} filename
  */
const mirrorData = (filename) => {
  let data = require(filename);
  let newData = traverseMirrorData(data);

  fs.writeFileSync(filename, JSON.stringify(newData, null, 2) + '\n', 'utf-8');
}

if (require.main === module) {
  /**
   * @param {string[]} files
   */
  function load(...files) {
    for (let file of files) {
      if (file.indexOf(__dirname) !== 0) {
        file = path.resolve(__dirname, '..', file);
      }

      if (!fs.existsSync(file)) {
        continue; // Ignore non-existent files
      }

      if (fs.statSync(file).isFile()) {
        if (path.extname(file) === '.json') {
          mirrorData(file);
        }

        continue;
      }

      const subFiles = fs.readdirSync(file).map((subfile) => {
        return path.join(file, subfile);
      });

      load(...subFiles);
    }
  }

  if (argv.feature) {
    load(argv.feature);
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
      'webextensions'
    );
  }
}

module.exports = mirrorData;
