/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { Logger } from '../utils.js';

import test from './test-multiple-statements.js';

describe('test-multiple-statements', () => {
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

  it('should log error when multiple statements for the same key exist', () => {
    const data = {
      support: { firefox: [{ version_added: '1' }, { version_added: '2' }] },
    };

    test.check(logger, { data });

    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('has multiple statements'));
  });

  it('should not log error when multiple statements for different keys exist', () => {
    const data = {
      support: {
        safari: [
          { version_added: '1', prefix: 'webkit' },
          { version_added: '2', alternative_name: 'webkitFullScreen' },
        ],
      },
    };

    test.check(logger, { data });

    assert.equal(logger.messages.length, 0);
  });

  it('should ignore statements with partial_implementation, version_removed, or flags', () => {
    const data = {
      support: {
        edge: [
          { version_added: '12', partial_implementation: true },
          { version_added: '14', version_removed: '15' },
          { version_added: '17', flags: [] },
        ],
      },
    };

    test.check(logger, { data });

    assert.equal(logger.messages.length, 0);
  });
});
