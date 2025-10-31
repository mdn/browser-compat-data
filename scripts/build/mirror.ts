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

type Notes = string | [string, string, ...string[]] | null;

const OS_NOTES = [
  'Available on macOS and Windows only.',
  'Available only on macOS.',
  'ChromeOS only',
  'ChromeOS and Windows',
  'Fully supported on Windows and Linux, no support on ChromeOS.',
  'Linux support is not enabled by default.',
  'Not supported on macOS.',
  'Not supported on Windows.',
  'Only on macOS and Windows.',
  'Only on Windows.',
  'Only supported on ChromeOS',
  'Only supported on macOS.',
  'Only supported on Windows.',
  'Only works on macOS.',
  'Supported on ChromeOS, macOS, and Windows only.',
  'Supported on ChromeOS and macOS only.',
  'Supported on macOS only.',
  'Supported on macOS Catalina 10.15.1+, Windows, and ChromeOS. Not yet supported on Linux.',
  'Supported on Windows only, in all contexts except for service workers.',
  'Supported only on macOS 10.12 (Sierra) and later.',
  'This cursor is only supported on macOS and Linux.',
].map((s) => s.toLowerCase());

/**
 * Check if a note indicates OS-specific limitations.
 * @param notes A single notes string from a support statement
 * @returns True if the notes indicate OS-specific limitations
 */
export const isOSLimitation = (notes: string): boolean => {
  return OS_NOTES.includes(notes.toLowerCase());
};

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
 * @param targetBrowser The browser to mirror to
 * @param sourceVersion The version from the source browser
 * @returns The matching browser version, or `false` if no match is found
 * @throws An error when the downstream browser has no upstream
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
      return sourceVersion;
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

  let previousReleaseEngine;

  for (const r of releaseKeys) {
    const release = browserData.releases[r];

    // Add a range delimiter if there were previous releases of the downstream browser that used the same engine before this one (ex. after Edge 79)
    const rangeDelimiter =
      range && previousReleaseEngine == sourceRelease.engine;

    // Handle mirroring for Chromium forks when upstream version is pre-Blink
    const isChromeWebKitToBlink =
      ['chrome', 'chrome_android'].includes(browserData.upstream) &&
      targetBrowser !== 'chrome_android' &&
      release.engine == 'Blink' &&
      sourceRelease.engine == 'WebKit';

    const isMatchingVersion =
      release.engine == sourceRelease.engine &&
      release.engine_version &&
      sourceRelease.engine_version &&
      compare(release.engine_version, sourceRelease.engine_version, '>=');

    if (isChromeWebKitToBlink || isMatchingVersion) {
      return rangeDelimiter ? `≤${r}` : r;
    }

    previousReleaseEngine = release.engine;
  }

  return false;
};

/**
 * Update the notes by mirroring the version and replacing the browser name
 * @param notes The notes to update
 * @param regex The regex to check and search
 * @param replace The text to replace with
 * @param versionMapper - Receives the source browser version and returns the target browser version.
 * @returns The notes with replacement performed
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
 * @param data The data to copied
 * @returns The new copied object
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
 * @param sourceData The data to mirror from
 * @param destination The destination browser
 * @returns The mirrored support statement
 */
export const bumpSupport = (
  sourceData: SupportStatement,
  sourceBrowser: BrowserName,
  destination: BrowserName,
): SupportStatement => {
  if (Array.isArray(sourceData)) {
    // Bump the individual support statements and filter out results with a
    // falsy version_added. It's not possible for sourceData to have a falsy
    // version_added (enforced by the lint) so there can be no notes or similar
    // to preserve from such statements.
    const newData = sourceData
      .map(
        (data) =>
          bumpSupport(
            data,
            sourceBrowser,
            destination,
          ) as SimpleSupportStatement,
      )
      .filter((item) => item.version_added);

    switch (newData.length) {
      case 0:
        return { version_added: false };

      case 1:
        return newData[0];

      default:
        return newData as [
          SimpleSupportStatement,
          SimpleSupportStatement,
          ...SimpleSupportStatement[],
        ];
    }
  }

  const newData: SimpleSupportStatement = copyStatement(sourceData);

  if (
    browsers[sourceBrowser].type === 'desktop' &&
    browsers[destination].type === 'mobile' &&
    sourceData.partial_implementation
  ) {
    const notes = Array.isArray(sourceData.notes)
      ? sourceData.notes
      : sourceData.notes
        ? [sourceData.notes]
        : [];
    const [firstNote, secondNote, ...otherNotes] = notes.filter(
      (notes) => !isOSLimitation(notes),
    );
    if (!firstNote) {
      // Ignore OS limitation.
      delete newData.partial_implementation;
      delete newData.notes;
    } else if (!secondNote) {
      newData.notes = firstNote;
    } else {
      newData.notes = [firstNote, secondNote, ...otherNotes];
    }
  }

  if (!browsers[destination].accepts_flags && newData.flags) {
    // Remove flag data if the target browser doesn't accept flags
    return { version_added: false };
  }

  if (typeof sourceData.version_added === 'string') {
    newData.version_added = getMatchingBrowserVersion(
      destination,
      sourceData.version_added,
    );
  }

  if (newData.version_added === false && sourceData.version_added !== false) {
    // If the feature is added in an upstream version newer than available in the downstream browser, don't copy notes, etc.
    return { version_added: false };
  }

  if (
    sourceData.version_removed &&
    typeof sourceData.version_removed === 'string'
  ) {
    const versionRemoved = getMatchingBrowserVersion(
      destination,
      sourceData.version_removed,
    );

    if (typeof versionRemoved === 'string') {
      newData.version_removed = versionRemoved;
    } else {
      // Ensure that version_removed is not present if it's not applicable, such as when the upstream browser removed the feature in a newer release than a matching downstream browser
      delete newData.version_removed;
    }
  }

  if (newData.version_added === newData.version_removed) {
    // If version_added and version_removed are the same, feature is unsupported
    return { version_added: false };
  }

  // Only process notes if they weren't already removed (e.g., for OS-specific limitations)
  if (sourceData.notes && newData.notes !== undefined) {
    const sourceBrowserName =
      sourceBrowser === 'chrome'
        ? '(Google )?Chrome'
        : `(${browsers[sourceBrowser].name})`;
    const newNotes = updateNotes(
      sourceData.notes,
      new RegExp(`\\b${sourceBrowserName}\\b`, 'g'),
      browsers[destination].name,
      (v: string) => getMatchingBrowserVersion(destination, v),
    );
    if (newNotes) {
      newData.notes = newNotes;
    }
  }

  return newData;
};

/**
 * Perform mirroring for the target browser
 * @param destination The browser to mirror to
 * @param data The data to mirror with
 * @returns The mirrored data
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

  return bumpSupport(upstreamData, upstream, destination);
};

export default mirrorSupport;
