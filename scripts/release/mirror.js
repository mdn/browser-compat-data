/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import compareVersions from 'compare-versions';

import bcd from '../../index.js';
const { browsers } = bcd;

/**
 * @typedef {import('../types').Identifier} Identifier
 * @typedef {import('../types').SupportStatement} SupportStatement
 * @typedef {import('../types').ReleaseStatement} ReleaseStatement
 */

/**
 * @param {string} targetBrowser
 * @param {string} sourceVersion
 * @returns {ReleaseStatement|boolean}
 */
export const getMatchingBrowserVersion = (targetBrowser, sourceVersion) => {
  const browserData = browsers[targetBrowser];
  const releaseKeys = Object.keys(browserData.releases);
  releaseKeys.sort(compareVersions);

  const range = sourceVersion.includes('≤');
  const sourceRelease =
    browsers[browserData.upstream].releases[sourceVersion.replace('≤', '')];

  for (const r of releaseKeys) {
    const release = browserData.releases[r];
    if (
      ['opera', 'opera_android', 'samsunginternet_android'].includes(
        targetBrowser,
      ) &&
      release.engine == 'Blink' &&
      sourceRelease.engine == 'WebKit'
    ) {
      return range ? `≤${r}` : r;
    } else if (release.engine == sourceRelease.engine) {
      if (
        ['beta', 'nightly'].includes(release.status) &&
        release.status == sourceRelease.status
      ) {
        return r;
      } else if (
        release.engine_version &&
        sourceRelease.engine_version &&
        compareVersions.compare(
          release.engine_version,
          sourceRelease.engine_version,
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

  newNotes = newNotes.filter((item, pos) => newNotes.indexOf(item) == pos);

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
 * @param {Function} versionMapper - Receives the source browser version and returns the target browser version.
 * @returns {string|string[]|null}
 */
const updateNotes = (notes, regex, replace, versionMapper) => {
  if (!notes) {
    return null;
  }

  if (Array.isArray(notes)) {
    return notes.map((note) =>
      updateNotes(note, regex, replace, versionMapper),
    );
  }

  return notes
    .replace(regex, replace)
    .replace(
      new RegExp(`(?:${replace}|version)\\s(\\d+)`),
      (match, p1) => replace + ' ' + versionMapper(p1),
    );
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
 * @param {...SupportStatement} data
 * @returns {SupportStatement}
 */
const combineStatements = (...data) => {
  const ignoredKeys = ['version_added', 'notes'];

  const flattenedData = data.flat(2);
  const sections = {};
  let newData = [];

  for (const d of flattenedData) {
    const key = Object.keys(d)
      .filter((k) => !ignoredKeys.includes(k))
      .join('');
    if (!(key in sections)) sections[key] = [];
    sections[key].push(d);
  }

  for (const k of Object.keys(sections)) {
    const currentStatement = sections[k][0];

    if (sections[k].length == 1) {
      newData.push(currentStatement);
      continue;
    }

    for (const i in sections[k]) {
      if (i === 0) continue;
      const newStatement = sections[k][i];

      const currentVA = currentStatement.version_added;
      const newVA = newStatement.version_added;

      if (newVA === false) {
        // Ignore statements with version_added being false
        continue;
      } else if (typeof newVA === 'string') {
        if (
          typeof currentVA !== 'string' ||
          compareVersions.compare(
            currentVA.replace('≤', ''),
            newVA.replace('≤', ''),
            '>',
          )
        ) {
          currentStatement.version_added = newVA;
        }
      }

      const newNotes = combineNotes(currentStatement.notes, newStatement.notes);
      if (newNotes) currentStatement.notes = newNotes;
    }

    if ('notes' in currentStatement && !currentStatement.notes) {
      delete currentStatement.notes;
    }
    newData.push(currentStatement);
  }

  if (newData.length === 1) {
    return newData[0];
  }

  // Remove duplicate statements and statements that are only version_added = false
  newData = newData
    .filter((item, pos) => newData.indexOf(item) == pos)
    .filter((item) => item.version_added);

  switch (newData.length) {
    case 0:
      return { version_added: false };

    case 1:
      return newData[0];

    default:
      return newData;
  }
};

/**
 * @param {SupportStatement} sourceData
 * @param {string} targetBrowser
 * @param {Array.<RegExp, string>} notesRepl
 * @returns {SupportStatement}
 */
const bumpGeneric = (sourceData, targetBrowser, notesRepl) => {
  let newData = copyStatement(sourceData);

  if (typeof sourceData.version_added === 'string') {
    newData.version_added = getMatchingBrowserVersion(
      targetBrowser,
      sourceData.version_added,
    );
  }

  if (
    sourceData.version_removed &&
    typeof sourceData.version_removed === 'string'
  ) {
    newData.version_removed = getMatchingBrowserVersion(
      targetBrowser,
      sourceData.version_removed,
    );
  }

  if (notesRepl && sourceData.notes) {
    newData.notes = updateNotes(
      sourceData.notes,
      notesRepl[0],
      notesRepl[1],
      (v) => getMatchingBrowserVersion(targetBrowser, v),
    );
  }

  return newData;
};

/**
 * @param {SupportStatement} sourceData
 * @returns {SupportStatement}
 */
const bumpEdge = (sourceData) => {
  if (
    typeof sourceData.version_removed === 'string' &&
    compareVersions.compare(sourceData.version_removed, '79', '<=')
  ) {
    // If this feature was removed before Chrome 79, it's not present in Chromium Edge
    return { version_added: false };
  }

  return bumpGeneric(sourceData, 'edge', [/Chrome/g, 'Edge']);
};

/**
 * @param {SupportStatement} sourceData
 * @returns {SupportStatement}
 */
const bumpWebView = (sourceData) => {
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

  if (sourceData.notes) {
    newData.notes = updateNotes(
      sourceData.notes,
      /Chrome/g,
      'WebView',
      createWebViewRange,
    );
  }

  return newData;
};

/**
 * @param {SupportStatement} data
 * @param {string} destination
 */
export const bumpVersion = (sourceData, destination) => {
  let newData = null;

  if (sourceData == null) {
    return null;
  }

  if (Array.isArray(sourceData)) {
    return combineStatements(
      ...sourceData.map((data) => bumpVersion(data, destination)),
    );
  }

  if (destination === 'edge') {
    newData = bumpEdge(sourceData);
  } else if (destination === 'webview_android') {
    newData = bumpWebView(sourceData);
  } else {
    let notesRepl;
    if (destination.includes('opera')) {
      notesRepl = [/Chrome/g, 'Opera'];
    } else if (destination === 'samsunginternet_android') {
      notesRepl = [/Chrome/g, 'Samsung Internet'];
    }

    newData = bumpGeneric(sourceData, destination, notesRepl);
  }

  if (!browsers[destination].accepts_flags && newData.flags) {
    // Remove flag data if the target browser doesn't accept flags
    return { version_added: false };
  }

  return newData;
};

const bumpData = (destination, data) => {
  const upstream = browsers[destination].upstream;
  return bumpVersion(data[upstream], destination);
};

export default bumpData;
