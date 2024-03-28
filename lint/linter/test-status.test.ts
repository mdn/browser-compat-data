/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { CompatStatement } from '../../types/types.js';
import { Logger } from '../utils.js';

import test, { checkExperimental } from './test-status.js';

describe('checkExperimental', () => {
  it('should return true when data is not experimental', () => {
    const data: CompatStatement = {
      status: {
        experimental: false,
        standard_track: true,
        deprecated: false,
      },
      support: {},
    };

    assert.equal(checkExperimental(data), true);
  });

  it('should return true when data is experimental but supported by only one engine', () => {
    const data: CompatStatement = {
      status: {
        experimental: true,
        standard_track: true,
        deprecated: false,
      },
      support: {
        firefox: {
          version_added: '1',
          version_removed: null,
        },
        chrome: {
          version_added: 'preview',
          version_removed: null,
        },
      },
    };

    assert.equal(checkExperimental(data), true);
  });

  it('should return false when data is experimental and supported by more than one engine', () => {
    const data: CompatStatement = {
      status: {
        experimental: true,
        standard_track: true,
        deprecated: false,
      },
      support: {
        firefox: {
          version_added: '1',
          version_removed: null,
        },
        chrome: {
          version_added: '1',
          version_removed: null,
        },
      },
    };

    assert.equal(checkExperimental(data), false);
  });
});

describe('checkStatus', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger('test', 'test');
  });

  it('should not log error when status is not defined', () => {
    const data: CompatStatement = {
      status: undefined,
      support: {},
    };

    test.check(logger, { data, path: { category: 'api' } });

    assert.equal(logger.messages.length, 0);
  });

  it('should log error when category is webextensions and status is defined', () => {
    const data: CompatStatement = {
      status: {
        experimental: false,
        standard_track: true,
        deprecated: false,
      },
      support: {},
    };

    test.check(logger, { data, path: { category: 'webextensions' } });

    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('not allowed'));
  });

  it('should log error when status is both experimental and deprecated', () => {
    const data: CompatStatement = {
      status: {
        experimental: true,
        standard_track: true,
        deprecated: true,
      },
      support: {},
    };

    test.check(logger, { data, path: { category: 'api' } });

    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('Unexpected simultaneous'));
  });

  it('should log error when status is non-standard but has a spec_url', () => {
    const data: CompatStatement = {
      status: {
        experimental: false,
        standard_track: false,
        deprecated: false,
      },
      spec_url: 'https://example.com',
      support: {},
    };

    test.check(logger, { data, path: { category: 'api' } });

    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('but has a'));
  });

  it('should log error when status is experimental and supported by more than one engine', () => {
    const data: CompatStatement = {
      status: {
        experimental: true,
        standard_track: true,
        deprecated: false,
      },
      support: {
        firefox: {
          version_added: '1',
          version_removed: null,
        },
        chrome: {
          version_added: '1',
          version_removed: null,
        },
      },
    };

    test.check(logger, { data, path: { category: 'api' } });

    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('should be set to'));
  });
});
