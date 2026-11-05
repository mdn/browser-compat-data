/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import stringify from 'fast-json-stable-stringify';
import { compareVersions, compare } from 'compare-versions';

import bcd from '../../index.js';
import compareStatements from '../lib/compare-statements.js';

/**
 * @import { BrowserName, InternalSimpleSupportStatement, InternalSupportStatement } from '../../types/index.js'
 * @import { InternalSupportBlock } from '../../types/index.js'
 */

/**
 * @typedef {string | [string, string, ...string[]] | null} Notes
 */

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
 * @param {string} notes A single notes string from a support statement
 * @returns {boolean} True if the notes indicate OS-specific limitations
 */
export const isOSLimitation = (notes) => OS_NOTES.includes(notes.toLowerCase());

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
 * @param {BrowserName} targetBrowser The browser to mirror to
 * @param {string} sourceVersion The version from the source browser
 * @returns {string | false} The matching browser version, or `false` if no match is found
 * @throws {Error} An error when the downstream browser has no upstream
 */
export const getMatchingBrowserVersion = (targetBrowser, sourceVersion) => {
  const browserData = bcd.browsers[targetBrowser];
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
    bcd.browsers[browserData.upstream].releases[sourceVersion.replace('≤', '')];

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
 * @param {Notes | null} notes The notes to update
 * @param {RegExp} regex The regex to check and search
 * @param {string} replace The text to replace with
 * @param {(string) => (string | false)} versionMapper - Receives the source browser version and returns the target browser version.
 * @returns {Notes | null} The notes with replacement performed
 */
export const updateNotes = (notes, regex, replace, versionMapper) => {
  if (!notes) {
    return null;
  }

  if (Array.isArray(notes)) {
    const mapped = notes
      .map((note) => updateNotes(note, regex, replace, versionMapper))
      .filter(Boolean);

    if (mapped.length === 0) {
      return null;
    }

    if (mapped.length === 1) {
      return /** @type {Notes} */ (mapped[0]);
    }

    return /** @type {Notes} */ (mapped);
  }

  let hasUnmappedVersion = false;
  const result = notes
    .replace(regex, replace)
    .replace(
      new RegExp(`(${replace}|version)\\s(\\d+)`, 'g'),
      (match, p1, p2) => {
        const mapped = versionMapper(p2);
        if (mapped === false) {
          hasUnmappedVersion = true;
          return match;
        }
        return p1 + ' ' + mapped;
      },
    );

  return hasUnmappedVersion ? null : result;
};

/**
 * Copy a support statement
 * @param {InternalSimpleSupportStatement} data The data to copied
 * @returns {InternalSimpleSupportStatement} The new copied object
 */
const copyStatement = (data) => {
  /** @type {Partial<InternalSimpleSupportStatement>} */
  const newData = {};
  for (const i in data) {
    newData[i] = data[i];
  }

  return /** @type {InternalSimpleSupportStatement} */ (newData);
};

/**
 * Perform mirroring of data
 * @param {InternalSupportStatement} sourceData The data to mirror from
 * @param {BrowserName} sourceBrowser The source browser
 * @param {BrowserName} destination The destination browser
 * @returns {InternalSupportStatement} The mirrored support statement
 */
export const bumpSupport = (sourceData, sourceBrowser, destination) => {
  if (sourceData === 'mirror') {
    // Callers must resolve "mirror" before calling bumpSupport.
    throw new Error(
      `Cannot bump unresolved 'mirror' support statement (${sourceBrowser} → ${destination})`,
    );
  }

  if (Array.isArray(sourceData)) {
    // Bump the individual support statements and filter out results with a
    // falsy version_added. It's not possible for sourceData to have a falsy
    // version_added (enforced by the lint) so there can be no notes or similar
    // to preserve from such statements.
    const newData = sourceData
      .map(
        (data) =>
          /** @type {InternalSimpleSupportStatement} */ (
            bumpSupport(data, sourceBrowser, destination)
          ),
      )
      .filter((item) => item.version_added);

    switch (newData.length) {
      case 0:
        return { version_added: false };

      case 1:
        return newData[0];

      default:
        return /** @type {[InternalSimpleSupportStatement, InternalSimpleSupportStatement, ...InternalSimpleSupportStatement[]]} */ (
          newData
        );
    }
  }

  const newData = copyStatement(sourceData);

  if (
    bcd.browsers[sourceBrowser].type === 'desktop' &&
    bcd.browsers[destination].type === 'mobile' &&
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

  if (!bcd.browsers[destination].accepts_flags && newData.flags) {
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
        : `(${bcd.browsers[sourceBrowser].name})`;
    const newNotes = updateNotes(
      sourceData.notes,
      new RegExp(`\\b${sourceBrowserName}\\b`, 'g'),
      bcd.browsers[destination].name,
      (v) => getMatchingBrowserVersion(destination, v),
    );
    if (newNotes) {
      newData.notes = newNotes;
    } else {
      delete newData.notes;
    }
  }

  return newData;
};

/**
 * Get the first release of a browser that uses the Blink engine
 * @param {BrowserName} browser The browser to check
 * @returns {string | undefined} The first Blink release, if any
 */
export const getFirstBlinkRelease = (browser) => {
  const releases = bcd.browsers[browser].releases;
  return Object.keys(releases)
    .sort(compareVersions)
    .find((r) => releases[r].engine === 'Blink');
};

/**
 * Remove the version range from a support statement
 * @param {InternalSimpleSupportStatement} statement The statement to strip
 * @returns {Partial<InternalSimpleSupportStatement>} The remaining properties
 */
const withoutRange = (statement) => {
  /** @type {Partial<InternalSimpleSupportStatement>} */
  const rest = { ...statement };
  delete rest.version_added;
  delete rest.version_removed;
  return rest;
};

/** Browsers that honour the internal `mirror` flag and split legacy statements */
export const LEGACY_SPLIT_BROWSERS = ['edge'];

/**
 * Check whether a statement is a numeric version before the first Blink release
 * @param {InternalSimpleSupportStatement} statement The statement to check
 * @param {string} switchVersion The first Blink release of the browser
 * @returns {boolean} Whether the statement only covers the legacy range
 */
const isLegacyStatement = (statement, switchVersion) =>
  typeof statement.version_added === 'string' &&
  /^≤?\d+(\.\d+)*$/.test(statement.version_added) &&
  compareVersions(statement.version_added.replace('≤', ''), switchVersion) < 0;

/**
 * Check whether a support block consists only of statements from before the
 * first Blink release, and has not opted out with `mirror: false`
 * @param {BrowserName} destination The browser the block belongs to
 * @param {InternalSupportBlock} data The support block
 * @returns {boolean} Whether the legacy range should be split-mirrored by default
 */
export const isImplicitLegacyMirror = (destination, data) => {
  if (!LEGACY_SPLIT_BROWSERS.includes(destination)) {
    return false;
  }
  const switchVersion = getFirstBlinkRelease(destination);
  if (!switchVersion) {
    return false;
  }
  return [data[destination]]
    .flat()
    .every(
      (statement) =>
        typeof statement === 'object' &&
        statement.mirror !== false &&
        isLegacyStatement(statement, switchVersion),
    );
};

/**
 * Check whether a support block needs legacy split-mirroring, either by
 * default or through an explicit `mirror: true`
 * @param {BrowserName} destination The browser the block belongs to
 * @param {InternalSupportBlock} data The support block
 * @returns {boolean} Whether the block needs split-mirroring
 */
export const usesLegacyMirror = (destination, data) => {
  if (!LEGACY_SPLIT_BROWSERS.includes(destination)) {
    return false;
  }
  return (
    [data[destination]]
      .flat()
      .some(
        (statement) =>
          typeof statement === 'object' && statement.mirror === true,
      ) || isImplicitLegacyMirror(destination, data)
  );
};

/**
 * Remove the internal `mirror` flag from a support block without splitting it
 * @param {InternalSupportStatement} supportData The support data to clean
 * @returns {InternalSupportStatement} The support data without the flag
 */
export const withoutMirrorFlag = (supportData) => {
  const statements = /** @type {InternalSimpleSupportStatement[]} */ (
    [supportData].flat()
  ).map((statement) => {
    const copy = { ...statement };
    delete copy.mirror;
    return copy;
  });
  return /** @type {InternalSupportStatement} */ (
    statements.length === 1 ? statements[0] : statements
  );
};

/**
 * Merge statements of the legacy range (marked `mirror: true`) with mirrored
 * upstream data for later releases. Statements marked `mirror: true` only
 * cover releases before the first Blink release of the destination browser.
 * @param {BrowserName} destination The browser to resolve statements for
 * @param {InternalSupportBlock} data The support block containing the statements
 * @returns {InternalSupportStatement} The resolved support statement
 */
export const mirrorLegacyStatements = (destination, data) => {
  const statements = /** @type {InternalSimpleSupportStatement[]} */ (
    [data[destination]].flat()
  );
  const switchVersion = getFirstBlinkRelease(destination);
  if (!switchVersion) {
    throw new Error(`${destination} has no Blink release to mirror from.`);
  }

  /** @type {InternalSimpleSupportStatement[]} */
  const legacy = [];
  /** @type {InternalSimpleSupportStatement[]} */
  const others = [];

  const implicit = isImplicitLegacyMirror(destination, data);
  for (const { mirror, ...statement } of statements) {
    if (mirror !== true && !implicit) {
      others.push(statement);
      continue;
    }
    if (!isLegacyStatement(statement, switchVersion)) {
      throw new Error(
        `Statement for ${destination} marked as \`mirror: true\` must be added before ${destination} ${switchVersion}`,
      );
    }
    const endsBeforeSwitch =
      statement.version_removed &&
      compareVersions(
        statement.version_removed.replace('≤', ''),
        switchVersion,
      ) < 0;
    legacy.push({
      ...statement,
      version_removed: endsBeforeSwitch
        ? statement.version_removed
        : switchVersion,
    });
  }

  if (legacy.length === 0) {
    return /** @type {InternalSupportStatement} */ (
      others.length === 1 ? others[0] : others
    );
  }

  for (const statement of others) {
    if (
      statement.version_added !== false &&
      !isLegacyStatement(statement, switchVersion)
    ) {
      throw new Error(
        `${destination} statements marked \`mirror: true\` cannot be combined with statements from ${destination} ${switchVersion} onwards`,
      );
    }
  }

  /** @type {InternalSimpleSupportStatement[]} */
  const mirrored = [];
  const upstreamData = /** @type {InternalSimpleSupportStatement[]} */ (
    [mirrorSupport(destination, data)].flat()
  );
  for (const statement of upstreamData) {
    if (statement.version_added === false) {
      continue;
    }
    if (
      typeof statement.version_added === 'string' &&
      compareVersions(statement.version_added.replace('≤', ''), switchVersion) <
        0
    ) {
      throw new Error(
        `Mirrored data for ${destination} starts before ${destination} ${switchVersion}`,
      );
    }
    mirrored.push(statement);
  }

  // Join a legacy statement with the mirrored statement that starts exactly where it ends, if nothing else differs
  const merged = legacy.map((legacyStatement) => {
    const index = mirrored.findIndex(
      (m) =>
        m.version_added === legacyStatement.version_removed &&
        stringify(withoutRange(m)) === stringify(withoutRange(legacyStatement)),
    );
    if (index === -1) {
      return legacyStatement;
    }
    const [continuation] = mirrored.splice(index, 1);
    // Copy in place so the published key order matches the source
    const combined = { ...legacyStatement };
    if (continuation.version_removed) {
      combined.version_removed = continuation.version_removed;
    } else {
      delete combined.version_removed;
    }
    return combined;
  });

  const result = [...mirrored, ...merged, ...others].sort(compareStatements);
  return /** @type {InternalSupportStatement} */ (
    result.length === 1 ? result[0] : result
  );
};

/**
 * Perform mirroring for the target browser
 * @param {BrowserName} destination The browser to mirror to
 * @param {InternalSupportBlock} data The data to mirror with
 * @returns {InternalSupportStatement} The mirrored data
 */
const mirrorSupport = (destination, data) => {
  /** @type {BrowserName | undefined} */
  const upstream = bcd.browsers[destination].upstream;
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
