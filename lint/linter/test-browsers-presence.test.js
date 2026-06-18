/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {InternalSupportBlock} from '../../types/index.js' */

import assert from 'node:assert/strict';

import { Logger } from '../utils.js';

import test from './test-browsers-presence.js';

describe('test-browsers-presence', () => {
  /** @type {Logger} */
  let logger;
  /** @type {{ support: InternalSupportBlock }} */
  let data;
  /** @type {string} */
  let category;

  beforeEach(() => {
    logger = new Logger('test', 'test');
    data = {
      support: {
        chrome: { version_added: '1' },
        chrome_android: 'mirror',
        firefox: { version_added: '1.5' },
        firefox_android: 'mirror',
        edge: { version_added: '12' },
        ie: { version_added: '6' },
        opera: { version_added: '7' },
        opera_android: 'mirror',
        safari: { version_added: '1.2' },
        safari_ios: 'mirror',
        samsunginternet_android: 'mirror',
        webview_android: 'mirror',
        webview_ios: 'mirror',
      },
    };
    category = 'api';
  });

  it('should log an error if a browser is not defined in BCD', async () => {
    data.support['unknownBrowser'] = { version_added: '1' };

    await test.check(logger, {
      data,
      path: { full: `${category}.Test`, category },
    });
    assert.equal(logger.messages.length, 2);
  });

  it('should log an error if a browser is invalid for the category', async () => {
    category = 'webextensions';
    data.support['nodejs'] = { version_added: '1' };

    await test.check(logger, {
      data,
      path: { full: `${category}.Test`, category },
    });
    assert.equal(logger.messages.length, 1);
  });

  it('should log an error if a required browser is missing', async () => {
    delete data.support.chrome;

    await test.check(logger, {
      data,
      path: { full: `${category}.Test`, category },
    });
    assert.equal(logger.messages.length, 1);
  });

  it('should log an error for unnecessary ie: { version_added: false }', async () => {
    data.support.ie = { version_added: false };

    await test.check(logger, {
      data,
      path: { full: `${category}.Test`, category },
    });
    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('ie'));
  });

  it('should not log an error for ie with actual support data', async () => {
    data.support.ie = { version_added: '11' };

    await test.check(logger, {
      data,
      path: { full: `${category}.Test`, category },
    });
    assert.equal(logger.messages.length, 0);
  });
});
