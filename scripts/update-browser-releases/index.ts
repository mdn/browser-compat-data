/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { updateChromiumFile } from './chrome-version.js';

const options = {
  desktop: {
    bcdFile: './browsers/chrome.json',
    bcdBrowserName: 'chrome',
    releaseBranch: 'stable',
    betaBranch: 'beta',
    nightlyBranch: 'dev',
    releaseNoteCore: 'stable-channel-update-for-desktop',
    firstRelease: 1,
    skippedReleases: [82], // 82 was skipped during COVID
    chromestatusURL: 'https://chromestatus.com/api/v0/channels',
  },
  android: {
    bcdFile: './browsers/chrome_android.json',
    bcdBrowserName: 'chrome_android',
    releaseBranch: 'stable',
    betaBranch: 'beta',
    nightlyBranch: 'dev',
    releaseNoteCore: 'chrome-for-android-update',
    firstRelease: 25,
    skippedReleases: [82], // 82 was skipped during COVID
    chromestatusURL: 'https://chromestatus.com/api/v0/channels',
  },
};

console.log('Check Android for Desktop.');
await updateChromiumFile(options.desktop);

console.log('Check Android for Android.');
await updateChromiumFile(options.android);
