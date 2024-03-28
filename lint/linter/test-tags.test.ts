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
      tags: ['web-features:tag1'],
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

  it('should log error when tag name uses characters other than lowercase alphanumeric and hyphen', () => {
    const data: CompatStatement = {
      tags: ['namespace1:tag$'],
      support: {},
    };

    test.check(logger, { data });

    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('Invalid tag found:'));
  });
});
