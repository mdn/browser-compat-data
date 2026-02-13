/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {InternalCompatStatement} from '../../types/index.js' */

import assert from 'node:assert/strict';

import { Logger } from '../utils.js';

import test from './test-tags.js';

describe('test.check', () => {
  /** @type {Logger} */
  let logger;

  beforeEach(() => {
    logger = new Logger('test', 'test');
  });

  it('should not log error when tags are not defined', () => {
    /** @type {InternalCompatStatement} */
    const data = {
      tags: undefined,
      support: {},
    };

    test.check(logger, { data, path: { full: 'api.Test', category: 'api' } });

    assert.equal(logger.messages.length, 0);
  });

  it('should not log error when tags are valid', () => {
    /** @type {InternalCompatStatement} */
    const data = {
      tags: ['web-features:javascript'],
      support: {},
    };

    test.check(logger, { data, path: { full: 'api.Test', category: 'api' } });

    assert.equal(logger.messages.length, 0);
  });

  it('should log error when tags do not have a namespace', () => {
    /** @type {InternalCompatStatement} */
    const data = {
      tags: ['tag1'],
      support: {},
    };

    test.check(logger, { data, path: { full: 'api.Test', category: 'api' } });

    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('Invalid tag found:'));
  });

  it('should log error when tags do not use one of the allowed namespaces', () => {
    /** @type {InternalCompatStatement} */
    const data = {
      tags: ['namespace3:tag1'],
      support: {},
    };

    test.check(logger, { data, path: { full: 'api.Test', category: 'api' } });

    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('Invalid tag found:'));
  });

  it('should log an error when an invalid web-feature ID is used', () => {
    /** @type {InternalCompatStatement} */
    const data = {
      tags: ['web-features:foo'],
      support: {},
    };

    test.check(logger, { data, path: { full: 'api.Test', category: 'api' } });

    assert.equal(logger.messages.length, 1);
    assert.ok(
      logger.messages[0].message.includes(
        'Non-registered web-features ID found:',
      ),
    );
  });
});
