/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

/** @import {CompatStatement} from '../../types/types.js' */

import { processData, urlsByPath } from './test-mdn-urls.js';

/**
 * Create a minimal CompatStatement with the given mdn_url
 * @param {string} url The MDN URL
 * @returns {CompatStatement} The compat statement
 */
const compat = (url) => /** @type {CompatStatement} */ ({ mdn_url: url });

describe('processData - mdn_url_duplicate_ancestor', () => {
  beforeEach(() => {
    urlsByPath.clear();
  });

  it('returns no issues when no ancestor has the same mdn_url', () => {
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
