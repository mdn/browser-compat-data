/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs/promises';
import path from 'node:path';

import { compareVersions } from 'compare-versions';

import { spawn } from '../../utils/index.js';
import chalk from 'chalk-template';
import stringify from '../lib/stringify-and-order-properties.js';

import {
  createOrUpdateBrowserEntry,
  gfmNoteblock,
  updateBrowserEntry,
} from './utils.js';

interface GitHubRelease {
  tag_name?: string;
  name?: string;
  draft?: boolean;
  prerelease?: boolean;
  published_at?: string; // ISO
  html_url?: string;
}

const GITHUB_API =
  'https://api.github.com/repos/oven-sh/bun/releases?per_page=100&page=';

const SEMVER_RE = /(\d+\.\d+\.\d+)/;

/**
 * Converts an ISO date string to a YYYY-MM-DD format.
 * @param iso - The ISO date string to convert.
 * @returns The date in YYYY-MM-DD format, or undefined if input is falsy.
 */
const toDate = (iso?: string): string | undefined =>
  iso ? new Date(iso).toISOString().split('T')[0] : undefined;

/**
 * Extracts the version number from a GitHub release.
 * @param r - The GitHub release object.
 * @returns The version number, or undefined if not found.
 */
const extractVersion = (r: GitHubRelease): string | undefined => {
  const hay = `${r.tag_name ?? ''} ${r.name ?? ''}`;
  const m = hay.match(SEMVER_RE);
  return m ? m[1] : undefined;
};

/**
 * Updates the JSON file listing Bun releases.
 * Relies on GitHub releases for stable versions; ignores drafts/prereleases.
 * @param options Options including `browserName`, `bcdFile`, and `bcdBrowserName`.
 * @returns A markdown changelog string, or an empty string if no changes.
 */
const fetchAllReleases = async (): Promise<GitHubRelease[]> => {
  const all: GitHubRelease[] = [];
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(GITHUB_API + page, {
      headers: {
        'User-Agent':
          'MDN-Browser-Release-Update-Bot/1.0 (+https://developer.mozilla.org/)',
        Accept: 'application/vnd.github+json',
      },
    });
    if (!res.ok) {
      throw new Error(`GitHub releases fetch failed: HTTP ${res.status}`);
    }
    const chunk = (await res.json()) as GitHubRelease[];
    if (!Array.isArray(chunk) || chunk.length === 0) {
      break;
    }
    all.push(...chunk);
  }
  return all;
};

// Resolve asset suffix for current platform/arch
/**
 *
 */
const resolveAssetSuffix = () => {
  const plat = process.platform === 'darwin' ? 'darwin' : process.platform;
  const cpu = process.arch === 'arm64' ? 'aarch64' : process.arch;
  return `${plat}-${cpu}`;
};

/**
 *
 * @param dir
 */
const findBunBinaryPath = async (dir: string): Promise<string | null> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      const found = await findBunBinaryPath(p);
      if (found) {
        return found;
      }
    } else if (e.isFile() && e.name === 'bun') {
      return p;
    }
  }
  return null;
};

/**
 *
 * @param version
 */
const downloadAndExtractBun = async (
  version: string,
): Promise<string | null> => {
  const suffix = resolveAssetSuffix();
  const base = `https://github.com/oven-sh/bun/releases/download/bun-v${version}`;
  const asset = `bun-${suffix}.zip`;
  const url = `${base}/${asset}`;

  const cacheRoot = path.join(process.cwd(), '.cache', 'bun-updater', version);
  const zipPath = path.join(cacheRoot, asset);
  const extractDir = path.join(cacheRoot, 'extracted');

  await fs.mkdir(extractDir, { recursive: true });
  console.log(chalk`{gray Bun v${version}: preparing cache at ${cacheRoot}}`);

  try {
    await fs.access(zipPath);
  } catch {
    console.log(chalk`{gray Bun v${version}: downloading ${url}}`);
    const res = await fetch(url);
    if (!res.ok) {
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.mkdir(cacheRoot, { recursive: true });
    await fs.writeFile(zipPath, buf);
  }

  try {
    console.log(
      chalk`{gray Bun v${version}: extracting archive to ${extractDir}}`,
    );
    spawn('unzip', ['-o', zipPath, '-d', extractDir]);
  } catch (e) {
    console.warn(
      chalk`{yellow Bun v${version}: failed to extract (${String(e)})}`,
    );
    return null;
  }

  const bin = await findBunBinaryPath(extractDir);
  if (!bin) {
    return null;
  }
  console.log(chalk`{gray Bun v${version}: found binary at ${bin}}`);
  try {
    await fs.chmod(bin, 0o755);
  } catch {}
  return bin;
};

/**
 * Gets Bun version info for a given version.
 * @param version - The Bun version to fetch info for.
 * @returns An object containing webkitRev and bunRevision, if available.
 */
const getBunInfoForVersion = async (
  version: string,
): Promise<{ webkitRev?: string; bunRevision?: string }> => {
  console.log(
    chalk`{gray Bun v${version}: resolving engine_version and revision...}`,
  );
  const bin = await downloadAndExtractBun(version);
  if (!bin) {
    return {};
  }
  try {
    const versionsJSON = spawn(bin, [
      '--eval',
      'console.log(JSON.stringify(process.versions))',
    ]);
    const versions = JSON.parse(versionsJSON) as Record<string, string>;
    const webkitRev = versions['webkit'];
    let bunRevision = '';
    try {
      bunRevision = spawn(bin, ['--revision']).trim();
    } catch {}
    console.log(
      chalk`{gray Bun v${version}: webkit=${webkitRev ?? 'unknown'} bun-revision=${bunRevision || 'unknown'}}`,
    );
    return { webkitRev, bunRevision };
  } catch {
    return {};
  }
};

/**
 * Updates the Bun releases.
 * @param options - The options.
 * @returns The result.
 */
export const updateBunReleases = async (options) => {
  const browser = options.bcdBrowserName ?? 'bun';

  // Load existing Bun browser data
  let fileText: string;
  try {
    fileText = await fs.readFile(`${options.bcdFile}`, 'utf-8');
  } catch {
    return gfmNoteblock(
      'NOTE',
      `**${options.browserName ?? 'Bun'}**: No browser data file found at ${options.bcdFile}. Add a seed file (e.g., browsers/bun.json) before running updates.`,
    );
  }

  const data = JSON.parse(fileText);

  let result = '';

  let releases: GitHubRelease[] = [];
  try {
    releases = await fetchAllReleases();
  } catch (e) {
    return gfmNoteblock(
      'WARNING',
      `**${options.browserName ?? 'Bun'}**: Failed to fetch GitHub releases (${e}).`,
    );
  }

  interface Stable {
    version: string;
    date?: string;
    url?: string;
  }

  // Build stable releases in a single clear pass; keep earliest date per version.
  const byVersion = new Map<string, Stable>();
  for (const r of releases) {
    if (r.draft || r.prerelease) {
      continue;
    }

    const version = extractVersion(r);

    if (!version) {
      continue;
    }

    if (compareVersions(version, '1.0.0') < 0) {
      continue;
    }

    const candidate: Stable = {
      version,
      date: toDate(r.published_at),
      url: r.html_url ?? '',
    };

    const existing = byVersion.get(version);

    if (!existing) {
      byVersion.set(version, candidate);
    } else if (
      existing.date &&
      candidate.date &&
      existing.date > candidate.date
    ) {
      byVersion.set(version, candidate);
    }
  }

  const stableReleases = Array.from(byVersion.values()).sort((a, b) =>
    compareVersions(a.version, b.version),
  );

  if (stableReleases.length === 0) {
    return gfmNoteblock(
      'NOTE',
      `**${options.browserName ?? 'Bun'}**: No stable releases found since v1.0.0.`,
    );
  }

  const latest = stableReleases[stableReleases.length - 1];

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

    // Ensure engine is set to WebKit (update existing entries too)
    const entry = data.browsers[browser].releases[rel.version];

    if (entry) {
      const shouldResolve = rel.version === latest.version;
      if (shouldResolve && !entry.engine_version) {
        const { webkitRev } = await getBunInfoForVersion(rel.version);
        if (webkitRev) {
          entry.engine = 'WebKit';
          entry.engine_version = webkitRev;
        } else {
          console.log(
            chalk`{gray Bun v${rel.version}: no engine info in process.versions; leaving engine unset}`,
          );
        }
      }
    }
  }

  // Ensure any existing non-latest entries are retired
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

  // Ensure schema dependency: if engine is present, engine_version must be present.
  // Clean any existing entries that have engine without engine_version.
  for (const [ver, rel] of Object.entries(
    data.browsers[browser].releases ?? {},
  ) as [string, any][]) {
    if (rel.engine && !rel.engine_version) {
      delete rel.engine;
    }
  }

  await fs.writeFile(`./${options.bcdFile}`, stringify(data) + '\n');

  if (result) {
    result = `### Updates for ${options.browserName ?? 'Bun'}\n${result}`;
  }

  return result;
};
