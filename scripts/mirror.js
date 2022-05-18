/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import compareVersions from 'compare-versions';
import esMain from 'es-main';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import bcd from '../index.js';
const { browsers } = bcd;

const dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * @typedef {import('../types').Identifier} Identifier
 * @typedef {import('../types').SupportStatement} SupportStatement
 * @typedef {import('../types').ReleaseStatement} ReleaseStatement
 */

/**
 * @param {string} dest_browser
 * @param {ReleaseStatement} source_release
 * @returns {ReleaseStatement|boolean}
 */
const getMatchingBrowserVersion = (dest_browser, source_release) => {
  const browserData = browsers[dest_browser];
  const releaseKeys = Object.keys(browserData.releases);
  releaseKeys.sort(compareVersions);

  for (const r of releaseKeys) {
    const release = browserData.releases[r];
    if (
      ['opera', 'opera_android', 'samsunginternet_android'].includes(
        dest_browser,
      ) &&
      release.engine == 'Blink' &&
      source_release.engine == 'WebKit'
    ) {
      return r;
    } else if (release.engine == source_release.engine) {
      if (
        ['beta', 'nightly'].includes(release.status) &&
        release.status == source_release.status
      ) {
        return r;
      } else if (
        release.engine_version &&
        source_release.engine_version &&
        compareVersions.compare(
          release.engine_version,
          source_release.engine_version,
          '>=',
        )
      ) {
        return r;
      }
    }
  }

  return false;
};

/**
 * @param {string} browser
 * @returns {string}
 */
const getSource = (browser) => {
  switch (browser) {
    case 'chrome_android':
    case 'edge':
    case 'opera':
      return 'chrome';
    case 'opera_android':
    case 'samsunginternet_android':
    case 'webview_android':
      return 'chrome_android';
    case 'firefox_android':
      return 'firefox';
    case 'safari_ios':
      return 'safari';
    default:
      throw Error(`${browser} cannot be used as a mirroring destination.`);
  }
};

/*
 * @param {SupportStatement} compatData
 * @param {string | null} versionToCheck
 * @return {string | null}
 */
const isVersionAdded = (compatData, versionToCheck) => {
  if (Array.isArray(compatData)) {
    return compatData.some((s) => s.version_added == versionToCheck);
  }

  if (typeof compatData.version_added === 'string') {
    return compatData.version_added == versionToCheck;
  }

  return false;
};

/**
 * @param {SupportStatement} compatData
 * @param {string | null} versionToCheck
 * @return {string | null}
 */
const isVersionRemoved = (compatData, versionToCheck) => {
  if (typeof compatData.version_removed === 'string')
    return compatData.version_removed == versionToCheck;

  if (compatData.constructor === Array) {
    return compatData.some((s) => s.version_removed === versionToCheck);
  }

  return false;
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
const copyStatement = (data) => {
  let newData = {};
  for (let i in data) {
    newData[i] = data[i];
  }

  return newData;
};

/**
 * @param {SupportStatement} originalData
 * @param {SupportStatement} sourceData
 * @param {string} destination
 * @param {string} source
 * @param {Array.<RegExp, string>} notesRepl
 * @returns {SupportStatement}
 */
const bumpGeneric = (
  originalData,
  sourceData,
  destination,
  source,
  notesRepl,
) => {
  let newData = copyStatement(sourceData);

  if (typeof sourceData.version_added === 'string') {
    newData.version_added = getMatchingBrowserVersion(
      destination,
      browsers[source].releases[sourceData.version_added],
    );
  }

  if (
    sourceData.version_removed &&
    typeof sourceData.version_removed === 'string'
  ) {
    newData.version_removed = getMatchingBrowserVersion(
      destination,
      browsers[source].releases[sourceData.version_removed],
    );
  }

  if (notesRepl && typeof sourceData.notes === 'string') {
    newData.notes = updateNotes(sourceData.notes, notesRepl[0], notesRepl[1]);
  }

  return newData;
};

/**
 * @param {SupportStatement} originalData
 * @param {SupportStatement} sourceData
 * @returns {SupportStatement}
 */
const bumpChromeAndroid = (originalData, sourceData) => {
  return bumpGeneric(originalData, sourceData, 'chrome_android', 'chrome');
};

/**
 * @param {SupportStatement} originalData
 * @param {SupportStatement} sourceData
 * @returns {SupportStatement}
 */
const bumpEdge = (originalData, sourceData) => {
  let newData = copyStatement(sourceData);
  let source = 'chrome';


  if (chromeFalse) {
    if (
      typeof sourceData.version_removed === 'string' &&
      compareVersions.compare(sourceData.version_removed, '79', '<=')
    ) {
      // If this feature was removed before Chrome 79, it's not present in Edge
      return { version_added: false };
    }

    if (
      typeof sourceData.version_added === 'string' &&
      compareVersions.compare(sourceData.version_added, '79', '<=')
    ) {
      // If the feature was added before Chrome 79 but removed afterwards
      if (typeof originalData.version_added == 'string') {
        newData.version_added = originalData.version_added;
      } else {
        newData.version_added = '79';
      }
    }
    if (originalData.version_added && !originalData.version_removed) {
      newData.version_removed = '79';
    }
  } else if (chromeNull) {
    newData.version_added = null;
  } else {
    if (sourceData.version_added === true) {
      newData.version_added =
        originalData.version_added === true ? '≤18' : true;
    } else if (compareVersions.compare(sourceData.version_added, '79', '<=')) {
      newData.version_added =
        originalData.version_added === null ? '≤79' : '79';
    } else {
      newData.version_added = sourceData.version_added;
    }
  }

  let newNotes = updateNotes(sourceData.notes, /Chrome(?! ?OS)/g, 'Edge');
  if (newNotes) {
    newData.notes = newNotes;
  }

  return newData;
};

/**
 * @param {SupportStatement} originalData
 * @param {SupportStatement} sourceData
 * @returns {SupportStatement}
 */
const bumpFirefoxAndroid = (originalData, sourceData) => {
  return bumpGeneric(originalData, sourceData, 'firefox_android', 'firefox');
};

/**
 * @param {SupportStatement} originalData
 * @param {SupportStatement} sourceData
 * @returns {SupportStatement}
 */
const bumpOpera = (originalData, sourceData) => {
  return bumpGeneric(originalData, sourceData, 'opera', 'chrome', [
    /Chrome/g,
    'Opera',
  ]);
};

/**
 * @param {SupportStatement} originalData
 * @param {SupportStatement} sourceData
 * @returns {SupportStatement}
 */
const bumpOperaAndroid = (originalData, sourceData) => {
  return bumpGeneric(
    originalData,
    sourceData,
    'opera_android',
    'chrome_android',
    [/Chrome/g, 'Opera'],
  );
};

/**
 * @param {SupportStatement} originalData
 * @param {SupportStatement} sourceData
 * @returns {SupportStatement}
 */
const bumpSafariiOS = (originalData, sourceData) => {
  return bumpGeneric(originalData, sourceData, 'safari_ios', 'safari');
};

/**
 * @param {SupportStatement} originalData
 * @param {SupportStatement} sourceData
 * @returns {SupportStatement}
 */
const bumpSamsungInternet = (originalData, sourceData) => {
  return bumpGeneric(
    originalData,
    sourceData,
    'samsunginternet_android',
    'chrome_android',
    [/Chrome/g, 'Samsung Internet'],
  );
};

/**
 * @param {SupportStatement} originalData
 * @param {SupportStatement} sourceData
 * @returns {SupportStatement}
 */
const bumpWebView = (originalData, sourceData) => {
  let newData = copyStatement(sourceData);

  const createWebViewRange = (version) => {
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
 * @param {SupportStatement} data
 * @param {SupportStatement} originalData
 * @param {string} destination
 * @param {string} targetVersion
 */
const bumpVersion = (sourceData, originalData, destination, targetVersion) => {
  let newData = null;

  if (sourceData == null) {
    return null;
  }

  if (Array.isArray(sourceData)) {
    newData = [];
    for (let i = 0; i < sourceData.length; i++) {
      newData[i] = bumpVersion(
        sourceData[i],
        originalData,
        destination,
        targetVersion,
      );
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
        throw new Error(`Unknown target browser ${destination}!`);
    }

    newData = bumpFunction(originalData, sourceData);
  }

  if (targetVersion) {
    if (
      !isVersionAdded(newData, targetVersion) &&
      !isVersionRemoved(newData, targetVersion)
    ) {
      newData = originalData;
    }
  }

  return newData;
};

/**
 * @param {Identifier} data
 * @param {Identifier} newData
 * @param {string} rootPath
 * @param {string} browser
 * @param {string} modify
 * @param {string} targetVersion
 @ @returns {Identifier}
 */
const doSetFeature = (
  data,
  newData,
  rootPath,
  browser,
  modify,
  targetVersion,
) => {
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
    let source = getSource(browser);
    let newValue = bumpVersion(
      comp[source],
      comp[browser],
      browser,
      source,
      targetVersion,
    );
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
 * @param {string} modify
 * @param {string} targetVersion
 * @returns {Identifier}
 */
const setFeature = (data, feature, browser, modify, targetVersion) => {
  let newData = Object.assign({}, data);

  const rootPath = feature.shift();
  if (feature.length > 0 && data[rootPath].constructor == Object) {
    newData[rootPath] = setFeature(data[rootPath], feature, browser, modify);
  } else {
    if (data[rootPath].constructor == Object || Array.isArray(data[rootPath])) {
      newData = doSetFeature(
        data,
        newData,
        rootPath,
        browser,
        modify,
        targetVersion,
      );
    }
  }

  return newData;
};

/**
 * @param {Identifier} data
 * @param {string} browser
 * @param {string} modify
 * @param {string} targetVersion
 * @returns {Identifier}
 */
const setFeatureRecursive = (data, browser, modify, targetVersion) => {
  let newData = Object.assign({}, data);

  for (let i in data) {
    if (!!data[i] && typeof data[i] == 'object' && i !== '__compat') {
      newData[i] = data[i];
      if (data[i].__compat) {
        doSetFeature(data, newData, i, browser, modify, targetVersion);
      }
      setFeatureRecursive(data[i], browser, modify), targetVersion;
    }
  }

  return newData;
};

/**
 * @param {string} browser
 * @param {string} filepath
 * @param {string} modify
 * @param {string} targetVersion
 * @returns {boolean}
 */
function mirrorDataByFile(browser, filepath, modify, targetVersion) {
  let file = filepath;
  if (file.indexOf(dirname) !== 0) {
    file = path.resolve(dirname, '..', file);
  }

  if (!fs.existsSync(file)) {
    return false;
  }

  if (fs.statSync(file).isFile()) {
    if (path.extname(file) === '.json') {
      let data = JSON.parse(
        fs.readFileSync(new URL(file, import.meta.url), 'utf-8'),
      );
      let newData = setFeatureRecursive(data, browser, modify, targetVersion);

      fs.writeFileSync(file, JSON.stringify(newData, null, 2) + '\n', 'utf-8');
    }
  } else if (fs.statSync(file).isDirectory()) {
    const subFiles = fs.readdirSync(file).map((subfile) => {
      return path.join(file, subfile);
    });

    for (let subfile of subFiles) {
      mirrorDataByFile(browser, subfile, modify, targetVersion);
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
 * @param {string} modify
 * @param {string} targetVersion
 * @returns {boolean}
 */
const mirrorDataByFeature = (browser, featureIdent, modify, targetVersion) => {
  let filepath = path.resolve(dirname, '..');
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

  let data = JSON.parse(
    fs.readFileSync(new URL(filepath, import.meta.url), 'utf-8'),
  );
  let newData = setFeature(data, feature, browser, modify, targetVersion);

  fs.writeFileSync(filepath, JSON.stringify(newData, null, 2) + '\n', 'utf-8');

  return true;
};

/**
 * @param {string} browser
 * @param {string[]} feature_or_path_array
 * @param {string} modify
 * @param {string} targetVersion
 * @returns {boolean}
 */
const mirrorData = (browser, feature_or_path_array, modify, targetVersion) => {
  if (!['nonreal', 'bool', 'always'].includes(modify)) {
    console.error(
      `--modify (-m) paramter invalid!  Must be "nonreal", "bool", or "always"; got "${modify}".`,
    );
    return false;
  }

  for (const feature_or_path of feature_or_path_array) {
    let doMirror = mirrorDataByFeature;
    if (
      fs.existsSync(feature_or_path) &&
      (fs.statSync(feature_or_path).isFile() ||
        fs.statSync(feature_or_path).isDirectory())
    ) {
      doMirror = mirrorDataByFile;
    }

    doMirror(browser, feature_or_path, modify, targetVersion);
  }

  console.log(
    "Mirroring complete!  Note that results are not guaranteed to be 100% accurate.  Please review the script's output, especially notes, for any errors, and be sure to run `npm test` before submitting a pull request.",
  );

  return true;
};

if (esMain(import.meta)) {
  const { argv } = yargs(hideBin(process.argv)).command(
    '$0 <browser> [feature_or_path..]',
    'Mirror values onto a specified browser if "version_added" is true/null, based upon its parent or a specified source',
    (yargs) => {
      yargs
        .positional('browser', {
          describe: 'The destination browser',
          type: 'string',
        })
        .positional('feature_or_path', {
          describe: 'Features, files, or folders to perform mirroring for',
          type: 'array',
          default: [
            'api',
            'css',
            'html',
            'http',
            'svg',
            'javascript',
            'mathml',
            'webdriver',
            'webextensions',
          ],
        })
        .option('modify', {
          alias: 'm',
          describe:
            'Specify when to perform mirroring, whether on true/null ("nonreal", default), true/null/false ("bool"), or always ("always")',
          type: 'string',
          default: 'nonreal',
        })
        .option('target-version', {
          alias: 't',
          describe:
            "Only perform mirroring if it affects this destination browser's release",
          type: 'string',
          default: undefined,
        });
    },
  );

  mirrorData(
    argv.browser,
    argv.feature_or_path,
    argv.modify,
    argv.target_version,
  );
}

export default mirrorData;
