/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { Logger } from '../utils.js';

import test from './test-overlapping-statements.js';

describe('test-overlapping-statements', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger('test', 'test');
  });

  it('should skip processing when data is not an array', () => {
    const data = {
      support: {
        chrome: {
          version_added: '1',
          version_removed: '2',
        },
      },
    };

    test.check(logger, { data });

    assert.equal(logger.messages.length, 0);
  });

  it('should log error when statements overlap', () => {
    const data = {
      support: {
        firefox: [
          { version_added: '2' },
          { version_added: '1', version_removed: '3' },
        ],
      },
    };

    test.check(logger, { data });

    assert.equal(logger.messages.length, 1);
    assert.ok(
      logger.messages[0].message.includes('has overlapping statements'),
    );
  });
});
