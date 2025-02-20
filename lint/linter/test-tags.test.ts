/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { CompatStatement } from '../../types/types.js';
import { Logger } from '../utils.js';

import test from './test-tags.js';

describe('test.check', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger('test', 'test');
  });

  it('should not log error when tags are not defined', () => {
    const data: CompatStatement = {
      tags: undefined,
      support: {},
    };

    test.check(logger, { data });

    assert.equal(logger.messages.length, 0);
  });

  it('should not log error when tags are valid', () => {
    const data: CompatStatement = {
      tags: ['web-features:javascript'],
      support: {},
    };

    test.check(logger, { data });

    assert.equal(logger.messages.length, 0);
  });

  it('should log error when tags do not have a namespace', () => {
    const data: CompatStatement = {
      tags: ['tag1'],
      support: {},
    };

    test.check(logger, { data });

    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('Invalid tag found:'));
  });

  it('should log error when tags do not use one of the allowed namespaces', () => {
    const data: CompatStatement = {
      tags: ['namespace3:tag1'],
      support: {},
    };

    test.check(logger, { data });

    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('Invalid tag found:'));
  });

  it('should log an error when an invalid web-feature ID is used', () => {
    const data: CompatStatement = {
      tags: ['web-features:foo'],
      support: {},
    };

    test.check(logger, { data });

    assert.equal(logger.messages.length, 1);
    assert.ok(
      logger.messages[0].message.includes(
        'Non-registered web-features ID found:',
      ),
    );
  });
});
