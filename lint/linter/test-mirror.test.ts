/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { Logger } from '../utils.js';

import test from './test-mirror.js';

describe('test-mirror', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger('test', 'test');
  });

  it('should log error when data can be automatically mirrored', () => {
    const supportData = {
      chrome: {
        version_added: '89',
      },
      chrome_android: {
        version_added: '89',
      },
    };
    const category = 'api';

    test.check(logger, { data: { support: supportData }, path: { category } });

    assert.equal(logger.messages.length, 1);
    assert.ok(
      logger.messages[0].message.includes('can be automatically mirrored'),
    );
    assert.equal(logger.messages[0].fixable, true);
  });

  describe('Mirroring', () => {
    test.check(logger, {
      data: {
        support: {
          chrome: {
            version_added: '89',
          },
          firefox: {
            version_added: '90',
          },
        },
      },
      path: {
        category: 'webextensions',
      },
    });

    it('should not log any errors', () => {
      assert.equal(logger.messages.length, 0);
    });
  });

  it('should not log error when data cannot be automatically mirrored', () => {
    const supportData = {
      chrome: {
        version_added: '89',
      },
      firefox: {
        version_added: '90',
      },
    };
    const category = 'webextensions';

    test.check(logger, { data: { support: supportData }, path: { category } });
    assert.equal(logger.messages.length, 0);
  });
});
