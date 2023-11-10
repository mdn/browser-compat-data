/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { compareVersions, compare } from 'compare-versions';

import bcd from '../../index.js';
import {
  BrowserName,
  SimpleSupportStatement,
  SupportStatement,
} from '../../types/types.js';
import { InternalSupportBlock } from '../../types/index.js';

const { browsers } = bcd;

type Notes = string | string[] | null;

/**
 * @typedef {import('../types').Identifier} Identifier
 * @typedef {import('../types').SupportStatement} SupportStatement
 * @typedef {import('../types').ReleaseStatement} ReleaseStatement
 */

const matchingSafariVersions = new Map([
  ['1', '1'],
  ['1.1', '1'],
  ['1.2', '1'],
  ['1.3', '1'],
  ['2', '1'],
  ['3', '2'],
  ['3.1', '2'],
  ['4', '3.2'],
  ['5', '4.2'],
  ['5.1', '5'],
  ['9.1', '9.3'],
  ['10.1', '10.3'],
  ['11.1', '11.3'],
  ['12.1', '12.2'],
  ['13.1', '13.4'],
  ['14.1', '14.5'],
]);

/**
 * Convert a version number to the matching version of the target browser
 * @param {string} targetBrowser The browser to mirror to
 * @param {string} sourceVersion The version from the source browser
 * @returns {ReleaseStatement|boolean} The matching browser version
 */
export const getMatchingBrowserVersion = (
  targetBrowser: BrowserName,
  sourceVersion: string,
) => {
  const browserData = browsers[targetBrowser];
  const range = sourceVersion.includes('≤');

  /* c8 ignore start */
  if (!browserData.upstream) {
    // This should never be reached
    throw new Error('Browser does not have an upstream browser set.');
  }
  /* c8 ignore stop */

  if (sourceVersion == 'preview') {
    // If target browser doesn't have a preview version, map preview -> false
    return browserData.preview_name ? 'preview' : false;
  }

  if (targetBrowser === 'safari_ios') {
    // The mapping between Safari macOS and iOS releases is complicated and
    // cannot be entirely derived from the WebKit versions. After Safari 15
    // the versions have been the same, so map earlier versions manually
    // and then assume if the versions are identical it's also a match.
    const v = matchingSafariVersions.get(sourceVersion.replace('≤', ''));
    if (v) {
      return (range ? '≤' : '') + v;
    }
    if (sourceVersion.replace('≤', '') in browserData.releases) {
      return (range ? '≤' : '') + sourceVersion;
    }
    throw new Error(`Cannot find iOS version matching Safari ${sourceVersion}`);
  }

  const releaseKeys = Object.keys(browserData.releases);
  releaseKeys.sort(compareVersions);

  const sourceRelease =
    browsers[browserData.upstream].releases[sourceVersion.replace('≤', '')];

  if (!sourceRelease) {
    throw new Error(
      `Could not find source release "${browserData.upstream} ${sourceVersion}"!`,
    );
  }

  for (const r of releaseKeys) {
    const release = browserData.releases[r];
    if (
      ['chrome', 'chrome_android'].includes(browserData.upstream) &&
      targetBrowser !== 'chrome_android' &&
      release.engine == 'Blink' &&
      sourceRelease.engine == 'WebKit'
    ) {
      // Handle mirroring for Chromium forks when upstream version is pre-Blink
      return range ? `≤${r}` : r;
    } else if (
      release.engine == sourceRelease.engine &&
      release.engine_version &&
      sourceRelease.engine_version &&
      compare(release.engine_version, sourceRelease.engine_version, '>=')
    ) {
      return r;
    }
  }

  return false;
};

/**
 * Update the notes by mirroring the version and replacing the browser name
 * @param {Notes?} notes The notes to update
 * @param {RegExp} regex The regex to check and search
 * @param {string} replace The text to replace with
 * @param {Function} versionMapper - Receives the source browser version and returns the target browser version.
 * @returns {Notes?} The notes with replacement performed
 */
const updateNotes = (
  notes: Notes | null,
  regex: RegExp,
  replace: string,
  versionMapper: (v: string) => string | false,
): Notes | null => {
  if (!notes) {
    return null;
  }

  if (Array.isArray(notes)) {
    return notes.map((note) =>
      updateNotes(note, regex, replace, versionMapper),
    ) as Notes;
  }

  return notes
    .replace(regex, replace)
    .replace(
      new RegExp(`(${replace}|version)\\s(\\d+)`, 'g'),
      (match, p1, p2) => p1 + ' ' + versionMapper(p2),
    );
};

/**
 * Copy a support statement
 * @param {SimpleSupportStatement} data The data to copied
 * @returns {SimpleSupportStatement} The new copied object
 */
const copyStatement = (
  data: SimpleSupportStatement,
): SimpleSupportStatement => {
  const newData: Partial<SimpleSupportStatement> = {};
  for (const i in data) {
    newData[i] = data[i];
  }

  return newData as SimpleSupportStatement;
};

/**
 * Perform mirroring of data
 * @param {SupportStatement} sourceData The data to mirror from
 * @param {BrowserName} destination The destination browser
 * @returns {SupportStatement} The mirrored support statement
 */
export const bumpSupport = (
  sourceData: SupportStatement,
  destination: BrowserName,
): SupportStatement => {
  if (Array.isArray(sourceData)) {
    // Bump the individual support statements and filter out results with a
    // falsy version_added. It's not possible for sourceData to have a falsy
    // version_added (enforced by the lint) so there can be no notes or similar
    // to preserve from such statements.
    const newData = sourceData
      .map((data) => bumpSupport(data, destination) as SimpleSupportStatement)
      .filter((item) => item.version_added);

    switch (newData.length) {
      case 0:
        return { version_added: false };

      case 1:
        return newData[0];

      default:
        return newData;
    }
  }

  let notesRepl: [RegExp, string] | undefined;
  if (destination === 'edge') {
    notesRepl = [/(Google )?Chrome(?!OS)/g, 'Edge'];
  } else if (destination.includes('opera')) {
    notesRepl = [/(Google )?Chrome(?!OS)/g, 'Opera'];
  } else if (destination === 'samsunginternet_android') {
    notesRepl = [/(Google )?Chrome(?!OS)/g, 'Samsung Internet'];
  }

  const newData: SimpleSupportStatement = copyStatement(sourceData);

  if (typeof sourceData.version_added === 'string') {
    newData.version_added = getMatchingBrowserVersion(
      destination,
      sourceData.version_added,
    );
  }

  if (
    sourceData.version_removed &&
    typeof sourceData.version_removed === 'string'
  ) {
    newData.version_removed = getMatchingBrowserVersion(
      destination,
      sourceData.version_removed,
    );
  }

  if (notesRepl && sourceData.notes) {
    const newNotes = updateNotes(
      sourceData.notes,
      notesRepl[0],
      notesRepl[1],
      (v: string) => getMatchingBrowserVersion(destination, v),
    );
    if (newNotes) {
      newData.notes = newNotes;
    }
  }

  if (!browsers[destination].accepts_flags && newData.flags) {
    // Remove flag data if the target browser doesn't accept flags
    return { version_added: false };
  }

  if (newData.version_added === newData.version_removed) {
    // If version_added and version_removed are the same, feature is unsupported
    return { version_added: false };
  }

  return newData;
};

/**
 * Perform mirroring for the target browser
 * @param {BrowserName} destination The browser to mirror to
 * @param {InternalSupportBlock} data The data to mirror with
 * @returns {SupportStatement} The mirrored data
 */
const mirrorSupport = (
  destination: BrowserName,
  data: InternalSupportBlock,
): SupportStatement => {
  const upstream: BrowserName | undefined = browsers[destination].upstream;
  if (!upstream) {
    throw new Error(
      `Upstream is not defined for ${destination}, cannot mirror!`,
    );
  }

  let upstreamData = data[upstream] || null;

  if (!upstreamData) {
    throw new Error(
      `The data for ${upstream} is not defined for mirroring to ${destination}, cannot mirror!`,
    );
  }

  if (upstreamData === 'mirror') {
    // Perform mirroring upstream if needed
    upstreamData = mirrorSupport(upstream, data);
  }

  return bumpSupport(upstreamData, destination);
};

export default mirrorSupport;
