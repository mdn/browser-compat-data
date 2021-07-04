#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

/**
 * @typedef {import('../types').Identifier} Identifier
 * @typedef {import('../types').SupportStatement} SupportStatement
 * @typedef {import('../types').ReleaseStatement} ReleaseStatement
 */

'use strict';
const fs = require('fs');
const path = require('path');

const compareVersions = require('compare-versions');

const browsers = require('..').browsers;

const { argv } = require('yargs').command(
  '$0 <browser> [feature_or_file]',
  'Mirror values onto a specified browser if "version_added" is true/null, based upon its parent or a specified source',
  yargs => {
    yargs
      .positional('browser', {
        describe: 'The destination browser',
        type: 'string',
      })
      .positional('feature_or_file', {
        describe: 'The feature, file, or folder to perform mirroring',
        type: 'string',
        default: '',
      })
      .option('source', {
        describe: 'Use a specified source browser rather than the default',
        type: 'string',
        default: undefined,
      })
      .option('modify', {
        alias: 'm',
        describe:
          'Specify when to perform mirroring, whether on true/null ("nonreal", default), true/null/false ("bool"), or always ("always")',
        type: 'string',
        default: 'nonreal',
      });
  },
);

/**
 * @param {string} dest_browser
 * @param {ReleaseStatement} source_browser_release
 * @returns {ReleaseStatement|boolean}
 */
const getMatchingBrowserVersion = (dest_browser, source_browser_release) => {
  const browserData = browsers[dest_browser];
  for (const r in browserData.releases) {
    const release = browserData.releases[r];
    if (
      (release.engine == source_browser_release.engine &&
        compareVersions.compare(
          release.engine_version,
          source_browser_release.engine_version,
          '>=',
        )) ||
      (['opera', 'opera_android', 'samsunginternet_android'].includes(
        dest_browser,
      ) &&
        release.engine == 'Blink' &&
        source_browser_release.engine == 'WebKit')
    ) {
      return r;
    }
  }

  return false;
};

/**
 * @param {string} browser
 * @param {string} forced_source
 * @returns {string}
 */
const getSource = (browser, forced_source) => {
  if (forced_source) {
    return forced_source;
  }

  let source = '';

  switch (browser) {
    case 'chrome_android':
    case 'opera':
      source = 'chrome';
      break;
    case 'opera_android':
    case 'samsunginternet_android':
    case 'webview_android':
      source = 'chrome_android';
      break;
    case 'firefox_android':
      source = 'firefox';
      break;
    case 'edge':
      source = 'ie';
      break;
    case 'safari_ios':
      source = 'safari';
      break;
    default:
      throw Error(
        `${browser} is a base browser and a "source" browser must be specified.`,
      );
  }

  return source;
};

/**
 * @param {string|string[]|null} notes1
 * @param {string|string[]|null} notes2
 * @returns {string|string[]|null}
 */
const combineNotes = (notes1, notes2) => {
  let newNotes = [];

  if (notes1) {
    if (typeof notes1 === 'string') {
      newNotes.push(notes1);
    } else {
      newNotes.push(...notes1);
    }
  }

  if (notes2) {
    if (typeof notes2 === 'string') {
      newNotes.push(notes2);
    } else {
      newNotes.push(...notes2);
    }
  }

  newNotes = newNotes.filter((item, pos) => {
    newNotes.indexOf(item) == pos;
  });

  if (newNotes.length == 0) {
    return null;
  }
  if (newNotes.length == 1) {
    return newNotes[0];
  }

  return newNotes;
};

/**
 * @param {string|string[]|null} notes
 * @param {RegExp} regex
 * @param {string} replace
 * @returns {string|string[]|null}
 */
const updateNotes = (notes, regex, replace) => {
  if (notes === null || notes === undefined) {
    return null;
  }

  if (typeof notes === 'string') {
    return notes.replace(regex, replace);
  }

  let newNotes = [];
  for (let note of notes) {
    newNotes.push(note.replace(regex, replace));
  }
  return newNotes;
};

/**
 * @param {SupportStatement} data
 * @returns {SupportStatement}
 */
const copyStatement = data => {
  let newData = {};
  for (let i in data) {
    newData[i] = data[i];
  }

  return newData;
};

/**
 * @param {SupportStatement} originalData
 * @param {SupportStatement} sourceData
 * @param {string} source
 * @returns {SupportStatement}
 */
const bumpChromeAndroid = (originalData, sourceData, source) => {
  let newData = copyStatement(sourceData);

  if (typeof sourceData.version_added === 'string') {
    let value = Number(sourceData.version_added);
    if (value < 18) value = 18;
    if (value > 18 && value < 25) value = 25;

    newData.version_added = value.toString();
  }

  if (
    sourceData.version_removed &&
    typeof sourceData.version_removed === 'string'
  ) {
    let value = Number(sourceData.version_removed);
    if (value < 18) value = 18;
    if (value > 18 && value < 25) value = 25;

    newData.version_removed = value.toString();
  }

  return newData;
};

/**
 * @param {SupportStatement} originalData
 * @param {SupportStatement} sourceData
 * @param {string} source
 * @returns {SupportStatement}
 */
const bumpEdge = (originalData, sourceData, source) => {
  let newData = {};

  if (source == 'ie') {
    if (sourceData.version_removed && sourceData.version_removed !== null) {
      newData.version_added = false;
    } else if (sourceData.version_added !== null) {
      newData.version_added = sourceData.version_added ? '12' : null;
    }

    if (sourceData.notes) {
      newData.notes = updateNotes(
        sourceData.notes,
        /Internet Explorer/g,
        'Edge',
      );
    }
  } else if (source == 'chrome') {
    newData = originalData == undefined ? sourceData : originalData;

    let chromeFalse =
      sourceData.version_added === false ||
      sourceData.version_removed !== undefined;
    let chromeNull = sourceData.version_added === null;

    if (originalData === undefined) {
      newData.version_added = chromeFalse ? false : chromeNull ? null : '≤79';
    } else {
      if (!chromeFalse && !chromeNull) {
        if (originalData.version_added == true) {
          newData.version_added = '≤18';
        } else {
          if (
            sourceData.version_added == true ||
            Number(sourceData.version_added) <= 79
          ) {
            if (originalData.version_added == false) {
              newData.version_added = '79';
            } else if (originalData.version_added == null) {
              newData.version_added = '≤79';
            }
          } else {
            newData.version_added == sourceData.version_added;
          }
        }
      } else if (chromeFalse) {
        if (originalData.version_added && !originalData.version_removed) {
          newData.version_removed = '79';
        }
      }
    }

    let newNotes = combineNotes(
      updateNotes(sourceData.notes, /Chrome/g, 'Edge'),
      originalData.notes,
    );

    if (newNotes) {
      newData.notes = newNotes;
    }
  }

  return newData;
};

/**
 * @param {SupportStatement} originalData
 * @param {SupportStatement} sourceData
 * @param {string} source
 * @returns {SupportStatement}
 */
const bumpFirefoxAndroid = (originalData, sourceData, source) => {
  let newData = copyStatement(sourceData);

  if (typeof sourceData.version_added === 'string') {
    newData.version_added = Math.max(
      4,
      Number(sourceData.version_added),
    ).toString();
  }

  if (
    sourceData.version_removed &&
    typeof sourceData.version_removed === 'string'
  ) {
    newData.version_removed = Math.max(
      4,
      Number(sourceData.version_removed),
    ).toString();
  }

  return newData;
};

/**
 * @param {SupportStatement} originalData
 * @param {SupportStatement} sourceData
 * @param {string} source
 * @returns {SupportStatement}
 */
const bumpOpera = (originalData, sourceData, source) => {
  let newData = copyStatement(sourceData);

  if (typeof sourceData.version_added === 'string') {
    newData.version_added = getMatchingBrowserVersion(
      'opera',
      browsers[source].releases[sourceData.version_added],
    );
  }

  if (
    sourceData.version_removed &&
    typeof sourceData.version_removed === 'string'
  ) {
    newData.version_removed = getMatchingBrowserVersion(
      'opera',
      browsers[source].releases[sourceData.version_removed],
    );
  }

  if (typeof sourceData.notes === 'string') {
    newData.notes = updateNotes(sourceData.notes, /Chrome/g, 'Opera');
  }

  return newData;
};

/**
 * @param {SupportStatement} originalData
 * @param {SupportStatement} sourceData
 * @param {string} source
 * @returns {SupportStatement}
 */
const bumpOperaAndroid = (originalData, sourceData, source) => {
  let newData = copyStatement(sourceData);

  if (typeof sourceData.version_added === 'string') {
    newData.version_added = getMatchingBrowserVersion(
      'opera_android',
      browsers[source].releases[sourceData.version_added],
    );
  }

  if (
    sourceData.version_removed &&
    typeof sourceData.version_removed === 'string'
  ) {
    newData.version_removed = getMatchingBrowserVersion(
      'opera_android',
      browsers[source].releases[sourceData.version_removed],
    );
  }

  if (typeof sourceData.notes === 'string') {
    newData.notes = updateNotes(sourceData.notes, /Chrome/g, 'Opera');
  }

  return newData;
};

/**
 * @param {SupportStatement} originalData
 * @param {SupportStatement} sourceData
 * @param {string} source
 * @returns {SupportStatement}
 */
const bumpSafariiOS = (originalData, sourceData, source) => {
  let newData = copyStatement(sourceData);

  if (typeof sourceData.version_added === 'string') {
    newData.version_added = getMatchingBrowserVersion(
      'safari_ios',
      browsers[source].releases[sourceData.version_added],
    );
  }

  if (
    sourceData.version_removed &&
    typeof sourceData.version_removed === 'string'
  ) {
    newData.version_removed = getMatchingBrowserVersion(
      'safari_ios',
      browsers[source].releases[sourceData.version_removed],
    );
  }

  return newData;
};

/**
 * @param {SupportStatement} originalData
 * @param {SupportStatement} sourceData
 * @param {string} source
 * @returns {SupportStatement}
 */
const bumpSamsungInternet = (originalData, sourceData, source) => {
  let newData = copyStatement(sourceData);

  if (typeof sourceData.version_added === 'string') {
    newData.version_added = getMatchingBrowserVersion(
      'samsunginternet_android',
      browsers[source].releases[sourceData.version_added],
    );
  }

  if (
    sourceData.version_removed &&
    typeof sourceData.version_removed === 'string'
  ) {
    newData.version_removed = getMatchingBrowserVersion(
      'samsunginternet_android',
      browsers[source].releases[sourceData.version_removed],
    );
  }

  if (typeof sourceData.notes === 'string') {
    newData.notes = updateNotes(
      sourceData.notes,
      /Chrome/g,
      'Samsung Internet',
    );
  }

  return newData;
};

/**
 * @param {SupportStatement} originalData
 * @param {SupportStatement} sourceData
 * @param {string} source
 * @returns {SupportStatement}
 */
const bumpWebView = (originalData, sourceData, source) => {
  let newData = copyStatement(sourceData);

  const createWebViewRange = version => {
    if (Number(version) <= 18) {
      return '1';
    } else if (Number(version) > 18 && Number(version) < 30) {
      return '≤37';
    } else if (Number(version) >= 30 && Number(version) < 33) {
      return '4.4';
    } else if (Number(version) >= 33 && Number(version) < 37) {
      return '4.4.3';
    } else {
      return version;
    }
  };

  if (typeof sourceData.version_added === 'string') {
    newData.version_added = createWebViewRange(sourceData.version_added);
  }

  if (
    sourceData.version_removed &&
    typeof sourceData.version_removed === 'string'
  ) {
    newData.version_removed = createWebViewRange(sourceData.version_removed);
  }

  if (typeof sourceData.notes === 'string') {
    newData.notes = updateNotes(sourceData.notes, /Chrome/g, 'WebView');
  }

  return newData;
};

/**
 * @param {SupportStatement} originalData
 * @param {SupportStatement} sourceData
 * @param {string} source
 * @returns {SupportStatement}
 */
const bumpGeneric = (originalData, sourceData, source) => {
  // For browsers we're not tracking, simply mirror the source data
  return sourceData;
};

/**
 * @param {SupportStatement} data
 * @param {string} destination
 * @param {string} source
 * @param {SupportStatement} originalData
 */
const bumpVersion = (data, destination, source, originalData) => {
  let newData = null;
  if (data == null) {
    return null;
  } else if (
    Array.isArray(data) &&
    !(destination == 'edge' && source == 'chrome')
  ) {
    newData = [];
    for (let i = 0; i < data.length; i++) {
      newData[i] = bumpVersion(data[i], destination, source, originalData);
    }
  } else {
    let bumpFunction = null;

    switch (destination) {
      case 'chrome_android':
        bumpFunction = bumpChromeAndroid;
        break;
      case 'edge':
        bumpFunction = bumpEdge;
        break;
      case 'firefox_android':
        bumpFunction = bumpFirefoxAndroid;
        break;
      case 'opera':
        bumpFunction = bumpOpera;
        break;
      case 'opera_android':
        bumpFunction = bumpOperaAndroid;
        break;
      case 'safari_ios':
        bumpFunction = bumpSafariiOS;
        break;
      case 'samsunginternet_android':
        bumpFunction = bumpSamsungInternet;
        break;
      case 'webview_android':
        bumpFunction = bumpWebView;
        break;
      default:
        bumpFunction = bumpGeneric;
        break;
    }

    newData = bumpFunction(originalData, data, source);
  }

  return newData;
};

/**
 * @param {Identifier} data
 * @param {Identifier} newData
 * @param {string} rootPath
 * @param {string} browser
 * @param {string} source
 * @param {string} modify
 @ @returns {Identifier}
 */
const doSetFeature = (data, newData, rootPath, browser, source, modify) => {
  let comp = data[rootPath].__compat.support;

  let doBump = false;
  if (modify == 'always') {
    doBump = true;
  } else {
    let triggers =
      modify == 'nonreal'
        ? [true, null, undefined]
        : [true, false, null, undefined];
    if (Array.isArray(comp[browser])) {
      for (let i = 0; i < comp[browser].length; i++) {
        if (triggers.includes(comp[browser][i].version_added)) {
          doBump = true;
          break;
        }
      }
    } else if (comp[browser] !== undefined) {
      doBump = triggers.includes(comp[browser].version_added);
    } else {
      doBump = true;
    }
  }

  if (doBump) {
    let newValue = bumpVersion(comp[source], browser, source, comp[browser]);
    if (newValue !== null) {
      newData[rootPath].__compat.support[browser] = newValue;
    }
  }

  return newData;
};

/**
 * @param {Identifier} data
 * @param {string} feature
 * @param {string} browser
 * @param {string} source
 * @param {string} modify
 * @returns {Identifier}
 */
const setFeature = (data, feature, browser, source, modify) => {
  let newData = Object.assign({}, data);

  const rootPath = feature.shift();
  if (feature.length > 0 && data[rootPath].constructor == Object) {
    newData[rootPath] = setFeature(
      data[rootPath],
      feature,
      browser,
      source,
      modify,
    );
  } else {
    if (data[rootPath].constructor == Object || Array.isArray(data[rootPath])) {
      newData = doSetFeature(data, newData, rootPath, browser, source, modify);
    }
  }

  return newData;
};

/**
 * @param {Identifier} data
 * @param {string} browser
 * @param {string} source
 * @param {string} modify
 * @returns {Identifier}
 */
const setFeatureRecursive = (data, browser, source, modify) => {
  let newData = Object.assign({}, data);

  for (let i in data) {
    if (!!data[i] && typeof data[i] == 'object' && i !== '__compat') {
      newData[i] = data[i];
      if (data[i].__compat) {
        doSetFeature(data, newData, i, browser, source, modify);
      }
      setFeatureRecursive(data[i], browser, source, modify);
    }
  }

  return newData;
};

/**
 * @param {string} browser
 * @param {string} filepath
 * @param {string} source
 * @param {string} modify
 * @returns {boolean}
 */
function mirrorDataByFile(browser, filepath, source, modify) {
  let file = filepath;
  if (file.indexOf(__dirname) !== 0) {
    file = path.resolve(__dirname, '..', file);
  }

  if (!fs.existsSync(file)) {
    return false;
  }

  if (fs.statSync(file).isFile()) {
    if (path.extname(file) === '.json') {
      let data = require(file);
      let newData = setFeatureRecursive(data, browser, source, modify);

      fs.writeFileSync(file, JSON.stringify(newData, null, 2) + '\n', 'utf-8');
    }
  } else if (fs.statSync(file).isDirectory()) {
    const subFiles = fs.readdirSync(file).map(subfile => {
      return path.join(file, subfile);
    });

    for (let subfile of subFiles) {
      mirrorDataByFile(browser, subfile, source, modify);
    }
  }

  return true;
}

/**
 * Allows mirroring by feature ID (e.g. "html.elements.a")
 *
 * Note that this assumes a predictable file structure
 * which BCD doesn't have right now. (issue #3617)
 * For example, even if "html.elements.input.input-button"
 * is a valid query, it will fail here, because the file structure
 * for input-button isn't consistent with the rest right now.
 *
 * @param {string} browser
 * @param {string} featureIdent
 * @param {string} source
 * @param {string} modify
 * @returns {boolean}
 */
const mirrorDataByFeature = (browser, featureIdent, source, modify) => {
  let filepath = path.resolve(__dirname, '..');
  let feature = featureIdent.split('.');
  let found = false;

  for (let depth = 0; depth < feature.length; depth++) {
    filepath = path.resolve(filepath, feature[depth]);
    const filename = filepath + '.json';
    if (fs.existsSync(filename) && fs.statSync(filename).isFile()) {
      filepath = filename;
      found = true;
      break;
    }
  }

  if (!found) {
    console.error(`Could not find file for ${featureIdent}!`);
    return false;
  }

  let data = require(filepath);
  let newData = setFeature(data, feature, browser, source, modify);

  fs.writeFileSync(filepath, JSON.stringify(newData, null, 2) + '\n', 'utf-8');

  return true;
};

/**
 * @param {string} browser
 * @param {string} feature_or_file
 * @param {string} forced_source
 * @param {string} modify
 * @returns {boolean}
 */
const mirrorData = (browser, feature_or_file, forced_source, modify) => {
  if (!['nonreal', 'bool', 'always'].includes(modify)) {
    console.error(
      `--modify (-m) paramter invalid!  Must be "nonreal", "bool", or "always"; got "${modify}".`,
    );
    return false;
  }

  let source = getSource(browser, forced_source);

  if (feature_or_file) {
    let doMirror = mirrorDataByFeature;
    if (
      fs.existsSync(feature_or_file) &&
      (fs.statSync(feature_or_file).isFile() ||
        fs.statSync(feature_or_file).isDirectory())
    )
      doMirror = mirrorDataByFile;

    doMirror(browser, feature_or_file, source, modify);
  } else {
    [
      'api',
      'css',
      'html',
      'http',
      'svg',
      'javascript',
      'mathml',
      'webdriver',
      'webextensions',
    ].forEach(folder => {
      mirrorDataByFile(browser, folder, source, modify);
    });
  }

  console.log(
    "Mirroring complete!  Note that results are not guaranteed to be 100% accurate.  Please review the script's output, especially notes, for any errors, and be sure to run `npm test` before submitting a pull request.",
  );

  return true;
};

if (require.main === module) {
  mirrorData(argv.browser, argv.feature_or_file, argv.source, argv.modify);
}

module.exports = mirrorData;
