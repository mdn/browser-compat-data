/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert';

import { getMajorMinorVersion, parseUA } from './ua-parser.js';

const browsers = {
  chrome: { name: 'Chrome', releases: { 82: {}, 83: {}, 84: {}, 85: {} } },
  chrome_android: { name: 'Chrome Android', releases: { 85: {} } },
  edge: { name: 'Edge', releases: { 16: {}, 84: {} } },
  firefox: { name: 'Firefox', releases: { 3.6: {} } },
  ie: { name: 'Internet Explorer', releases: { 8: {}, 11: {} } },
  safari: {
    name: 'Safari',
    releases: { 13: {}, 13.1: {}, 14: {}, 15: {}, 15.1: {}, 15.2: {} },
  },
  safari_ios: {
    name: 'iOS Safari',
    releases: { 13: {}, 13.3: {}, 13.4: {}, 14: {} },
  },
  samsunginternet_android: {
    name: 'Samsung Internet',
    releases: {
      '10.0': {},
      10.2: {},
      '11.0': {},
      11.2: {},
      '12.0': {},
      12.1: {},
    },
  },
  webview_android: {
    name: 'WebView Android',
    releases: { 1.1: {}, 4.4: {}, '4.4.3': {}, 37: {}, 86: {} },
  },
};

describe('getMajorMinorVersion', () => {
  it('1.2.3', () => {
    assert.strictEqual(getMajorMinorVersion('1.2.3'), '1.2');
  });

  it('10', () => {
    assert.strictEqual(getMajorMinorVersion('10'), '10.0');
  });

  it('10.0', () => {
    assert.strictEqual(getMajorMinorVersion('10.0'), '10.0');
  });

  it('10.01', () => {
    assert.strictEqual(getMajorMinorVersion('10.01'), '10.01');
  });

  it('10.1', () => {
    assert.strictEqual(getMajorMinorVersion('10.1'), '10.1');
  });

  it('58.0.3029.110', () => {
    assert.strictEqual(getMajorMinorVersion('58.0.3029.110'), '58.0');
  });
});

describe('parseUA', () => {
  it('Chrome', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
        browsers,
      ),
      {
        browser: { id: 'chrome', name: 'Chrome' },
        version: '85',
        fullVersion: '85.0.4183.121',
        os: { name: 'Mac OS', version: '10.15.6' },
        inBcd: true,
      },
    );
  });

  it('Chrome 1000.1 (not in BCD)', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/1000.1.4183.121 Safari/537.36',
        browsers,
      ),
      {
        browser: { id: 'chrome', name: 'Chrome' },
        version: '1000.1',
        fullVersion: '1000.1.4183.121',
        os: { name: 'Mac OS', version: '10.15.6' },
        inBcd: false,
      },
    );
  });

  it('Chrome Android', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Linux; Android 11; Pixel 2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36',
        browsers,
      ),
      {
        browser: { id: 'chrome_android', name: 'Chrome Android' },
        version: '85',
        fullVersion: '85.0.4183.101',
        os: { name: 'Android', version: '11' },
        inBcd: true,
      },
    );
  });

  it('Edge (EdgeHTML)', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299',
        browsers,
      ),
      {
        browser: { id: 'edge', name: 'Edge' },
        version: '16',
        fullVersion: '16.16299',
        os: { name: 'Windows', version: '10' },
        inBcd: true,
      },
    );
  });

  it('Edge (Chromium)', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36 Edg/84.0.522.59',
        browsers,
      ),
      {
        browser: { id: 'edge', name: 'Edge' },
        version: '84',
        fullVersion: '84.0.522.59',
        os: { name: 'Windows', version: '10' },
        inBcd: true,
      },
    );
  });

  it('Firefox 3.6.17', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Windows; U; Windows NT 5.2; en-US; rv:1.9.2.17) Gecko/20110420 Firefox/3.6.17 (.NET CLR 3.5.21022)',
        browsers,
      ),
      {
        browser: { id: 'firefox', name: 'Firefox' },
        version: '3.6',
        fullVersion: '3.6.17',
        os: { name: 'Windows', version: 'XP' },
        inBcd: true,
      },
    );
  });

  it('Internet Explorer (Windows XP)', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.2; Trident/4.0; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022)',
        browsers,
      ),
      {
        browser: { id: 'ie', name: 'Internet Explorer' },
        version: '8',
        fullVersion: '8.0',
        os: { name: 'Windows', version: 'XP' },
        inBcd: true,
      },
    );
  });

  it('Internet Explorer (Windows 7)', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
        browsers,
      ),
      {
        browser: { id: 'ie', name: 'Internet Explorer' },
        version: '11',
        fullVersion: '11.0',
        os: { name: 'Windows', version: '7' },
        inBcd: true,
      },
    );
  });

  it('Oculus Browser', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Linux; Android 7.0; SM-G920I Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/3.4.9 SamsungBrowser/4.0 Chrome/57.0.2987.146 Mobile VR Safari/537.36',
        browsers,
      ),
      {
        browser: { id: 'oculus', name: 'Oculus Browser' },
        version: '3.4',
        fullVersion: '3.4.9',
        os: { name: 'Android', version: '7.0' },
        inBcd: undefined,
      },
    );
  });

  it('Safari 14', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
        browsers,
      ),
      {
        browser: { id: 'safari', name: 'Safari' },
        version: '14',
        fullVersion: '14.0',
        os: { name: 'Mac OS', version: '10.15.6' },
        inBcd: true,
      },
    );
  });

  it('Safari 14.1 (read as Safari 14)', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15',
        browsers,
      ),
      {
        browser: { id: 'safari', name: 'Safari' },
        version: '14',
        fullVersion: '14.1',
        os: { name: 'Mac OS', version: '10.15.6' },
        inBcd: true,
      },
    );
  });

  it('Safari 15', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
        browsers,
      ),
      {
        browser: { id: 'safari', name: 'Safari' },
        version: '15',
        fullVersion: '15.0',
        os: { name: 'Mac OS', version: '10.15.6' },
        inBcd: true,
      },
    );
  });

  it('Safari 15.2', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15',
        browsers,
      ),
      {
        browser: { id: 'safari', name: 'Safari' },
        version: '15.2',
        fullVersion: '15.2',
        os: { name: 'Mac OS', version: '10.15.6' },
        inBcd: true,
      },
    );
  });

  it('Safari 15.3 (not in BCD)', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.3 Safari/605.1.15',
        browsers,
      ),
      {
        browser: { id: 'safari', name: 'Safari' },
        version: '15.3',
        fullVersion: '15.3',
        os: { name: 'Mac OS', version: '10.15.6' },
        inBcd: false,
      },
    );
  });

  it('Safari 16 (not in BCD)', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15',
        browsers,
      ),
      {
        browser: { id: 'safari', name: 'Safari' },
        version: '16.0',
        fullVersion: '16.0',
        os: { name: 'Mac OS', version: '10.15.6' },
        inBcd: false,
      },
    );
  });

  it('Safari 7.1 (ignored)', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/600.8.9 (KHTML, like Gecko) Version/7.1 Safari/600.8.9',
        browsers,
      ),
      {
        browser: { id: 'safari', name: 'Safari' },
        version: '7.1',
        fullVersion: '7.1',
        os: { name: 'Mac OS', version: '10.15.6' },
        inBcd: false,
      },
    );
  });

  it('Safari iOS', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
        browsers,
      ),
      {
        browser: { id: 'safari_ios', name: 'iOS Safari' },
        version: '13.4',
        fullVersion: '13.5.1',
        os: { name: 'iOS', version: '13.5.1' },
        inBcd: true,
      },
    );
  });

  it('Samsung Internet 10.1 (read as 10.0)', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36',
        browsers,
      ),
      {
        browser: { id: 'samsunginternet_android', name: 'Samsung Internet' },
        version: '10.0',
        fullVersion: '10.1',
        os: { name: 'Android', version: '9' },
        inBcd: true,
      },
    );
  });

  it('Samsung Internet 12.0', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Linux; Android 11; Pixel 2) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/12.0 Chrome/79.0.3945.136 Mobile Safari/537.36',
        browsers,
      ),
      {
        browser: { id: 'samsunginternet_android', name: 'Samsung Internet' },
        version: '12.0',
        fullVersion: '12.0',
        os: { name: 'Android', version: '11' },
        inBcd: true,
      },
    );
  });

  it('Samsung Internet 12.1', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Linux; Android 11; Pixel 2) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/12.1 Chrome/79.0.3945.136 Mobile Safari/537.36',
        browsers,
      ),
      {
        browser: { id: 'samsunginternet_android', name: 'Samsung Internet' },
        version: '12.1',
        fullVersion: '12.1',
        os: { name: 'Android', version: '11' },
        inBcd: true,
      },
    );
  });

  it('Samsung Internet 12.2 (not in BCD)', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Linux; Android 11; Pixel 2) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/12.2 Chrome/79.0.3945.136 Mobile Safari/537.36',
        browsers,
      ),
      {
        browser: { id: 'samsunginternet_android', name: 'Samsung Internet' },
        version: '12.2',
        fullVersion: '12.2',
        os: { name: 'Android', version: '11' },
        inBcd: false,
      },
    );
  });

  it('WebView Android (Android Browser, 1.1)', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Linux; U; Android 1.1; en-us; generic) AppleWebKit/525.10+ (KHTML, like Gecko) Version/3.0.4 Mobile Safari/523.12.2',
        browsers,
      ),
      {
        browser: { id: 'webview_android', name: 'WebView Android' },
        version: '1.1',
        fullVersion: '1.1',
        os: { name: 'Android', version: '1.1' },
        inBcd: true,
      },
    );
  });

  it('WebView Android (Android Browser, 4.4.2, Chrome 30)', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Linux; Android 4.4.2; Android SDK built for x86 Build/KK) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36',
        browsers,
      ),
      {
        browser: { id: 'webview_android', name: 'WebView Android' },
        version: '4.4',
        fullVersion: '4.4.2',
        os: { name: 'Android', version: '4.4.2' },
        inBcd: true,
      },
    );
  });

  it('WebView Android (Android Browser, 4.4.3, Chrome 33)', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Linux; U; Android 4.4.3; en-us; HTC_0P6B130 Build/KTU84L) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
        browsers,
      ),
      {
        browser: { id: 'webview_android', name: 'WebView Android' },
        version: '4.4.3',
        fullVersion: '4.4.3',
        os: { name: 'Android', version: '4.4.3' },
        inBcd: true,
      },
    );
  });

  it('WebView Android (Android Browser, 4.4.4, Chrome 33)', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Linux; U; Android 4.4.4; en-us; HTC_0P6B130 Build/KTU84L) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
        browsers,
      ),
      {
        browser: { id: 'webview_android', name: 'WebView Android' },
        version: '4.4.3',
        fullVersion: '4.4.4',
        os: { name: 'Android', version: '4.4.4' },
        inBcd: true,
      },
    );
  });

  it('WebView Android (Android Browser, 5.0.2, Chrome 37)', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Linux; Android 5.0.2; Android SDK built for x86_64 Build/LSY66K) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/37.0.0.0 Mobile Safari/537.36',
        browsers,
      ),
      {
        browser: { id: 'webview_android', name: 'WebView Android' },
        version: '37',
        fullVersion: '37.0.0.0',
        os: { name: 'Android', version: '5.0.2' },
        inBcd: true,
      },
    );
  });

  it('WebView Android (11, Chrome 86)', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Linux; Android 11; Pixel 2 Build/RP1A.200720.009; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.198 Mobile Safari/537.36 WEBVIEW TEST/1.2.1.80 (Phone; anonymous)',
        browsers,
      ),
      {
        browser: { id: 'webview_android', name: 'WebView Android' },
        version: '86',
        fullVersion: '86.0.4240.198',
        os: { name: 'Android', version: '11' },
        inBcd: true,
      },
    );
  });

  it('Chrome on iOS (not in BCD)', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/91.0.4472.80 Mobile/15E148 Safari/604.1',
        browsers,
      ),
      {
        browser: { id: 'chrome_ios', name: 'Chrome iOS' },
        version: '14.6',
        fullVersion: '14.6',
        os: { name: 'iOS', version: '14.6' },
        inBcd: undefined,
      },
    );
  });

  it('Yandex Browser (not in BCD)', () => {
    assert.deepEqual(
      parseUA(
        'Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 YaBrowser/17.6.1.749 Yowser/2.5 Safari/537.36',
        browsers,
      ),
      {
        browser: { id: 'yandex', name: 'Yandex' },
        version: '17.6',
        fullVersion: '17.6.1.749',
        os: { name: 'Windows', version: '8.1' },
        inBcd: undefined,
      },
    );
  });

  it('node-superagent (unparseable)', () => {
    assert.deepEqual(parseUA('node-superagent/1.2.3', browsers), {
      browser: { id: '', name: '' },
      version: '',
      fullVersion: '',
      os: { name: '', version: '' },
      inBcd: undefined,
    });
  });
});
