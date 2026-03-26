/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {Identifier} from '../../types/types.js' */

import assert from 'node:assert/strict';

import { Logger } from '../utils.js';

import test from './test-filename.js';

describe('test-filename', () => {
  /** @type {Logger} */
  let logger;
  /** @type {Identifier} */
  let data;
  beforeEach(() => {
    logger = new Logger('test', 'test');
    data = { api: { Interface: { feature: {} } } };
  });

  it('should not log an error for valid data and filepath', async () => {
    const filepath = 'api/Interface/feature.json';
    await test.check(logger, {
      data,
      path: { full: filepath, category: 'api' },
    });
    assert.equal(logger.messages.length, 0);
  });

  it('should replace ".json" in filepath', async () => {
    const filepath = 'api/Interface/feature.json';
    await test.check(logger, {
      data,
      path: { full: filepath, category: 'api' },
    });
    assert.equal(logger.messages.length, 0);
  });

  it('should replace "api/_globals" in filepath', async () => {
    const filepath = 'api/_globals/feature.json';
    data = { api: { feature: {} } };
    await test.check(logger, {
      data,
      path: { full: filepath, category: 'api' },
    });
    assert.equal(logger.messages.length, 0);
  });

  it('should replace "api/Console" in filepath', async () => {
    const filepath = 'api/Console/feature.json';
    data = { api: { console: { feature: {} } } };
    await test.check(logger, {
      data,
      path: { full: filepath, category: 'api' },
    });
    assert.equal(logger.messages.length, 0);
  });

  it('should replace "html/elements/input/" in filepath', async () => {
    const filepath = 'html/elements/input/feature.json';
    data = { html: { elements: { input: { type_feature: {} } } } };
    await test.check(logger, {
      data,
      path: { full: filepath, category: 'html' },
    });
    assert.equal(logger.messages.length, 0);
  });

  it('should replace "javascript/builtins/globals" in filepath', async () => {
    const filepath = 'javascript/builtins/globals/feature.json';
    data = { javascript: { builtins: { feature: {} } } };
    await test.check(logger, {
      data,
      path: { full: filepath, category: 'javascript' },
    });
    assert.equal(logger.messages.length, 0);
  });

  it('should log an error if testFilename fails', async () => {
    const filepath = 'api/Interface/feature.json';
    data = { api: { Interface: { feature: {}, other: {} } } };
    await test.check(logger, {
      data,
      path: { full: filepath, category: 'api' },
    });
    assert.equal(logger.messages.length, 1);
  });
});
