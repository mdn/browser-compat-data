/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/**
 * @typedef {object} WorkerdPackageMetadata
 * @property {string} version The published npm package version.
 * @property {string} [gitHead] The source commit published to npm.
 * @property {string} [deprecated] The npm deprecation message, if any.
 */

/** @typedef {{ versions: Record<string, WorkerdPackageMetadata>, "dist-tags": { latest?: string } }} WorkerdRegistryMetadata */

/**
 * @typedef {object} WorkerdReleaseMapEntry
 * @property {string} packageVersion The published npm package version.
 * @property {string} [gitHead] The source commit published to npm.
 * @property {string} releaseVersion The value from release-version.txt.
 * @property {string} maximumCompatibilityDate The newest compatibility date supported by the binary.
 * @property {string} bcdCheckpoint The BCD dotted-date checkpoint.
 * @property {string} [v8Version] The pinned V8 version from build/deps/v8.MODULE.bazel.
 * @property {string} [v8Tarball] The V8 source tarball URL, if parsed.
 * @property {string[]} sourceRefs The source refs tried for this package.
 */

import fs from 'node:fs/promises';
import { styleText } from 'node:util';

import { compareVersions } from 'compare-versions';

const WORKERD_NPM_API = 'https://registry.npmjs.org/workerd';
const WORKERD_RAW_BASE = 'https://raw.githubusercontent.com/cloudflare/workerd';
const USER_AGENT =
  'MDN-Browser-Release-Update-Bot/1.0 (+https://developer.mozilla.org/)';

const dashedDatePattern = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Converts a workerd compatibility date to a BCD version key.
 * @param {string} date A `YYYY-MM-DD` date.
 * @returns {string} The BCD dotted date key.
 */
const toDottedDate = (date) => date.replaceAll('-', '.');

/**
 * Fetches JSON with a consistent release updater user agent.
 * @param {string} url The URL to fetch.
 * @returns {Promise<WorkerdRegistryMetadata>} The parsed registry metadata.
 */
const fetchRegistryMetadata = async (url) => {
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Fetch failed for ${url}: HTTP ${res.status}`);
  }

  return /** @type {WorkerdRegistryMetadata} */ (await res.json());
};

/**
 * Fetches text with a consistent release updater user agent.
 * @param {string} url The URL to fetch.
 * @returns {Promise<string>} The response text.
 */
const fetchText = async (url) => {
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/plain',
    },
  });

  if (!res.ok) {
    throw new Error(`Fetch failed for ${url}: HTTP ${res.status}`);
  }

  return await res.text();
};

/**
 * Fetches a source file from the package tag or npm source commit.
 * @param {WorkerdPackageMetadata} metadata The package metadata.
 * @param {string} sourcePath The path within the workerd repository.
 * @returns {Promise<{ contents: string; sourceRefs: string[] }>} The source file contents and refs.
 */
const fetchSourceFile = async (metadata, sourcePath) => {
  const sourceRefs = [`v${metadata.version}`];

  if (metadata.gitHead) {
    sourceRefs.push(metadata.gitHead);
  }

  let lastErrorMessage = '';
  for (const ref of sourceRefs) {
    try {
      const contents = await fetchText(
        `${WORKERD_RAW_BASE}/${ref}/${sourcePath}`,
      );
      return { contents, sourceRefs };
    } catch (error) {
      lastErrorMessage = error instanceof Error ? error.message : String(error);
    }
  }

  throw new Error(
    `Failed to fetch ${sourcePath} for workerd@${metadata.version}: ${lastErrorMessage}`,
  );
};

/**
 * Parses V8 metadata from workerd's Bazel module file.
 * @param {string} source The build/deps/v8.MODULE.bazel source.
 * @returns {{ v8Version?: string; v8Tarball?: string }} Parsed V8 metadata.
 */
const parseV8Metadata = (source) => {
  const v8Version = source.match(/VERSION\s*=\s*"([^"]+)"/)?.[1];
  const v8Tarball = v8Version
    ? `https://github.com/v8/v8/archive/refs/tags/${v8Version}.tar.gz`
    : undefined;

  return { v8Version, v8Tarball };
};

/**
 * Builds one release-map entry.
 * @param {WorkerdPackageMetadata} metadata The package metadata.
 * @returns {Promise<WorkerdReleaseMapEntry>} The release-map entry.
 */
const buildReleaseEntry = async (metadata) => {
  const maximumCompatibilityDateSource = await fetchSourceFile(
    metadata,
    'src/workerd/io/maximum-compatibility-date.txt',
  );
  const releaseVersionSource = await fetchSourceFile(
    metadata,
    'src/workerd/io/release-version.txt',
  );
  const v8Source = await fetchSourceFile(
    metadata,
    'build/deps/v8.MODULE.bazel',
  );

  const maximumCompatibilityDate =
    maximumCompatibilityDateSource.contents.trim();
  const releaseVersion = releaseVersionSource.contents.trim();

  if (!dashedDatePattern.test(maximumCompatibilityDate)) {
    throw new Error(
      `Invalid maximum compatibility date for workerd@${metadata.version}: ${maximumCompatibilityDate}`,
    );
  }

  const { v8Version, v8Tarball } = parseV8Metadata(v8Source.contents);

  return {
    packageVersion: metadata.version,
    gitHead: metadata.gitHead,
    releaseVersion,
    maximumCompatibilityDate,
    bcdCheckpoint: toDottedDate(maximumCompatibilityDate),
    v8Version,
    v8Tarball,
    sourceRefs: maximumCompatibilityDateSource.sourceRefs,
  };
};

/**
 * Parses CLI arguments.
 * @returns {{ all: boolean; limit: number; output?: string; versions: string[] }} Parsed options.
 */
const parseArgs = () => {
  const args = process.argv.slice(2);
  /** @type {string[]} */
  const versions = [];
  /** @type {string | undefined} */
  let output;
  let all = false;
  let limit = 1;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--all') {
      all = true;
    } else if (arg === '--limit') {
      limit = Number(args[++i]);
    } else if (arg === '--output') {
      output = args[++i];
    } else if (arg === '--version') {
      versions.push(args[++i]);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error('--limit must be a positive integer');
  }

  return { all, limit, output, versions };
};

/**
 * Selects package versions to map.
 * @param {WorkerdRegistryMetadata} registry The npm registry metadata.
 * @param {{ all: boolean; limit: number; versions: string[] }} options The selection options.
 * @returns {WorkerdPackageMetadata[]} The selected package metadata.
 */
const selectVersions = (registry, options) => {
  if (options.versions.length > 0) {
    return options.versions.map((version) => {
      const metadata = registry.versions[version];
      if (!metadata) {
        throw new Error(`workerd@${version} was not found in the npm registry`);
      }
      return metadata;
    });
  }

  if (!options.all) {
    const latest = registry['dist-tags'].latest;
    if (!latest || !registry.versions[latest]) {
      throw new Error(
        'The npm registry response did not include a latest workerd version',
      );
    }
    return [registry.versions[latest]];
  }

  return Object.values(registry.versions)
    .filter((metadata) => !metadata.deprecated)
    .sort((a, b) => compareVersions(b.version, a.version))
    .slice(0, options.limit);
};

/**
 * Generates the release map.
 * @returns {Promise<void>}
 */
const main = async () => {
  const options = parseArgs();
  const registry = await fetchRegistryMetadata(WORKERD_NPM_API);
  const selectedVersions = selectVersions(registry, options);
  /** @type {WorkerdReleaseMapEntry[]} */
  const entries = [];

  for (const metadata of selectedVersions) {
    entries.push(await buildReleaseEntry(metadata));
  }

  const output = `${JSON.stringify(entries, null, 2)}\n`;

  if (options.output) {
    await fs.writeFile(options.output, output);
    console.log(
      `Wrote ${entries.length} workerd release-map entr${entries.length === 1 ? 'y' : 'ies'} to ${options.output}`,
    );
  } else {
    console.log(output);
  }
};

main().catch((error) => {
  console.error(styleText('red', String(error)));
  process.exit(1);
});
