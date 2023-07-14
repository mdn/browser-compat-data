/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import {
  compare as compareVersions,
  compareVersions as compareVersionsSort,
} from 'compare-versions';
import uaParser from 'ua-parser-js';

const getMajorVersion = (version) => version.split('.')[0];

const getMajorMinorVersion = (version) => {
  const [major, minor] = version.split('.');
  return `${major}.${minor || 0}`;
};

const parseUA = (userAgent, browsers) => {
  const ua = uaParser(userAgent);

  const data: {
    browser: {
      id: string;
      name: string;
    };
    version: string;
    fullVersion: string;
    os: {
      name: string;
      version: string;
    };
    inBcd: boolean | undefined;
  } = {
    browser: { id: '', name: '' },
    version: '',
    fullVersion: '',
    os: { name: '', version: '' },
    inBcd: undefined,
  };

  if (!ua.browser.name) {
    return data;
  }

  data.browser.id = ua.browser.name.toLowerCase().replace(/ /g, '_');
  data.browser.name = ua.browser.name;
  data.os.name = ua.os.name || '';
  data.os.version = ua.os.version || '';

  switch (data.browser.id) {
    case 'mobile_safari':
      data.browser.id = 'safari';
      break;
    case 'oculus_browser':
      data.browser.id = 'oculus';
      break;
    case 'samsung_browser':
      data.browser.id = 'samsunginternet';
      break;
    case 'android_browser':
    case 'chrome_webview':
      data.browser.id = 'webview';
      break;
  }

  const os = data.os.name.toLowerCase();
  if (os === 'android' && data.browser.id !== 'oculus') {
    data.browser.id += '_android';
    data.browser.name += ' Android';

    if (ua.browser.name === 'Android Browser') {
      // For early WebView Android, use the OS version
      data.fullVersion = compareVersions(ua.os.version, '5.0', '<')
        ? ua.os.version
        : ua.engine.version;
    }
  } else if (os === 'ios') {
    data.browser.id += '_ios';
    data.browser.name += ' iOS';

    // https://github.com/mdn/browser-compat-data/blob/main/docs/data-guidelines.md#safari-for-ios-versioning
    data.fullVersion = ua.os.version;
  }

  data.fullVersion = data.fullVersion || ua.browser.version;
  data.version = getMajorMinorVersion(data.fullVersion);

  if (!(data.browser.id in browsers)) {
    return data;
  }

  data.browser.name = browsers[data.browser.id].name;
  data.inBcd = false;

  const versions = Object.keys(browsers[data.browser.id].releases);
  versions.sort(compareVersionsSort);

  // Android 4.4.3 needs to be handled as a special case, because its data
  // differs from 4.4, and the code below will strip out the patch versions from
  // our version numbers.
  if (
    data.browser.id === 'webview_android' &&
    compareVersions(data.fullVersion, '4.4.3', '>=') &&
    compareVersions(data.fullVersion, '5.0', '<')
  ) {
    data.version = '4.4.3';
    data.inBcd = true;
    return data;
  }

  // Certain Safari versions are backports of newer versions, but contain less
  // features, particularly ones involving OS integration. We are explicitly
  // marking these versions as "not in BCD" to avoid confusion.
  if (
    data.browser.id === 'safari' &&
    ['4.1', '6.1', '6.2', '7.1'].includes(data.version)
  ) {
    return data;
  }

  // The |version| from the UA string is typically more precise than |versions|
  // from BCD, and some "uninteresting" releases are missing from BCD. To deal
  // with this, find the pair of versions in |versions| that sandwiches
  // |version|, and use the first of this pair. For example, given |version|
  // "10.1" and |versions| entries "10.0" and "10.2", return "10.0".
  for (let i = 0; i < versions.length - 1; i++) {
    const current = versions[i];
    const next = versions[i + 1];
    if (
      compareVersions(data.version, current, '>=') &&
      compareVersions(data.version, next, '<')
    ) {
      data.inBcd = true;
      data.version = current;
      break;
    }
  }

  // We reached the last entry in |versions|. With no |next| to compare against
  // we have to check if it looks like a significant release or not. By default
  // that means a new major version, but for Safari and Samsung Internet the
  // major and minor version are significant.
  let normalize = getMajorVersion;
  if (
    data.browser.id.startsWith('safari') ||
    data.browser.id === 'samsunginternet_android'
  ) {
    normalize = getMajorMinorVersion;
  }
  if (
    data.inBcd == false &&
    normalize(data.version) === normalize(versions[versions.length - 1])
  ) {
    data.inBcd = true;
    data.version = versions[versions.length - 1];
  }

  return data;
};

export { getMajorMinorVersion, parseUA };
