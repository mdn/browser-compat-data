/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

/** @import {InternalSupportBlock} from '../../types/index.js' */
/** @import {LinterMessageLevel} from '../types.js' */

import { Logger } from '../utils.js';

import {
  neverImplemented,
  implementedAndRemoved,
  processData,
} from './test-obsolete.js';

const referenceTime = new Date('2025-01-01T00:00:00Z');
const browsers = {
  chrome: {
    releases: {
      recent: { release_date: '2024-01-01' },
      info: { release_date: '2022-10-01' },
      old: { release_date: '2021-01-01' },
      undated: {},
      2: { release_date: '2009-05-21' },
    },
  },
};
/**
 * Check support against the synthetic browser release catalog.
 * @param {InternalSupportBlock} support Support data to inspect.
 * @returns {LinterMessageLevel | false} The obsolete check result.
 */
const check = (support) =>
  implementedAndRemoved(support, browsers, referenceTime);

describe('neverImplemented', () => {
  it('returns false for features which were implemented', () => {
    assert.equal(
      neverImplemented({
        chrome: { version_added: '1' },
      }),
      false,
    );
    assert.equal(
      neverImplemented({
        chrome: { version_added: '1', prefix: 'webkit' },
      }),
      false,
    );
    assert.equal(
      neverImplemented({
        chrome: [
          { version_added: '1', version_removed: '15' },
          { version_added: '17' },
        ],
      }),
      false,
    );
  });

  it('returns true for features which were not implemented', () => {
    assert.equal(
      neverImplemented({
        chrome: { version_added: false },
      }),
      true,
    );
  });
});

describe('implementedAndRemoved', () => {
  it('returns false for features which were implemented and never removed', () => {
    assert.equal(
      check({
        chrome: { version_added: '1' },
      }),
      false,
    );
    assert.equal(
      check({
        chrome: [
          {
            version_added: '2',
          },
          {
            version_added: '1',
            version_removed: '2',
            flags: [
              {
                type: 'preference',
                name: 'flag',
              },
            ],
          },
        ],
      }),
      false,
    );
    assert.equal(
      check({
        chrome: [
          {
            version_added: '2',
            version_removed: 'info',
          },
          {
            version_added: '1',
            version_removed: '2',
            flags: [
              {
                type: 'preference',
                name: 'flag',
              },
            ],
          },
        ],
        chrome_android: 'mirror',
        firefox: {
          version_added: false,
        },
        safari: {
          version_added: '6',
        },
      }),
      false,
    );
  });

  it('returns false for features which were implemented and removed recently', () => {
    assert.equal(
      check({
        chrome: {
          version_added: '1',
          version_removed: 'recent',
        },
      }),
      false,
    );
    assert.equal(
      check({
        chrome: [
          {
            version_added: '2',
            version_removed: 'recent',
          },
          {
            version_added: '1',
            version_removed: '2',
            flags: [
              {
                type: 'preference',
                name: 'flag',
              },
            ],
          },
        ],
      }),
      false,
    );
  });

  it('rule 2 info: returns "info" for features which were implemented and removed some time ago', () => {
    assert.equal(
      check({
        chrome: {
          version_added: '1',
          version_removed: 'info',
        },
      }),
      'info',
    );
    assert.equal(
      check({
        chrome: [
          {
            version_added: '2',
            version_removed: 'info',
          },
          {
            version_added: '1',
            version_removed: '2',
            flags: [
              {
                type: 'preference',
                name: 'flag',
              },
            ],
          },
        ],
      }),
      'info',
    );
    assert.equal(
      check({
        chrome: [
          {
            version_added: '2',
            version_removed: 'info',
          },
          {
            version_added: '1',
            version_removed: '2',
            flags: [
              {
                type: 'preference',
                name: 'flag',
              },
            ],
          },
        ],
        chrome_android: 'mirror',
        firefox: {
          version_added: false,
        },
      }),
      'info',
    );
  });

  it('returns "error" for features removed from old releases', () => {
    assert.equal(
      check({
        chrome: { version_added: '1', version_removed: 'old' },
      }),
      'error',
    );
  });

  it('returns false when the removed release has no date', () => {
    assert.equal(
      check({
        chrome: { version_added: '1', version_removed: 'undated' },
      }),
      false,
    );
  });
});

describe('processData', () => {
  it('logs nothing for features which are still on standards track', () => {
    const logger = new Logger('', '');
    processData(logger, {
      support: {
        chrome: {
          version_added: '1',
        },
      },
      status: {
        experimental: true,
        standard_track: true,
        deprecated: false,
      },
    });
    assert.equal(logger.messages.length, 0);
  });

  it('logs "error" for feature according to rule 1', () => {
    const logger = new Logger('', '');
    processData(logger, {
      support: {
        chrome: {
          version_added: false,
        },
      },
      status: {
        deprecated: true,
        experimental: false,
        standard_track: false,
      },
    });
    assert.equal(logger.messages.length, 1);
    assert.equal(logger.messages[0].level, 'error');
  });

  it('logs "info" for feature according to rule 2', () => {
    const logger = new Logger('', '');
    processData(
      logger,
      {
        support: {
          chrome: {
            version_added: '1',
            version_removed: 'info',
          },
        },
      },
      browsers,
      referenceTime,
    );
    assert.equal(logger.messages.length, 1);
    assert.equal(logger.messages[0].level, 'info');
  });
});
