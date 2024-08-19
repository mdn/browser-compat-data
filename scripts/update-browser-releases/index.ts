/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */
import yargs from 'yargs';

import { updateChromiumReleases } from './chrome.js';
import { updateEdgeReleases } from './edge.js';
import { updateFirefoxReleases } from './firefox.js';
import { updateSafariReleases } from './safari.js';

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
  .option('edge', {
    describe: 'Update Microsoft Edge',
    type: 'boolean',
    group: 'Engine selection:',
  })
  .option('firefox', {
    describe: 'Update Mozilla Firefox',
    type: 'boolean',
    group: 'Engine selection:',
  })
  .option('safari', {
    describe: 'Update Apple Safari',
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
const updateAllBrowsers =
  argv['all'] ||
  !(
    argv['chrome'] ||
    argv['webview'] ||
    argv['firefox'] ||
    argv['edge'] ||
    argv['safari']
  );
const updateChrome = argv['chrome'] || updateAllBrowsers;
const updateWebview = argv['webview'] || updateAllBrowsers;
const updateFirefox = argv['firefox'] || updateAllBrowsers;
const updateEdge = argv['edge'] || updateAllBrowsers;
const updateSafari = argv['safari'] || updateAllBrowsers;
const updateAllDevices =
  argv['alldevices'] || !(argv['mobile'] || argv['desktop']);
const updateMobile = argv['mobile'] || updateAllDevices;
const updateDesktop = argv['desktop'] || updateAllDevices;

const options = {
  chrome_desktop: {
    browserName: 'Chrome for Desktop',
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
  chrome_android: {
    browserName: 'Chrome for Android',
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
    browserName: 'Webview for Android',
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
  edge_desktop: {
    browserName: 'Edge for Desktop',
    bcdFile: './browsers/edge.json',
    bcdBrowserName: 'edge',
    browserEngine: 'Blink',
    releaseBranch: 'Stable',
    betaBranch: 'Beta',
    nightlyBranch: 'Dev',
    firstRelease: 12,
    skippedReleases: [
      12, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
      36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
      54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
      72, 73, 74, 75, 76, 77, 78, 82,
    ],
    edgeupdatesURL:
      'https://edgeupdates.microsoft.com/api/products?view=enterprise',
    releaseScheduleURL:
      'https://raw.githubusercontent.com/MicrosoftDocs/Edge-Enterprise/public/edgeenterprise/microsoft-edge-release-schedule.md',
  },
  firefox_desktop: {
    browserName: 'Firefox for Desktop',
    bcdFile: './browsers/firefox.json',
    bcdBrowserName: 'firefox',
    betaBranch: 'beta',
    nightlyBranch: 'nightly',
    firstRelease: 1,
    skippedReleases: [],
    firefoxReleaseDateURL: 'https://whattrainisitnow.com/api/firefox/releases/',
    firefoxESRDateURL: 'https://whattrainisitnow.com/api/esr/releases/',
    firefoxScheduleURL:
      'https://whattrainisitnow.com/api/release/schedule/?version=',
  },
  firefox_android: {
    browserName: 'Firefox for Android',
    bcdFile: './browsers/firefox_android.json',
    bcdBrowserName: 'firefox_android',
    betaBranch: 'beta',
    nightlyBranch: 'nightly',
    firstRelease: 4,
    skippedReleases: [11, 12, 13, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78],
    firefoxReleaseDateURL: 'https://whattrainisitnow.com/api/firefox/releases/',
    firefoxESRDateURL: 'https://whattrainisitnow.com/api/esr/releases/',
    firefoxScheduleURL:
      'https://whattrainisitnow.com/api/release/schedule/?version=',
  },
  safari_desktop: {
    browserName: 'Safari for Desktop',
    bcdFile: './browsers/safari.json',
    bcdBrowserName: 'safari',
    skippedReleases: [],
    releaseNoteJSON:
      'https://developer.apple.com/tutorials/data/documentation/safari-release-notes.json',
    releaseNoteURLBase: 'https://developer.apple.com',
  },
  safari_ios: {
    browserName: 'Safari for iOS',
    bcdFile: './browsers/safari_ios.json',
    bcdBrowserName: 'safari_ios',
    skippedReleases: ['12.1', '13.1', '14.1'],
    releaseNoteJSON:
      'https://developer.apple.com/tutorials/data/documentation/safari-release-notes.json',
    releaseNoteURLBase: 'https://developer.apple.com',
  },
};

let result = '';

if (updateChrome && updateDesktop) {
  const add = await updateChromiumReleases(options.chrome_desktop);
  result += (result && add ? '\n' : '') + add;
}

if (updateChrome && updateMobile) {
  const add = await updateChromiumReleases(options.chrome_android);
  result += (result && add ? '\n' : '') + add;
}

if (updateWebview && updateMobile) {
  const add = await updateChromiumReleases(options.webview_android);
  result += (result && add ? '\n' : '') + add;
}

if (updateEdge && updateDesktop) {
  const add = await updateEdgeReleases(options.edge_desktop);
  result += (result && add ? '\n' : '') + add;
}

if (updateFirefox && updateDesktop) {
  const add = await updateFirefoxReleases(options.firefox_desktop);
  result += (result && add ? '\n' : '') + add;
}

if (updateFirefox && updateMobile) {
  const add = await updateFirefoxReleases(options.firefox_android);
  result += (result && add ? '\n' : '') + add;
}

if (updateSafari && updateDesktop) {
  const add = await updateSafariReleases(options.safari_desktop);
  result += (result && add ? '\n' : '') + add;
}

if (updateSafari && updateMobile) {
  const add = await updateSafariReleases(options.safari_ios);
  result += (result && add ? '\n' : '') + add;
}

if (result) {
  console.log(result);
}
