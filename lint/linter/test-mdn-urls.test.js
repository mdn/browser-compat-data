/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

/** @import {CompatStatement} from '../../types/types.js' */

import { inventory } from '../../utils/mdn-content-inventory.js';

import { processData, urlsByPath } from './test-mdn-urls.js';

/**
 * Create a minimal CompatStatement with the given mdn_url
 * @param {string} url The MDN URL
 * @returns {CompatStatement} The compat statement
 */
const compat = (url) => /** @type {CompatStatement} */ ({ mdn_url: url });

/** @type {CompatStatement} */
const noUrl = /** @type {CompatStatement} */ ({});

// Save originals for restore after mocking.
const originalSlugs = inventory.slugs;
const originalSlugByPath = inventory.slugByPath;
const originalRedirects = inventory.redirects;

/**
 * Replace inventory with mock data, restoring originals in afterEach.
 * @param {object} [overrides]
 * @param {Map<string, string>} [overrides.slugs]
 * @param {Map<string, string>} [overrides.slugByPath]
 * @param {Record<string, string>} [overrides.redirects]
 */
const mockInventory = (overrides = {}) => {
  inventory.slugs = overrides.slugs ?? new Map();
  inventory.slugByPath = overrides.slugByPath ?? new Map();
  inventory.redirects = overrides.redirects ?? {};
};

afterEach(() => {
  urlsByPath.clear();
  inventory.slugs = originalSlugs;
  inventory.slugByPath = originalSlugByPath;
  inventory.redirects = originalRedirects;
});

describe('processData - mdn_url_redirect', () => {
  it('returns an issue when mdn_url points to a redirected page', () => {
    mockInventory({
      redirects: {
        '/en-US/docs/Old/Page': '/en-US/docs/New/Page',
      },
    });
    const issues = processData(
      compat('https://developer.mozilla.org/docs/Old/Page'),
      'some.feature',
    );
    const matches = issues.filter((i) => i.ruleName === 'mdn_url_redirect');
    assert.equal(matches.length, 1);
    assert.equal(
      matches[0].actual,
      'https://developer.mozilla.org/docs/Old/Page',
    );
    assert.equal(
      matches[0].expected,
      'https://developer.mozilla.org/docs/New/Page',
    );
  });

  it('returns no redirect issue when the URL is not redirected', () => {
    mockInventory({
      slugs: new Map([['web/api/foo', 'Web/API/Foo']]),
    });
    const issues = processData(
      compat('https://developer.mozilla.org/docs/Web/API/Foo'),
      'some.feature',
    );
    const matches = issues.filter((i) => i.ruleName === 'mdn_url_redirect');
    assert.equal(matches.length, 0);
  });
});

describe('processData - mdn_url_casing', () => {
  it('returns an issue when the slug casing is wrong', () => {
    mockInventory({
      slugs: new Map([['web/api/foo', 'Web/API/Foo']]),
    });
    const issues = processData(
      compat('https://developer.mozilla.org/docs/Web/API/foo'),
      'some.feature',
    );
    const matches = issues.filter((i) => i.ruleName === 'mdn_url_casing');
    assert.equal(matches.length, 1);
    assert.equal(
      matches[0].expected,
      'https://developer.mozilla.org/docs/Web/API/Foo',
    );
  });

  it('preserves hash when correcting casing', () => {
    mockInventory({
      slugs: new Map([['web/api/foo', 'Web/API/Foo']]),
    });
    const issues = processData(
      compat('https://developer.mozilla.org/docs/Web/API/foo#bar'),
      'some.feature',
    );
    const matches = issues.filter((i) => i.ruleName === 'mdn_url_casing');
    assert.equal(matches.length, 1);
    assert.equal(
      matches[0].expected,
      'https://developer.mozilla.org/docs/Web/API/Foo#bar',
    );
  });
});

describe('processData - mdn_url_404', () => {
  it('returns an issue when the slug does not exist', () => {
    mockInventory();
    const issues = processData(
      compat('https://developer.mozilla.org/docs/Web/API/NoSuchPage'),
      'some.feature',
    );
    const matches = issues.filter((i) => i.ruleName === 'mdn_url_404');
    assert.equal(matches.length, 1);
    assert.equal(matches[0].expected, '');
  });
});

describe('processData - mdn_url_other_page', () => {
  it('returns an issue when slugByPath maps to a different page', () => {
    mockInventory({
      slugs: new Map([['web/api/wrong', 'Web/API/Wrong']]),
      slugByPath: new Map([['api.Foo', 'Web/API/Correct']]),
    });
    const issues = processData(
      compat('https://developer.mozilla.org/docs/Web/API/Wrong'),
      'api.Foo',
    );
    const matches = issues.filter((i) => i.ruleName === 'mdn_url_other_page');
    assert.equal(matches.length, 1);
    assert.equal(
      matches[0].expected,
      'https://developer.mozilla.org/docs/Web/API/Correct',
    );
  });

  it('does not flag when URL has a hash fragment', () => {
    mockInventory({
      slugs: new Map([['web/api/wrong', 'Web/API/Wrong']]),
      slugByPath: new Map([['api.Foo', 'Web/API/Correct']]),
    });
    const issues = processData(
      compat('https://developer.mozilla.org/docs/Web/API/Wrong#section'),
      'api.Foo',
    );
    const matches = issues.filter((i) => i.ruleName === 'mdn_url_other_page');
    assert.equal(matches.length, 0);
  });

  it('does not flag when the URL already matches slugByPath', () => {
    mockInventory({
      slugs: new Map([['web/api/foo', 'Web/API/Foo']]),
      slugByPath: new Map([['api.Foo', 'Web/API/Foo']]),
    });
    const issues = processData(
      compat('https://developer.mozilla.org/docs/Web/API/Foo'),
      'api.Foo',
    );
    const matches = issues.filter((i) => i.ruleName === 'mdn_url_other_page');
    assert.equal(matches.length, 0);
  });
});

describe('processData - mdn_url_casing_hash', () => {
  it('returns an issue when the hash has uppercase characters', () => {
    mockInventory({
      slugs: new Map([['web/api/foo', 'Web/API/Foo']]),
    });
    const issues = processData(
      compat('https://developer.mozilla.org/docs/Web/API/Foo#SomeSection'),
      'some.feature',
    );
    const matches = issues.filter((i) => i.ruleName === 'mdn_url_casing_hash');
    assert.equal(matches.length, 1);
    assert.equal(
      matches[0].expected,
      'https://developer.mozilla.org/docs/Web/API/Foo#somesection',
    );
  });

  it('returns no issue when the hash is already lowercase', () => {
    mockInventory({
      slugs: new Map([['web/api/foo', 'Web/API/Foo']]),
    });
    const issues = processData(
      compat('https://developer.mozilla.org/docs/Web/API/Foo#somesection'),
      'some.feature',
    );
    const matches = issues.filter((i) => i.ruleName === 'mdn_url_casing_hash');
    assert.equal(matches.length, 0);
  });
});

describe('processData - mdn_url_new_page', () => {
  it('returns an issue when no mdn_url is set but slugByPath has a match', () => {
    mockInventory({
      slugByPath: new Map([['api.Foo', 'Web/API/Foo']]),
    });
    const issues = processData(noUrl, 'api.Foo');
    const matches = issues.filter((i) => i.ruleName === 'mdn_url_new_page');
    assert.equal(matches.length, 1);
    assert.equal(matches[0].actual, '');
    assert.equal(
      matches[0].expected,
      'https://developer.mozilla.org/docs/Web/API/Foo',
    );
  });

  it('returns no issue when no mdn_url and no slugByPath match', () => {
    mockInventory();
    const issues = processData(noUrl, 'api.Unknown');
    const matches = issues.filter((i) => i.ruleName === 'mdn_url_new_page');
    assert.equal(matches.length, 0);
  });
});

describe('processData - mdn_url_duplicate_ancestor', () => {
  it('returns no issues when no ancestor has the same mdn_url', () => {
    mockInventory({
      slugs: new Map([
        ['web/api/foo', 'Web/API/Foo'],
        ['web/api/foo/bar', 'Web/API/Foo/bar'],
      ]),
    });
    urlsByPath.set('api.Foo', 'https://developer.mozilla.org/docs/Web/API/Foo');
    const issues = processData(
      compat('https://developer.mozilla.org/docs/Web/API/Foo/bar'),
      'api.Foo.bar',
    );
    assert.equal(
      issues.filter((i) => i.ruleName === 'mdn_url_duplicate_ancestor').length,
      0,
    );
  });

  it('returns an issue when mdn_url matches a direct parent', () => {
    mockInventory({
      slugs: new Map([['web/api/foo', 'Web/API/Foo']]),
    });
    const url = 'https://developer.mozilla.org/docs/Web/API/Foo';
    urlsByPath.set('api.Foo', url);
    const issues = processData(compat(url), 'api.Foo.bar');
    const dupes = issues.filter(
      (i) => i.ruleName === 'mdn_url_duplicate_ancestor',
    );
    assert.equal(dupes.length, 1);
    assert.equal(dupes[0].actual, url);
    assert.equal(dupes[0].expected, '');
  });

  it('returns an issue when mdn_url matches a grandparent ancestor', () => {
    mockInventory({
      slugs: new Map([['web/api/foo', 'Web/API/Foo']]),
    });
    const url = 'https://developer.mozilla.org/docs/Web/API/Foo';
    urlsByPath.set('api', 'https://developer.mozilla.org/docs/Web/API');
    urlsByPath.set('api.Foo', url);
    const issues = processData(compat(url), 'api.Foo.bar.baz');
    const dupes = issues.filter(
      (i) => i.ruleName === 'mdn_url_duplicate_ancestor',
    );
    assert.equal(dupes.length, 1);
  });

  it('returns no issues when ancestor has a different mdn_url', () => {
    mockInventory({
      slugs: new Map([
        ['web/api/foo', 'Web/API/Foo'],
        ['web/api/foo/bar', 'Web/API/Foo/bar'],
      ]),
    });
    urlsByPath.set('api.Foo', 'https://developer.mozilla.org/docs/Web/API/Foo');
    const issues = processData(
      compat('https://developer.mozilla.org/docs/Web/API/Foo/bar'),
      'api.Foo.bar',
    );
    const dupes = issues.filter(
      (i) => i.ruleName === 'mdn_url_duplicate_ancestor',
    );
    assert.equal(dupes.length, 0);
  });

  it('returns no issues for a top-level path with no ancestors', () => {
    mockInventory({
      slugs: new Map([['web/api', 'Web/API']]),
    });
    const issues = processData(
      compat('https://developer.mozilla.org/docs/Web/API'),
      'api',
    );
    const dupes = issues.filter(
      (i) => i.ruleName === 'mdn_url_duplicate_ancestor',
    );
    assert.equal(dupes.length, 0);
  });

  it('returns only one issue even if multiple ancestors match', () => {
    mockInventory({
      slugs: new Map([['web/api/foo', 'Web/API/Foo']]),
    });
    const url = 'https://developer.mozilla.org/docs/Web/API/Foo';
    urlsByPath.set('api', url);
    urlsByPath.set('api.Foo', url);
    const issues = processData(compat(url), 'api.Foo.bar');
    const dupes = issues.filter(
      (i) => i.ruleName === 'mdn_url_duplicate_ancestor',
    );
    assert.equal(dupes.length, 1);
  });
});
