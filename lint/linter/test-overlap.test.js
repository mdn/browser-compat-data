/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {CompatStatement} from '../../types/types.js' */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { Logger } from '../utils.js';

import test from './test-overlap.js';

describe('overlap', () => {
  const path = { full: 'api.Test', category: 'api' };

  /** @type {Logger} */
  let logger;

  beforeEach(() => {
    logger = new Logger('test', 'test');
  });

  it('should skip processing when data is not an array', () => {
    /** @type {CompatStatement} */
    const data = {
      support: {
        chrome: {
          version_added: '1',
          version_removed: '2',
        },
      },
    };

    test.check(logger, { data, path });

    assert.equal(logger.messages.length, 0);
  });

  it('should log error when statements overlap', () => {
    /** @type {CompatStatement} */
    const data = {
      support: {
        firefox: [
          { version_added: '2' },
          { version_added: '1', version_removed: '3' },
        ],
      },
    };

    test.check(logger, { data, path });

    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('statements overlap'));
  });

  it('should log error when overlapping statements are not sorted', () => {
    /** @type {CompatStatement} */
    const data = {
      support: {
        firefox: [
          { version_added: '1', version_removed: '3' },
          { version_added: '2' },
        ],
      },
    };

    test.check(logger, { data, path });

    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('statements overlap'));
  });

  it('should log error when statements with same prefix overlap', () => {
    /** @type {CompatStatement} */
    const data = {
      support: {
        firefox: [
          { prefix: '-moz', version_added: '1', version_removed: '3' },
          { prefix: '-moz', version_added: '2' },
        ],
      },
    };

    test.check(logger, { data, path });

    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('statements overlap'));
  });

  it('should log error when statements with same alternative name overlap', () => {
    /** @type {CompatStatement} */
    const data = {
      support: {
        firefox: [
          {
            alternative_name: 'MozObject',
            version_added: '1',
            version_removed: '3',
          },
          { alternative_name: 'MozObject', version_added: '2' },
        ],
      },
    };

    test.check(logger, { data, path });

    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('statements overlap'));
  });

  it('should log error when there are two statements without version_added', () => {
    /** @type {CompatStatement} */
    const data = {
      support: {
        firefox: [
          {
            version_added: '133',
          },
          {
            version_added: '131',
          },
        ],
      },
    };

    test.check(logger, { data, path });

    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('statements overlap'));
  });

  it('should log error when there are two statements without version_added incl. preview', () => {
    /** @type {CompatStatement} */
    const data = {
      support: {
        firefox: [
          {
            version_added: 'preview',
          },
          {
            version_added: '131',
          },
        ],
      },
    };

    test.check(logger, { data, path });

    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('statements overlap'));
  });

  it('should ignore when partial support in stable and full support in preview overlap', () => {
    /** @type {CompatStatement} */
    const data = {
      support: {
        firefox: [
          {
            version_added: 'preview',
          },
          {
            version_added: '43',
            partial_implementation: true,
          },
        ],
      },
    };

    test.check(logger, { data, path });

    assert.equal(logger.messages.length, 0);
  });

  it('should ignore preview version without overlap', () => {
    /** @type {CompatStatement} */
    const data = {
      support: {
        firefox: [
          {
            version_added: 'preview',
          },
          {
            version_added: '131',
            version_removed: '133',
          },
        ],
      },
    };

    test.check(logger, { data, path });

    assert.equal(logger.messages.length, 0);
  });
});
