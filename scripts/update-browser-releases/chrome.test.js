/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';

import {
  getChannels,
  getReleaseNotesURLForVersion,
  updateChromiumReleases,
} from './chrome.js';

describe('getReleaseNotesURLForVersion', () => {
  const cases = [
    { version: '53', expected: '' },
    {
      version: '54',
      expected: 'https://developer.chrome.com/blog/new-in-chrome-54',
    },
    {
      version: '123',
      expected: 'https://developer.chrome.com/blog/new-in-chrome-123',
    },
    {
      version: '124',
      expected: 'https://developer.chrome.com/release-notes/124',
    },
    {
      version: '154',
      expected: 'https://developer.chrome.com/release-notes/154',
    },
    {
      version: '155',
      expected: 'https://chromestatus.com/release-notes/155',
    },
  ];

  for (const { version, expected } of cases) {
    it(`returns ${expected || 'no URL'} for Chrome ${version}`, () => {
      assert.equal(getReleaseNotesURLForVersion(version), expected);
    });
  }
});

describe('getChannels', () => {
  const options = {
    releaseBranch: 'stable',
    betaBranch: 'beta',
    nightlyBranch: 'dev',
  };
  const cases = [
    {
      name: 'released stable',
      stableUnreleased: false,
      expected: [
        ['stable', 'current'],
        ['beta', 'beta'],
        ['dev', 'nightly'],
      ],
    },
    {
      name: 'unreleased stable',
      stableUnreleased: true,
      expected: [
        ['stable', 'beta'],
        ['beta', 'nightly'],
        ['dev', 'planned'],
      ],
    },
  ];

  for (const { name, stableUnreleased, expected } of cases) {
    it(`maps channels for ${name}`, () => {
      assert.deepEqual(getChannels(options, stableUnreleased), expected);
    });
  }
});

describe('updateChromiumReleases', () => {
  const channels = {
    stable: { version: 156, stable_date: '2026-10-20T00:00:00' },
    beta: { version: 157, stable_date: '2026-11-03T00:00:00' },
    dev: { version: 158, stable_date: '2026-11-17T00:00:00' },
  };
  /**
   * Builds a Chrome release entry.
   * @param {string} releaseDate Release date, or empty for none
   * @param {string} status BCD release status
   * @param {string} version Version number
   * @param {string} [notes] Release notes URL
   * @returns {object} The release entry
   */
  const release = (releaseDate, status, version, notes) => ({
    ...(releaseDate && { release_date: releaseDate }),
    ...(notes && { release_notes: notes }),
    status,
    engine: 'Blink',
    engine_version: version,
  });
  /**
   * Returns the Chrome Status release notes URL.
   * @param {number|string} version Version number
   * @returns {string} The URL
   */
  const notes = (version) =>
    `https://chromestatus.com/release-notes/${version}`;
  const initial = {
    browsers: {
      chrome: {
        releases: {
          154: release(
            '2026-09-22',
            'retired',
            '154',
            'https://developer.chrome.com/release-notes/154',
          ),
          155: release('2026-10-06', 'current', '155'),
          156: release('2026-10-20', 'beta', '156'),
          157: release('2026-11-03', 'nightly', '157'),
          158: release('', 'planned', '158'),
        },
      },
    },
  };

  const cases = [
    {
      name: 'stable version is not yet released',
      now: '2026-10-19T12:00:00Z',
      expected: {
        154: initial.browsers.chrome.releases[154],
        155: initial.browsers.chrome.releases[155],
        156: release('2026-10-20', 'beta', '156', notes(156)),
        157: release('2026-11-03', 'nightly', '157', notes(157)),
        158: release('', 'planned', '158', notes(158)),
      },
    },
    {
      name: 'stable version is released',
      now: '2026-10-20T12:00:00Z',
      expected: {
        154: initial.browsers.chrome.releases[154],
        155: release('2026-10-06', 'retired', '155', notes(155)),
        156: release('2026-10-20', 'current', '156', notes(156)),
        157: release('2026-11-03', 'beta', '157', notes(157)),
        158: release('2026-11-17', 'nightly', '158', notes(158)),
        159: release('', 'planned', '159', notes(159)),
      },
    },
  ];

  let cwd;
  let dir;

  beforeEach(() => {
    cwd = process.cwd();
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bcd-chrome-'));
    process.chdir(dir);
    fs.writeFileSync('chrome.json', JSON.stringify(initial));
    mock.method(globalThis, 'fetch', async (url) =>
      String(url).startsWith('https://chromestatus.com/release-notes/')
        ? new Response(null, { status: 200 })
        : new Response(`)]}'\n${JSON.stringify(channels)}`),
    );
  });

  afterEach(() => {
    mock.restoreAll();
    mock.timers.reset();
    process.chdir(cwd);
    fs.rmSync(dir, { recursive: true, force: true });
  });

  for (const { name, now, expected } of cases) {
    it(`updates releases when the ${name}`, async () => {
      mock.timers.enable({ apis: ['Date'], now: Date.parse(now) });
      await updateChromiumReleases({
        browserName: 'Chrome for Desktop',
        bcdBrowserName: 'chrome',
        bcdFile: 'chrome.json',
        chromestatusURL: 'https://chromestatus.com/api/v0/channels',
        releaseBranch: 'stable',
        betaBranch: 'beta',
        nightlyBranch: 'dev',
        releaseNoteCore: 'stable-channel-update-for-desktop',
        firstRelease: 154,
        skippedReleases: [],
        browserEngine: 'Blink',
      });

      const result = JSON.parse(fs.readFileSync('chrome.json', 'utf8'));
      assert.deepEqual(result.browsers.chrome.releases, expected);
    });
  }
});
