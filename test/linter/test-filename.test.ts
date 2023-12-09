/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { Logger } from '../utils.js';
import { Identifier } from '../../types/types.js';

import test from './test-filename.js';

describe('test-filename', () => {
  let logger: Logger;
  let data: Identifier;
  beforeEach(() => {
    logger = new Logger('test', 'test');
    data = { api: { Interface: { feature: {} } } };
  });

  it('should not log an error for valid data and filepath', () => {
    const filepath = 'api/Interface/feature.json';
    test.check(logger, { data, path: { full: filepath } });
    assert.equal(logger.messages.length, 0);
  });

  it('should replace ".json" in filepath', () => {
    const filepath = 'api/Interface/feature.json';
    test.check(logger, { data, path: { full: filepath } });
    assert.equal(logger.messages.length, 0);
  });

  it('should replace "api/_globals" in filepath', () => {
    const filepath = 'api/_globals/feature.json';
    data = { api: { feature: {} } };
    test.check(logger, { data, path: { full: filepath } });
    assert.equal(logger.messages.length, 0);
  });

  it('should replace "api/Console" in filepath', () => {
    const filepath = 'api/Console/feature.json';
    data = { api: { console: { feature: {} } } };
    test.check(logger, { data, path: { full: filepath } });
    assert.equal(logger.messages.length, 0);
  });

  it('should replace "html/elements/input/" in filepath', () => {
    const filepath = 'html/elements/input/feature.json';
    data = { html: { elements: { input: { type_feature: {} } } } };
    test.check(logger, { data, path: { full: filepath } });
    assert.equal(logger.messages.length, 0);
  });

  it('should replace "javascript/builtins/globals" in filepath', () => {
    const filepath = 'javascript/builtins/globals/feature.json';
    data = { javascript: { builtins: { feature: {} } } };
    test.check(logger, { data, path: { full: filepath } });
    assert.equal(logger.messages.length, 0);
  });

  it('should log an error if testFilename fails', () => {
    const filepath = 'api/Interface/feature.json';
    data = { api: { Interface: { feature: {}, other: {} } } };
    test.check(logger, { data, path: { full: filepath } });
    assert.equal(logger.messages.length, 1);
  });
});
