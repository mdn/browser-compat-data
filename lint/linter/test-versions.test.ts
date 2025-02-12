/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { Logger } from '../utils.js';
import { InternalSupportBlock } from '../../types/index.js';

import test from './test-versions.js';

describe('test-versions', () => {
  let logger: Logger;
  let support: InternalSupportBlock;

  beforeEach(() => {
    logger = new Logger('test', 'test');
    support = {
      chrome: {
        version_added: '1',
      },
      chrome_android: {
        version_added: '18',
      },
      edge: {
        version_added: '12',
      },
      firefox: {
        version_added: '1',
      },
      firefox_android: {
        version_added: '4',
      },
      opera: {
        version_added: '2',
      },
      opera_android: {
        version_added: '10.1',
      },
      safari: {
        version_added: '1',
      },
      safari_ios: {
        version_added: '1',
      },
      samsunginternet_android: {
        version_added: '1.0',
      },
      webview_android: {
        version_added: '1',
      },
    };
  });

  it('should log error when a browser is set to mirror but does not have an upstream browser', () => {
    support.chrome = 'mirror';
    test.check(logger, {
      data: { support },
      path: { category: 'api' },
    });
    assert.equal(logger.messages.length, 1);
    assert.ok(
      logger.messages[0].message.includes('does not have an upstream browser'),
    );
  });

  it('should log error when version_removed is less than or equal to version_added', () => {
    support.chrome = {
      version_added: '2',
      version_removed: '1',
    };
    support.firefox = {
      version_added: '2',
      version_removed: '2',
    };
    test.check(logger, {
      data: { support },
      path: { category: 'api' },
    });
    assert.equal(logger.messages.length, 2);
    assert.ok(logger.messages[0].message.includes('must be greater than'));
    assert.ok(logger.messages[1].message.includes('must be greater than'));
  });

  it('should log error when flags are present but not supported by the browser', () => {
    support.samsunginternet_android = {
      version_added: '1.0',
      flags: [],
    };
    test.check(logger, {
      data: { support },
      path: { category: 'api' },
    });
    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('does not support flags'));
  });

  it('should log error when version_added is false but additional properties suggest support', () => {
    support.chrome = {
      version_added: false,
      version_removed: '1',
    };
    test.check(logger, {
      data: { support },
      path: { category: 'api' },
    });
    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('suggest support'));
  });

  it('should log error when version_added is false in an array of statements', () => {
    support.chrome = [{ version_added: false }, { version_added: '1' }];
    test.check(logger, {
      data: { support },
      path: { category: 'api' },
    });
    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('in an array of statements'));
  });
});
