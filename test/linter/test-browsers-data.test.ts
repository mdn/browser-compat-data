/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { Logger } from '../utils.js';
import { BrowserStatement } from '../../types/types.js';

import test from './test-browsers-data.js';

describe('test-browsers-data', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger('test', 'test');
  });

  it('should log an error if a browser has multiple current releases', () => {
    const browser = 'nodejs';
    const data: BrowserStatement = {
      name: 'Node.js',
      type: 'server',
      accepts_flags: true,
      accepts_webextensions: false,
      releases: {
        '20.6.0': {
          status: 'current',
        },
        '21.2.0': {
          status: 'current',
        },
      },
    };

    test.check(logger, { data, path: { browser } });
    assert.equal(logger.messages.length, 1);
  });

  it('should log an error if a browser has multiple nightly releases', () => {
    const browser = 'firefox';
    const data: BrowserStatement = {
      name: 'Firefox',
      type: 'desktop',
      accepts_flags: true,
      accepts_webextensions: true,
      releases: {
        '1': { status: 'nightly' },
        '2': { status: 'nightly' },
      },
    };
    test.check(logger, { data, path: { browser } });
    assert.equal(logger.messages.length, 1);
  });

  it('should not log an error if a server engine has multiple nightly releases', () => {
    const browser = 'nodejs';
    const data: BrowserStatement = {
      name: 'Node.js',
      type: 'server',
      accepts_flags: true,
      accepts_webextensions: false,
      releases: {
        '1': { status: 'nightly' },
        '2': { status: 'nightly' },
      },
    };
    test.check(logger, { data, path: { browser } });
    assert.equal(logger.messages.length, 1);
  });

  it('should log an error if the upstream for a browser is set to itself', () => {
    const browser = 'safari_ios';
    const data: BrowserStatement = {
      name: 'Safari iOS',
      type: 'mobile',
      upstream: browser,
      accepts_flags: false,
      accepts_webextensions: false,
      releases: {},
    };

    test.check(logger, { data, path: { browser } });
    assert.equal(logger.messages.length, 1);
  });

  it('should log an error if the upstream for a browser is an unknown browser', () => {
    const browser = 'safari_ios';
    const data: BrowserStatement = {
      name: 'Safari iOS',
      type: 'mobile',
      upstream: 'unknown' as any,
      accepts_flags: false,
      accepts_webextensions: false,
      releases: {},
    };

    test.check(logger, { data, path: { browser } });
    assert.equal(logger.messages.length, 1);
  });
});
