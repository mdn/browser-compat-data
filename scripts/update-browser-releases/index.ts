/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */
import yargs from 'yargs';

import { updateChromiumReleases } from './chrome.js';

const argv = yargs(process.argv.slice(2))
  .usage('Usage: npm run update-browser-releases -- (flags)')
  .option('chrome', {
    describe: 'Update Google Chrome',
    type: 'boolean',
    group: 'Engine selection:',
  })
  .option('webview', {
    describe: 'Update Google Webview',
    type: 'boolean',
    group: 'Engine selection:',
  })
  .option('all', {
    describe: 'Update all browsers (default)',
    type: 'boolean',
    group: 'Engine selection:',
  })
  .option('desktop', {
    describe: 'Update desktop releases',
    type: 'boolean',
    group: 'Device selection:',
  })
  .option('mobile', {
    describe: 'Update mobile releases',
    type: 'boolean',
    group: 'Device selection:',
  })
  .option('alldevices', {
    describe: 'Update all devices (default)',
    type: 'boolean',
    group: 'Device selection:',
  })
  .help()
  .parse();

// Read arguments
const updateAllBrowsers = argv['all'] || !(argv['chrome'] || argv['webview']);
const updateChrome = argv['chrome'] || updateAllBrowsers;
const updateWebview = argv['webview'] || updateAllBrowsers;
const updateAllDevices =
  argv['alldevices'] || !(argv['mobile'] || argv['desktop']);
const updateMobile = argv['mobile'] || updateAllDevices;
const updateDesktop = argv['desktop'] || updateAllDevices;

const options = {
  desktop: {
    bcdFile: './browsers/chrome.json',
    bcdBrowserName: 'chrome',
    browserEngine: 'Blink',
    releaseBranch: 'stable',
    betaBranch: 'beta',
    nightlyBranch: 'canary',
    releaseNoteCore: 'stable-channel-update-for-desktop',
    firstRelease: 1,
    skippedReleases: [82], // 82 was skipped during COVID
    chromestatusURL: 'https://chromestatus.com/api/v0/channels',
  },
  android: {
    bcdFile: './browsers/chrome_android.json',
    bcdBrowserName: 'chrome_android',
    browserEngine: 'Blink',
    releaseBranch: 'stable',
    betaBranch: 'beta',
    nightlyBranch: 'canary',
    releaseNoteCore: 'chrome-for-android-update',
    firstRelease: 25,
    skippedReleases: [82], // 82 was skipped during COVID
    chromestatusURL: 'https://chromestatus.com/api/v0/channels',
  },
  webview_android: {
    bcdFile: './browsers/webview_android.json',
    bcdBrowserName: 'webview_android',
    browserEngine: 'Blink',
    releaseBranch: 'stable',
    betaBranch: 'beta',
    nightlyBranch: 'canary',
    releaseNoteCore: 'chrome-for-android-update',
    firstRelease: 37,
    skippedReleases: [82], // 82 was skipped during COVID
    chromestatusURL: 'https://chromestatus.com/api/v0/channels',
  },
};

if (updateChrome && updateDesktop) {
  console.log('Check Chrome for Desktop.');
  await updateChromiumReleases(options.desktop);
}

if (updateChrome && updateMobile) {
  console.log('Check Chrome for Android.');
  await updateChromiumReleases(options.android);
}

if (updateWebview && updateMobile) {
  console.log('Check Webview for Android.');
  await updateChromiumReleases(options.webview_android);
}

/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { updateChromiumFile } from './chrome-version.js';

// Arguments:
//  Engine selections:
//   --chrome : update chrome
//   --firefox : update firefox
//   --all : update all
//   If none of the three, equivalent of -all. If several, they add
//  Mobile/Desktop selection
//   --mobile: update all mobile
//   --desktop: update all desktop
//  If several they add; if none: equivalent to --mobile --desktop
const updateAll =
  !(
    process.argv.indexOf('--all') > -1 ||
    process.argv.indexOf('--chrome') > -1 ||
    process.argv.indexOf('--firefox') > -1
  ) || process.argv.indexOf('--all') > -1;
const updateChrome = process.argv.indexOf('--chrome') > -1 || updateAll;
//const updateFirefox = (process.argv.indexOf('--chrome') > -1) || updateAll;
const updateAllTypes = !(
  process.argv.indexOf('--mobile') > -1 ||
  process.argv.indexOf('--desktop') > -1
);
const updateMobile = process.argv.indexOf('--mobile') > -1 || updateAllTypes;
const updateDesktop = process.argv.indexOf('--desktop') > -1 || updateAllTypes;

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

if (updateChrome && updateDesktop) {
  console.log('Check Chrome for Desktop.');
  await updateChromiumFile(options.desktop);
}

if (updateChrome && updateMobile) {
  console.log('Check Chrome for Android.');
  await updateChromiumFile(options.android);
}
