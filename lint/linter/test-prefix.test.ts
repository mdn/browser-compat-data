/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { Logger } from '../utils.js';

import test from './test-prefix.js';

describe('test-prefix', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger('test', 'test');
  });

  it('should log error when both prefix and alternative name are defined', () => {
    const data = {
      support: {
        firefox: {
          prefix: 'moz',
          alternative_name: 'otherFeatureName',
        },
      },
    };

    test.check(logger, { data, path: { category: 'api', full: 'feature' } });

    assert.equal(logger.messages.length, 1);
    assert.ok(
      logger.messages[0].message.includes(
        'Both prefix and alternative name are defined',
      ),
    );
  });

  it('should log error when prefix is invalid for category', () => {
    const data = {
      support: {
        firefox: {
          prefix: 'invalidPrefix',
        },
      },
    };

    test.check(logger, { data, path: { category: 'api', full: 'feature' } });

    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('which is invalid for'));
  });

  it('should log error when alternative name should be replaced with prefix', () => {
    const data = {
      support: {
        firefox: {
          alternative_name: 'mozfeature',
        },
        safari: {
          alternative_name: '::webkitFeature',
        },
      },
    };

    test.check(logger, { data, path: { category: 'api', full: 'feature' } });

    assert.equal(logger.messages.length, 2);
    assert.ok(logger.messages[0].message.includes('instead of'));
    assert.ok(logger.messages[1].message.includes('instead of'));
  });

  it('should not log error when data is valid', () => {
    const data = {
      support: {
        firefox: {
          prefix: 'moz',
        },
      },
    };

    test.check(logger, { data, path: { category: 'api', full: 'feature' } });

    assert.equal(logger.messages.length, 0);
  });
});
