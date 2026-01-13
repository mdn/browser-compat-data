/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import bcd from '../../index.js';
import { Logger } from '../utils.js';

import {
  neverImplemented,
  implementedAndRemoved,
  processData,
} from './test-obsolete.js';
const { browsers } = bcd;

const errorTime = new Date(),
  infoTime = new Date();
errorTime.setFullYear(errorTime.getFullYear() - 2.5);
infoTime.setFullYear(infoTime.getFullYear() - 2);
const release = Object.entries(browsers.chrome.releases).find((r) => {
  if (r[1].release_date === undefined) {
    return false;
  }
  const date = new Date(r[1].release_date);
  return errorTime < date && date < infoTime;
});

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
        chrome: { version_added: null },
      }),
      true,
    );
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
    assert.ok(release);
    assert.equal(
      implementedAndRemoved({
        chrome: { version_added: '1' },
      }),
      false,
    );
    assert.equal(
      implementedAndRemoved({
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
      implementedAndRemoved({
        chrome: [
          {
            version_added: '2',
            version_removed: release[0],
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
      implementedAndRemoved({
        chrome: {
          version_added: '1',
          version_removed: Object.keys(browsers.chrome.releases)[-1],
        },
      }),
      false,
    );
    assert.equal(
      implementedAndRemoved({
        chrome: [
          {
            version_added: '2',
            version_removed: Object.keys(browsers.chrome.releases)[-1],
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
    // Make sure there is a suitable release
    assert.ok(release);
    const version_removed = release[0];
    assert.equal(
      implementedAndRemoved({
        chrome: {
          version_added: '1',
          version_removed,
        },
      }),
      'info',
    );
    assert.equal(
      implementedAndRemoved({
        chrome: [
          {
            version_added: '2',
            version_removed,
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
      implementedAndRemoved({
        chrome: [
          {
            version_added: '2',
            version_removed,
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
    // Make sure there is a suitable release
    assert.ok(release);
    const version_removed = release[0];
    processData(logger, {
      support: {
        chrome: {
          version_added: '1',
          version_removed,
        },
      },
    });
    assert.equal(logger.messages.length, 1);
    assert.equal(logger.messages[0].level, 'info');
  });
});
