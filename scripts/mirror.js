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

const samsunginternet_mapping = {
  "1": "1.0", "2": "1.0", "3": "1.0", "4": "1.0", "5": "1.0", "6": "1.0", "7": "1.0", "8": "1.0", "9": "1.0", "10": "1.0", "11": "1.0", "12": "1.0", "13": "1.0", "14": "1.0", "15": "1.0", "16": "1.0", "17": "1.0", "18": "1.0",
  "19": "1.5", "20": "1.5", "21": "1.5", "22": "1.5", "23": "1.5", "24": "1.5", "25": "1.5", "26": "1.5", "27": "1.5", "28": "1.5",
  "29": "2.0", "30": "2.0", "31": "2.0", "32": "2.0", "33": "2.0", "34": "2.0",
  "35": "3.0", "36": "3.0", "37": "3.0", "38": "3.0",
  "39": "4.0", "40": "4.0", "41": "4.0", "42": "4.0", "43": "4.0", "44": "4.0",
  "45": "5.0", "46": "5.0", "47": "5.0", "48": "5.0", "49": "5.0", "50": "5.0", "51": "5.0",
  "52": "6.0", "53": "6.0", "54": "6.0", "55": "6.0", "56": "6.0",
  "57": "7.0", "58": "7.0", "59": "7.0", "59": "7.0",
  "60": "8.0", "61": "8.0", "62": "8.0", "63": "8.0",
  "64": "9.0", "65": "9.0", "66": "9.0", "67": "9.0"
}

const create_webview_range = (value) => {
  return Number(value) < 37 ? "≤37" : value;
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
        newValue.version_added = Math.max(15, Number(data.version_added) - 13).toString();
      }

      if (data.version_removed) {
        if (typeof(data.version_removed) === 'string') {
          newValue.version_removed = Math.max(15, Number(data.version_removed) - 13).toString();
        }
      }

      if (typeof(data.notes) === 'string') {
        newValue.notes = newValue.notes.replace(/Chrome/g, "Opera");
      }
  }

    else if (destination == 'opera_android') {
      if (typeof(data.version_added) === 'string') {
        newValue.version_added = Math.max(14, Number(data.version_added) - 13).toString();
      }

      if (data.version_removed) {
        if (typeof(data.version_removed) === 'string') {
          newValue.version_removed = Math.max(14, Number(data.version_removed) - 13).toString();
        }
      }

      if (typeof(data.notes) === 'string') {
        newValue.notes = newValue.notes.replace(/Chrome/g, "Opera");
      }
  }

    else if (destination == 'samsunginternet_android') {
      if (newValue.version_added !== null) {
        newValue.version_added = samsunginternet_mapping[newValue.version_added] || newValue.version_added;
      }

      if (data.version_removed && newValue.version_removed != null) {
        newValue.version_removed = samsunginternet_mapping[newValue.version_removed] || newValue.version_removed;
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
