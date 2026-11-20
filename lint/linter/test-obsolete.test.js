/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

/** @import {InternalSupportBlock} from '../../types/index.js' */
/** @import {LinterMessageLevel} from '../types.js' */

import { Logger } from '../utils.js';

// Frozen subset of `browsers/*.json`, so data updates don't change results.
import browsers from './fixtures/browsers.json' with { type: 'json' };
import {
  neverImplemented,
  implementedAndRemoved,
  processData,
} from './test-obsolete.js';

// Snapshot date: Chrome 145 is recent, 128 is 2-2.5 years old, 121 and 80 are older, 160 is undated.
const referenceTime = new Date('2026-11-17T00:00:00Z');
/**
 * Check support against the browser release snapshot.
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
            version_removed: '128',
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
          version_removed: '145',
        },
      }),
      false,
    );
    assert.equal(
      check({
        chrome: [
          {
            version_added: '2',
            version_removed: '145',
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
          version_removed: '128',
        },
      }),
      'info',
    );
    assert.equal(
      check({
        chrome: [
          {
            version_added: '2',
            version_removed: '128',
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
            version_removed: '128',
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
        chrome: { version_added: '1', version_removed: '80' },
      }),
      'error',
    );
  });

  it('returns "error" for features removed more than 2.5 years ago', () => {
    assert.equal(
      check({
        chrome: { version_added: '1', version_removed: '121' },
      }),
      'error',
    );
  });

  for (const { name, version_removed } of [
    { name: 'has no date', version_removed: '160' },
    { name: 'is unknown', version_removed: '999' },
  ]) {
    it(`returns false when the removed release ${name}`, () => {
      assert.equal(
        check({
          chrome: { version_added: '1', version_removed },
        }),
        false,
      );
    });
  }
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
            version_removed: '128',
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
