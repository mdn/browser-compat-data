/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { CompatStatement } from '../../types/types.js';
import { Logger } from '../utils.js';
import bcd from '../../index.js';

import test, { checkExperimental, parseVersion } from './test-status.js';

const { browsers } = bcd;

/**
 * Find a Chrome version released within the last year (guaranteed to be < 2 years old)
 * @returns Chrome version string
 */
const getRecentChromeVersion = (): string => {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // Find the first retired version released within the last year
  const recentVersion = Object.entries(browsers.chrome.releases)
    .filter(
      ([, release]) => release.status === 'retired' && release.release_date,
    )
    .map(([version, release]) => ({
      version,
      date: new Date(release.release_date as string),
    }))
    .filter(({ date }) => date > oneYearAgo)
    .sort((a, b) => b.date.getTime() - a.date.getTime())[0];

  return recentVersion?.version || '130'; // Fallback to 130 if none found
};

/**
 * Find a Chrome version released more than 2 years ago
 * @returns Chrome version string
 */
const getOldChromeVersion = (): string => {
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  twoYearsAgo.setDate(twoYearsAgo.getDate() - 1); // Subtract one day for safety

  // Find a version released before 2 years ago
  const oldVersion = Object.entries(browsers.chrome.releases)
    .filter(
      ([, release]) => release.status === 'retired' && release.release_date,
    )
    .map(([version, release]) => ({
      version,
      date: new Date(release.release_date as string),
    }))
    .filter(({ date }) => date < twoYearsAgo)
    .sort((a, b) => b.date.getTime() - a.date.getTime())[0];

  return oldVersion?.version || '100'; // Fallback to 100 if none found
};

describe('parseVersion', () => {
  it('should return null for non-string values', () => {
    assert.equal(parseVersion(null), null);
    assert.equal(parseVersion(undefined), null);
    assert.equal(parseVersion(true), null);
    assert.equal(parseVersion(false), null);
  });

  it('should return null for preview version', () => {
    assert.equal(parseVersion('preview'), null);
  });

  it('should handle ≤ notation', () => {
    assert.equal(parseVersion('≤79'), '79');
    assert.equal(parseVersion('≤12'), '12');
  });

  it('should return version as-is for normal versions', () => {
    assert.equal(parseVersion('76'), '76');
    assert.equal(parseVersion('1'), '1');
    assert.equal(parseVersion('123'), '123');
  });
});

describe('checkExperimental', () => {
  it('should return valid:true when data is not experimental', () => {
    const data: CompatStatement = {
      status: {
        experimental: false,
        standard_track: true,
        deprecated: false,
      },
      support: {},
    };

    const result = checkExperimental(data);
    assert.equal(result.valid, true);
  });

  it('should return valid:true when data is experimental but supported by only one engine', () => {
    const data: CompatStatement = {
      status: {
        experimental: true,
        standard_track: true,
        deprecated: false,
      },
      support: {
        firefox: {
          version_added: '1',
        },
        chrome: {
          version_added: 'preview',
        },
      },
    };

    const result = checkExperimental(data);
    assert.equal(result.valid, true);
  });

  it('should return valid:false with multi-engine reason when experimental and supported by more than one engine', () => {
    const data: CompatStatement = {
      status: {
        experimental: true,
        standard_track: true,
        deprecated: false,
      },
      support: {
        firefox: {
          version_added: '1',
        },
        chrome: {
          version_added: '1',
        },
      },
    };

    const result = checkExperimental(data);
    assert.equal(result.valid, false);
    assert.equal(result.reason, 'multi-engine');
  });

  it('should return valid:false with single-engine-recent reason when experimental:false and single engine < 2 years', () => {
    const recentVersion = getRecentChromeVersion();
    const data: CompatStatement = {
      status: {
        experimental: false,
        standard_track: true,
        deprecated: false,
      },
      support: {
        chrome: {
          version_added: recentVersion,
        },
      },
    };

    const result = checkExperimental(data);
    assert.equal(result.valid, false);
    assert.equal(result.reason, 'single-engine-recent');
    assert.equal(result.engine, 'Blink');
    assert.ok(result.releaseDate);
  });

  it('should return valid:true when experimental:false and single engine >= 2 years old', () => {
    const oldVersion = getOldChromeVersion();
    const data: CompatStatement = {
      status: {
        experimental: false,
        standard_track: true,
        deprecated: false,
      },
      support: {
        chrome: {
          version_added: oldVersion,
        },
      },
    };

    const result = checkExperimental(data);
    assert.equal(result.valid, true);
  });

  it('should return valid:true when experimental:false and multiple engines', () => {
    const data: CompatStatement = {
      status: {
        experimental: false,
        standard_track: true,
        deprecated: false,
      },
      support: {
        firefox: {
          version_added: '130',
        },
        chrome: {
          version_added: '130',
        },
      },
    };

    const result = checkExperimental(data);
    assert.equal(result.valid, true);
  });

  it('should ignore features behind flags when checking engine count', () => {
    const recentVersion = getRecentChromeVersion();
    const data: CompatStatement = {
      status: {
        experimental: false,
        standard_track: true,
        deprecated: false,
      },
      support: {
        chrome: {
          version_added: recentVersion,
        },
        firefox: {
          version_added: '120',
          flags: [{ type: 'preference', name: 'test' }],
        },
      },
    };

    const result = checkExperimental(data);
    // Should see only Chrome (Blink) as having real support
    assert.equal(result.valid, false);
    assert.equal(result.reason, 'single-engine-recent');
  });

  it('should ignore preview versions when checking engine count', () => {
    const recentVersion = getRecentChromeVersion();
    const data: CompatStatement = {
      status: {
        experimental: false,
        standard_track: true,
        deprecated: false,
      },
      support: {
        chrome: {
          version_added: recentVersion,
        },
        firefox: {
          version_added: 'preview',
        },
      },
    };

    const result = checkExperimental(data);
    // Should see only Chrome (Blink) as having real support
    assert.equal(result.valid, false);
    assert.equal(result.reason, 'single-engine-recent');
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
        },
        chrome: {
          version_added: '1',
        },
      },
    };

    test.check(logger, { data, path: { category: 'api' } });

    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('should be set to'));
    assert.ok(logger.messages[0].message.includes('false'));
  });

  it('should log error when experimental:false but single engine support < 2 years', () => {
    const recentVersion = getRecentChromeVersion();
    const data: CompatStatement = {
      status: {
        experimental: false,
        standard_track: true,
        deprecated: false,
      },
      support: {
        chrome: {
          version_added: recentVersion,
        },
      },
    };

    test.check(logger, { data, path: { category: 'api' } });

    assert.equal(logger.messages.length, 1);
    assert.ok(logger.messages[0].message.includes('should be set to'));
    assert.ok(logger.messages[0].message.includes('true'));
    assert.ok(logger.messages[0].message.includes('single browser engine'));
    assert.ok(logger.messages[0].message.includes('Blink'));
  });

  it('should not log error when experimental:false and single engine support >= 2 years', () => {
    const oldVersion = getOldChromeVersion();
    const data: CompatStatement = {
      status: {
        experimental: false,
        standard_track: true,
        deprecated: false,
      },
      support: {
        chrome: {
          version_added: oldVersion,
        },
      },
    };

    test.check(logger, { data, path: { category: 'api' } });

    assert.equal(logger.messages.length, 0);
  });
});
