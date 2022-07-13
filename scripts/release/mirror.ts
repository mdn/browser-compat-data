/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import {
  BrowserName,
  SimpleSupportStatement,
  SupportStatement,
} from '../../types/types.js';
import { InternalSupportBlock } from '../../types/index.js';

type Notes = string | string[] | null;

import compareVersions from 'compare-versions';

import bcd from '../../index.js';
const { browsers } = bcd;

/**
 * @typedef {import('../types').Identifier} Identifier
 * @typedef {import('../types').SupportStatement} SupportStatement
 * @typedef {import('../types').ReleaseStatement} ReleaseStatement
 */

const matchingSafariVersions = new Map([
  ['≤4', '≤3'],
  ['1', '1'],
  ['1.1', '1'],
  ['1.2', '1'],
  ['1.3', '1'],
  ['2', '1'],
  ['3', '2'],
  ['3.1', '2'],
  ['4', '3.2'],
  ['5', '4.2'],
  ['5.1', '6'],
  ['9.1', '9.3'],
  ['10.1', '10.3'],
  ['11.1', '11.3'],
  ['12.1', '12.2'],
  ['13.1', '13.4'],
  ['14.1', '14.5'],
]);

/**
 * @param {string} targetBrowser
 * @param {string} sourceVersion
 * @returns {ReleaseStatement|boolean}
 */
export const getMatchingBrowserVersion = (
  targetBrowser: BrowserName,
  sourceVersion: string,
) => {
  const browserData = browsers[targetBrowser];

  /* c8 ignore start */
  if (!browserData.upstream) {
    // This should never be reached
    throw new Error('Browser does not have an upstream browser set.');
  }
  /* c8 ignore stop */

  if (targetBrowser === 'safari_ios') {
    // The mapping between Safari macOS and iOS releases is complicated and
    // cannot be entirely derived from the WebKit versions. After Safari 15
    // the versions have been the same, so map earlier versions manually
    // and then assume if the versions are identical it's also a match.
    const v = matchingSafariVersions.get(sourceVersion);
    if (v) {
      return v;
    }
    if (sourceVersion in browserData.releases) {
      return sourceVersion;
    }
    throw new Error(`Cannot find iOS version matching Safari ${sourceVersion}`);
  }

  const releaseKeys = Object.keys(browserData.releases);
  releaseKeys.sort(compareVersions);

  if (sourceVersion == 'preview') {
    return 'preview';
  }

  const range = sourceVersion.includes('≤');
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
 * @param {Notes?} notes1
 * @param {Notes?} notes2
 * @returns {Notes?}
 */
const combineNotes = (
  notes1: Notes | null,
  notes2: Notes | null,
): Notes | null => {
  let newNotes: string[] = [];

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
 * @param {Notes?} notes
 * @param {RegExp} regex
 * @param {string} replace
 * @param {Function} versionMapper - Receives the source browser version and returns the target browser version.
 * @returns {Notes?}
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
 * @param {SimpleSupportStatement} data
 * @returns {SimpleSupportStatement}
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
 * @param {SimpleSupportStatement} sourceData
 * @param {BrowserName} targetBrowser
 * @param {[RegExp, string]} notesRepl
 * @returns {SimpleSupportStatement}
 */
const bumpGeneric = (
  sourceData: SimpleSupportStatement,
  targetBrowser: BrowserName,
  notesRepl?: [RegExp, string],
): SimpleSupportStatement => {
  const newData: SimpleSupportStatement = copyStatement(sourceData);

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
    const newNotes = updateNotes(
      sourceData.notes,
      notesRepl[0],
      notesRepl[1],
      (v: string) => getMatchingBrowserVersion(targetBrowser, v),
    );
    if (newNotes) {
      newData.notes = newNotes;
    }
  }

  return newData;
};

/**
 * Returns true if two simple support statements are the same ignoring notes.
 *
 * Statements with flags are never considered equal because the arrays aren't
 * compared recursively. No data depends on this, it seems.
 */
const equalIgnoringNotes = (
  a: SimpleSupportStatement,
  b: SimpleSupportStatement,
): boolean => {
  for (const key in a) {
    if (key !== 'notes' && a[key] !== b[key]) {
      return false;
    }
  }
  for (const key in b) {
    if (key !== 'notes' && !(key in a)) {
      return false;
    }
  }
  return true;
};

/**
 * Return a new support statement based on mapping versions from the source
 * browser to the destination browser, and dropping or combining statements
 * that don't apply to the destination browser.
 *
 * This works by mapping each simple support statement, dropping ones that don't
 * apply, for example if support was added and removed before the destination
 * browser's first release. The mapping can result in multiple statements with
 * the same versions, prefix information, etc. In that case, statements are
 * combined, including their notes.
 *
 * @param {SupportStatement} sourceData The original support statement
 * @param {BrowserName} destination The browser to derive support for
 *
 * @returns {SupportStatement} The derived (mirrored) support statement
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

      default: {
        const newerData: SimpleSupportStatement[] = [];
        let prevData: SimpleSupportStatement | null = null;
        for (const data of newData) {
          if (prevData && equalIgnoringNotes(prevData, data)) {
            const newNotes = combineNotes(
              prevData.notes || null,
              data.notes || null,
            );
            if (newNotes) prevData.notes = newNotes;
          } else {
            newerData.push(data);
            prevData = data;
          }
        }
        return newerData;
      }
    }
  }

  let notesRepl: [RegExp, string] | undefined;
  if (destination === 'edge') {
    notesRepl = [/Chrome/g, 'Edge'];
  } else if (destination.includes('opera')) {
    notesRepl = [/Chrome/g, 'Opera'];
  } else if (destination === 'samsunginternet_android') {
    notesRepl = [/Chrome/g, 'Samsung Internet'];
  }

  if (sourceData.flags && !browsers[destination].accepts_flags) {
    // Remove flag data if the target browser doesn't accept flags.
    return { version_added: false };
  }

  const newData = bumpGeneric(sourceData, destination, notesRepl);

  if (newData.version_added === false && sourceData.version_added !== false) {
    // If version_added mapped to false because there's no destination release
    // yet, no notes or other details apply.
    return { version_added: false };
  }

  if (newData.version_added === newData.version_removed) {
    // If version_added and version_removed are the same, the feature is
    // unsupported.
    return { version_added: false };
  }

  return newData;
};

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
