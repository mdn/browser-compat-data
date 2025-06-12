/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */
import yargs from 'yargs';

import { updateChromiumReleases } from './chrome.js';
import { updateEdgeReleases } from './edge.js';
import { updateFirefoxReleases } from './firefox.js';
import { updateOperaReleases } from './opera.js';
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
  .option('opera', {
    describe: 'Update Opera',
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
    argv['opera'] ||
    argv['safari']
  );
const updateChrome = argv['chrome'] || updateAllBrowsers;
const updateWebview = argv['webview'] || updateAllBrowsers;
const updateFirefox = argv['firefox'] || updateAllBrowsers;
const updateEdge = argv['edge'] || updateAllBrowsers;
const updateOpera = argv['opera'] || updateAllBrowsers;
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
    nightlyBranch: 'dev',
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
    nightlyBranch: 'dev',
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
    nightlyBranch: 'dev',
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
  opera_desktop: {
    browserName: 'Opera for Desktop',
    bcdFile: './browsers/opera.json',
    bcdBrowserName: 'opera',
    skippedReleases: [],
    releaseFeedURL: 'https://blogs.opera.com/desktop/category/stable-2/feed/',
    titleVersionPattern: /^Opera (\d+)$/,
    descriptionEngineVersionPattern: /Chromium(?:\s[^.\d]+)?\s(\d+)(?=[.])/,
  },
  opera_android: {
    browserName: 'Opera for Android',
    bcdFile: './browsers/opera_android.json',
    bcdBrowserName: 'opera_android',
    skippedReleases: [],
    releaseFeedURL: 'https://forums.opera.com/category/20.rss',
    releaseFilterCreator: ['abitkulova'],
    titleVersionPattern: /^Opera for Android (\d+)$/,
    descriptionEngineVersionPattern: /Chromium (\d+)/,
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
  webview_ios: {
    browserName: 'WKWebView for iOS',
    bcdFile: './browsers/webview_ios.json',
    bcdBrowserName: 'webview_ios',
    skippedReleases: ['12.1', '13.1', '14.1'],
    releaseNoteJSON:
      'https://developer.apple.com/tutorials/data/documentation/safari-release-notes.json',
    releaseNoteURLBase: 'https://developer.apple.com',
  },
};

const results = await Promise.all([
  ...(updateChrome
    ? [
        updateDesktop && updateChromiumReleases(options.chrome_desktop),
        updateMobile && updateChromiumReleases(options.chrome_android),
      ]
    : []),
  updateWebview &&
    updateMobile &&
    updateChromiumReleases(options.webview_android),
  updateEdge && updateDesktop && updateEdgeReleases(options.edge_desktop),
  ...(updateFirefox
    ? [
        updateDesktop && updateFirefoxReleases(options.firefox_desktop),
        updateMobile && updateFirefoxReleases(options.firefox_android),
      ]
    : []),
  ...(updateOpera
    ? [
        updateDesktop && updateOperaReleases(options.opera_desktop),
        updateMobile && updateOperaReleases(options.opera_android),
      ]
    : []),
  ...(updateSafari
    ? [
        updateDesktop && updateSafariReleases(options.safari_desktop),
        updateMobile && updateSafariReleases(options.safari_ios),
        updateMobile && updateSafariReleases(options.webview_ios),
      ]
    : []),
]);

const result = results.filter(Boolean).join('\n\n');

if (result) {
  console.log(result);
}
