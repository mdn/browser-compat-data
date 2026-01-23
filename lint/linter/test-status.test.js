/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {CompatStatement} from '../../types/types.js' */

import assert from 'node:assert/strict';

import { Logger } from '../utils.js';

import test, { checkExperimental } from './test-status.js';

describe('checkExperimental', () => {
  it('should return true when data is not experimental', () => {
    /** @type {CompatStatement} */
    const data = {
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
    /** @type {CompatStatement} */
    const data = {
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
    /** @type {CompatStatement} */
    const data = {
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

  it('should ignore non-relevant browsers when determining experimental status', () => {
    /** @type {CompatStatement} */
    const data = {
      status: {
        experimental: true,
        standard_track: true,
        deprecated: false,
      },
      support: {
        // Bun and Deno are not part of the Core browser set.
        firefox: {
          version_added: '1',
        },
        bun: {
          version_added: '1.0',
        },
        deno: {
          version_added: '1.0',
        },
      },
    };

    assert.equal(checkExperimental(data), true);
  });
});

describe('checkStatus', () => {
  /** @type {import('../utils.js').Logger} */
  let logger;

  beforeEach(() => {
    logger = new Logger('test', 'test');
  });

  it('should not log error when status is not defined', () => {
    /** @type {CompatStatement} */
    const data = {
      status: undefined,
      support: {},
    };

    test.check(logger, { data, path: { category: 'api' } });

    assert.equal(logger.messages.length, 0);
  });

  it('should log error when category is webextensions and status is defined', () => {
    /** @type {CompatStatement} */
    const data = {
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
    /** @type {CompatStatement} */
    const data = {
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
    /** @type {CompatStatement} */
    const data = {
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
    /** @type {CompatStatement} */
    const data = {
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
