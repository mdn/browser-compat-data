/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs/promises';

import chalk from 'chalk-template';
import { compareVersions } from 'compare-versions';

import stringify from '../lib/stringify-and-order-properties.js';

import {
  createOrUpdateBrowserEntry,
  gfmNoteblock,
  updateBrowserEntry,
} from './utils.js';

import type { CompatData } from '../../types/types.js';

type BunVersionInfo = {
  status: 'current' | 'retired';
  release_date: string;
  release_notes: string;
} & (
  | {
      versions?: never;
      revision?: never;
    }
  | {
      versions: Record<(string & {}) | 'webkit', string>;
      revision: string;
    }
);

interface BunVersionsResponse {
  $note: string;
  releases: Record<string, BunVersionInfo>;
}

const VERSIONS_API = 'https://bun.com/versions.json';

/**
 * Fetches Bun version information from the versions.json endpoint.
 * @returns The versions response object.
 */
const fetchVersions = async (): Promise<BunVersionsResponse> => {
  const res = await fetch(VERSIONS_API, {
    headers: {
      'User-Agent':
        'MDN-Browser-Release-Update-Bot/1.0 (+https://developer.mozilla.org/)',
      Accept: 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Bun versions fetch failed: HTTP ${res.status}`);
  }
  return (await res.json()) as BunVersionsResponse;
};

/**
 * Fetches WebKit version from the Version.xcconfig file at a specific commit.
 * @param commitHash - The WebKit commit hash.
 * @returns The WebKit version in x.y.z format, or undefined if fetch fails.
 */
const fetchWebKitVersion = async (
  commitHash: string,
): Promise<string | undefined> => {
  try {
    const url = `https://api.github.com/repos/oven-sh/WebKit/contents/Configurations/Version.xcconfig?ref=${commitHash}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'MDN-Browser-Release-Update-Bot/1.0 (+https://developer.mozilla.org/)',
        Accept: 'application/vnd.github.v3.raw',
      },
    });

    if (!res.ok) {
      console.warn(
        chalk`{yellow Warning: Failed to fetch WebKit Version.xcconfig for commit ${commitHash}: HTTP ${res.status}}`,
      );
      return undefined;
    }

    const content = await res.text();

    const majorMatch = content.match(/MAJOR_VERSION\s*=\s*(\d+)/);
    const minorMatch = content.match(/MINOR_VERSION\s*=\s*(\d+)/);
    const tinyMatch = content.match(/TINY_VERSION\s*=\s*(\d+)/);

    if (majorMatch && minorMatch && tinyMatch) {
      const version = `${majorMatch[1]}.${minorMatch[1]}.${tinyMatch[1]}`;
      return version;
    }

    console.warn(
      chalk`{yellow Warning: Could not parse version numbers from Version.xcconfig for commit ${commitHash}}`,
    );
    return undefined;
  } catch (error) {
    console.warn(
      chalk`{yellow Warning: Error fetching WebKit version for commit ${commitHash}: ${error}}`,
    );
    return undefined;
  }
};

/**
 * Gets Bun version info from the versions data.
 * @param versionInfo - The version info object from the API.
 * @returns An object containing webkitRev and bunRevision, if available.
 */
const getBunInfoFromVersionData = async (
  versionInfo: BunVersionInfo,
): Promise<{ webkitRev?: string; bunRevision?: string }> => {
  const webkitCommitHash = versionInfo.versions?.webkit;
  const bunRevision = versionInfo.revision;
  let webkitRev: string | undefined;

  if (webkitCommitHash) {
    webkitRev = await fetchWebKitVersion(webkitCommitHash);
  }

  if (webkitRev || bunRevision) {
    console.log(
      chalk`{gray Bun: webkit=${webkitRev ?? 'unknown'} bun-revision=${bunRevision || 'unknown'}}`,
    );
  }

  return { webkitRev, bunRevision };
};

/**
 * Updates the Bun releases.
 * @param options - The options.
 * @param options.bcdBrowserName - The name of the browser in the BCD file.
 * @param options.bcdFile - The path to the BCD file.
 * @param options.browserName - The name of the browser.
 * @returns The result.
 */
export const updateBunReleases = async (options: {
  bcdBrowserName: 'bun';
  bcdFile: string;
  browserName: string;
}) => {
  const browser = options.bcdBrowserName;

  let fileText: string;
  try {
    fileText = await fs.readFile(options.bcdFile, 'utf-8');
  } catch {
    return gfmNoteblock(
      'NOTE',
      `**${options.browserName ?? 'Bun'}**: No browser data file found at ${options.bcdFile}. Add a seed file (e.g., browsers/bun.json) before running updates.`,
    );
  }

  const data: CompatData = JSON.parse(fileText);

  let result = '';

  let versionsData: BunVersionsResponse;
  try {
    versionsData = await fetchVersions();
  } catch (e) {
    return gfmNoteblock(
      'WARNING',
      `**${options.browserName ?? 'Bun'}**: Failed to fetch versions data (${e}).`,
    );
  }

  interface Stable {
    version: string;
    date?: string;
    url?: string;
    info: BunVersionInfo;
  }

  const stableReleases: Stable[] = [];
  let latestVersion: string | null = null;

  for (const [version, info] of Object.entries(versionsData.releases)) {
    // Only include versions >= 1.0.0
    if (compareVersions(version, '1.0.0') < 0) {
      continue;
    }

    stableReleases.push({
      version,
      date: info.release_date,
      url: info.release_notes,
      info,
    });

    if (info.status === 'current') {
      latestVersion = version;
    }
  }

  stableReleases.sort((a, b) => compareVersions(a.version, b.version));

  if (stableReleases.length === 0) {
    return gfmNoteblock(
      'NOTE',
      `**${options.browserName ?? 'Bun'}**: No stable releases found since v1.0.0.`,
    );
  }

  if (!latestVersion) {
    latestVersion = stableReleases[stableReleases.length - 1].version;
  }

  const latest =
    stableReleases.find((r) => r.version === latestVersion) ||
    stableReleases[stableReleases.length - 1];

  for (const rel of stableReleases) {
    const status = rel.version === latest.version ? 'current' : 'retired';
    result += createOrUpdateBrowserEntry(
      data,
      browser,
      rel.version,
      status,
      undefined,
      undefined,
      rel.date,
      rel.url,
    );

    const entry = data.browsers[browser].releases[rel.version];

    if (entry) {
      const { webkitRev } = await getBunInfoFromVersionData(rel.info);

      if (webkitRev) {
        entry.engine = 'WebKit';
        entry.engine_version = webkitRev;
      }
    }
  }

  const existing = Object.keys(data.browsers[browser].releases ?? {});
  for (const v of existing) {
    if (v !== latest.version) {
      result += updateBrowserEntry(
        data,
        browser,
        v,
        undefined,
        'retired',
        undefined,
        undefined,
      );
    }
  }

  await fs.writeFile(`./${options.bcdFile}`, stringify(data) + '\n');

  if (result) {
    result = `### Updates for ${options.browserName ?? 'Bun'}\n${result}`;
  }

  return result;
};
