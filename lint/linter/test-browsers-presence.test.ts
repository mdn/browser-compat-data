/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { Logger } from '../utils.js';
import { CompatStatement } from '../../types/types.js';

import test from './test-browsers-presence.js';

describe('test-browsers-presence', () => {
  let logger: Logger;
  let data: CompatStatement;
  let category: string;

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

  it('should log an error if a browser is not defined in BCD', () => {
    data.support['unknownBrowser'] = { version_added: '1' };

    test.check(logger, { data, path: { category } });
    assert.equal(logger.messages.length, 2);
  });

  it('should log an error if a browser is invalid for the category', () => {
    category = 'webextensions';
    data.support['nodejs'] = { version_added: '1' };

    test.check(logger, { data, path: { category } });
    assert.equal(logger.messages.length, 1);
  });

  it('should log an error if a required browser is missing', () => {
    delete data.support.chrome;

    test.check(logger, { data, path: { category } });
    assert.equal(logger.messages.length, 1);
  });
});
