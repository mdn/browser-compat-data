#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const fs = require('fs');
const path = require('path');
const { platform } = require('os');

const browsers = require('..').browsers;

const { argv } = require('yargs').command('$0 <browser> <feature>', 'Mirror values onto a specified browser if "version_added" is true/null, based upon its parent or a specified source', (yargs) => {
  yargs.positional('browser', {
    describe: 'The destination browser',
    type: 'string'
  }).positional('feature', {
    describe: 'The feature to perform mirroring',
    type: 'string'
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

 /**
  * @param {string} value
  */
const create_webview_range = (value) => {
  return Number(value) < 37 ? "≤37" : value;
}

 /**
  * @param {string} dest_browser
  * @param {object} source_browser_release
  */
const getMatchingBrowserVersion = (dest_browser, source_browser_release) => {
  var browserData = browsers[dest_browser];
  for (var r in browserData.releases) {
    var release = browserData.releases[r];
    if (
      (release.engine == source_browser_release.engine && Number(release.engine_version) >= Number(source_browser_release.engine_version)) ||
      (["opera", "opera_android"].includes(dest_browser) && release.engine == "Blink" && source_browser_release.engine == "WebKit")
    ) {
      return r;
    }
  }

  return false;
}

 /**
  * @param {string} browser
  * @param {string} source
  */
const getSource = (browser, source) => {
  if (source) {
    return source;
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
  } else {
    throw Error(`${browser} is a base browser and a "source" browser must be specified.`);
  }
}

 /**
  * @param {object} data
  * @param {string} destination
  * @param {string} source
  */
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

    else if (destination == 'safari_ios') {
      if (newValue.version_added !== null) {
        newValue.version_added = getMatchingBrowserVersion(destination, browsers[source].releases[data.version_added]);
      }

      if (data.version_removed && newValue.version_removed != null) {
        newValue.version_removed = getMatchingBrowserVersion(destination, browsers[source].releases[data.version_removed]);
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

 /**
  * @param {object} data
  * @param {string} feature
  * @param {string} browser
  * @param {string} source
  * @param {boolean} force
  */
const setFeature = (data, feature, browser, source, force) => {
  var newData = Object.assign({}, data);

  var rootPath = feature.shift();
  if (feature.length > 0 && data[rootPath].constructor == Object) {
    newData[rootPath] = setFeature(data[rootPath], feature, browser, source, force);
  } else {
    if (data[rootPath].constructor == Object || Array.isArray(data[rootPath])) {
      let comp = data[rootPath].__compat.support;

      let doBump = false;
      if (force) {
        doBump = true;
      } else {
        if (Array.isArray(comp[browser])) {
          for (var i = 0; i < comp[browser].length; i++) {
            if ([true, null, undefined].includes(comp[browser][i].version_added)) {
              doBump = true;
              break;
            }
          }
        } else if (comp[browser] !== undefined) {
          doBump = [true, null, undefined].includes(comp[browser].version_added);
        } else {
          doBump = true;
        }
      }

      if (doBump) {
        newData[rootPath].__compat.support[browser] = bumpVersion(comp[getSource(browser, source)], browser, getSource(browser, source));
      }
    }
  }

  return newData;
}

 /**
  * @param {string} browser
  * @param {string} featureIdent
  * @param {string} source
  * @param {boolean} force
  */
const mirrorData = (browser, featureIdent, source, force) => {
  var filepath = path.resolve(__dirname, '..');
  var feature = featureIdent.split('.');
  var found = false;

  for (var depth = 0; depth < feature.length; depth++) {
    filepath = path.resolve(filepath, feature[depth]);
    var filename = filepath + ".json";
    if (fs.existsSync(filename) && fs.statSync(filename).isFile()) {
      filepath = filename;
      found = true;
      break;
    }
  }

  if (!found) {
    console.error(`Could not find feature ${feature}!`);
    return false;
  }


  let data = require(filepath);
  let newData = setFeature(data, feature, browser, source, force);

  fs.writeFileSync(filepath, JSON.stringify(newData, null, 2) + '\n', 'utf-8');

  return true;
}

if (require.main === module) {
  mirrorData(argv.browser, argv.feature, argv.source, argv.force);
}

module.exports = mirrorData;
