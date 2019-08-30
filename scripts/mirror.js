#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const fs = require('fs');
const path = require('path');
const { platform } = require('os');

const browsers = require('..').browsers;

const { argv } = require('yargs').command('$0 <browser> [file]', 'Mirror values onto a specified browser if "version_added" is true/null, based upon its parent or a specified source', (yargs) => {
  yargs.positional('browser', {
    describe: 'The destination browser',
    type: 'string'
  }).positional('file', {
    describe: 'A specific file to test against',
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

const create_webview_range = (value) => {
  return Number(value) < 37 ? "≤37" : value;
}

const getMatchingBrowserVersion = (dest_browser, source_browser_release) => {
  var browserData = browsers[dest_browser];
  for (var r in browserData.releases) {
    var release = browserData.releases[r];
    if (release.engine == source_browser_release.engine && Number(release.engine_version) >= Number(source_browser_release.engine_version)) {
      return r;
    }
  }

  return false;
}

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
  if (Array.isArray(data)) {
    var newValue = [];
    for (var i = 0; i < data.length(); i++) {
      newValue[i] = bumpVersion[i];
    }
  } else {
    var newValue = {};
    for (let i in data) {
      newValue[i] = data[i]; // Prevent shallow copy / modification of source data
    }

    if (destination == 'chrome_android') {
      if (typeof(newValue.version_added) === 'string') {
        newValue.version_added = Math.max(15, Number(newValue.version_added)).toString();
      }

      if (data.version_removed) {
        if (typeof(newValue.version_removed) === 'string') {
          newValue.version_removed = Math.max(15, Number(newValue.version_removed)).toString();
        }
      }
    }

    else if (destination == 'edge') {
      if (data.version_removed && newValue.version_removed !== null) {
        newValue.version_removed = false;
      } else if (newValue.version_added !== null) {
        newValue.version_added = newValue.version_added ? '12' : null;
      }

      if (data.notes) {
        newValue.notes = newValue.notes.replace(/Internet Explorer/g, "Edge");
      }
    }

    else if (destination == 'firefox_android') {
      if (typeof(newValue.version_added) === 'string') {
        newValue.version_added = Math.max(4, Number(newValue.version_added)).toString();
      }

      if (data.version_removed) {
        if (typeof(newValue.version_removed) === 'string') {
          newValue.version_removed = Math.max(4, Number(newValue.version_removed)).toString();
        }
      }
    }

    else if (destination == 'opera') {
      if (typeof(data.version_added) === 'string') {
        newValue.version_added = getMatchingBrowserVersion(destination, browsers[source].releases[data.version_added]);
      }

      if (data.version_removed) {
        if (typeof(data.version_removed) === 'string') {
          newValue.version_removed = getMatchingBrowserVersion(destination, browsers[source].releases[data.version_removed]);
        }
      }

      if (typeof(data.notes) === 'string') {
        newValue.notes = newValue.notes.replace(/Chrome/g, "Opera");
      }
    }

    else if (destination == 'opera_android') {
      if (typeof(data.version_added) === 'string') {
        newValue.version_added = getMatchingBrowserVersion(destination, browsers[source].releases[data.version_added]);
      }

      if (data.version_removed) {
        if (typeof(data.version_removed) === 'string') {
          newValue.version_removed = getMatchingBrowserVersion(destination, browsers[source].releases[data.version_removed]);
        }
      }

      if (typeof(data.notes) === 'string') {
        newValue.notes = newValue.notes.replace(/Chrome/g, "Opera");
      }
    }

    else if (destination == 'samsunginternet_android') {
      if (newValue.version_added !== null) {
        newValue.version_added = getMatchingBrowserVersion(destination, browsers[source].releases[data.version_added]);
      }

      if (data.version_removed && newValue.version_removed != null) {
        newValue.version_removed = getMatchingBrowserVersion(destination, browsers[source].releases[data.version_removed]);
      }

      if (typeof(data.notes) === 'string') {
        newValue.notes = newValue.notes.replace(/Chrome/g, "Samsung Internet");
      }
    }

    else if (destination == 'webview_android') {
      if (typeof(newValue.version_added) === 'string') {
        newValue.version_added = create_webview_range(newValue.version_added);
      }

      if (data.version_removed) {
        if (typeof(newValue.version_removed) === 'string') {
          newValue.version_removed = create_webview_range(newValue.version_removed);
        }
      }

      if (typeof(data.notes) === 'string') {
        newValue.notes = newValue.notes.replace(/Chrome/g, "WebView");
      }
    }
  }

  return newValue;
}

const traverseMirrorData = (obj) => {
  var newData = {};

  for (let i in obj) {
    if (!!obj[i] && typeof(obj[i]) == "object" && i !== '__compat') {
      newData[i] = obj[i];
      if (obj[i].__compat) {
        let comp = obj[i].__compat.support;
        let browser = argv.browser;

        let doBump = false;
        if (argv.force) {
          doBump = true;
        } else {
          if (Array.isArray(comp[browser])) {
            for (var j = 0; j < comp[browser].length; j++) {
              if ([true, null, undefined].includes(comp[browser][j].version_added)) {
                doBump = true;
                break;
              }
            }
          } else {
            doBump = [true, null, undefined].includes(comp[browser].version_added);
          }
        }

        if (doBump) {
          newData[i].__compat.support[browser] = bumpVersion(comp[getSource(browser)], browser, getSource(browser));
        }
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

  if (argv.file) {
    load(argv.file);
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
