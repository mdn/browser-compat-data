/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

/** @import {CompatStatement} from '../../types/types.js' */

import {
  inventory,
  buildSlugByPath,
} from '../../utils/mdn-content-inventory.js';

import { processData, urlsByPath } from './test-mdn-urls.js';

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

describe('test-mdn-urls', () => {
  describe('mdn_url_redirect', () => {
    it('flags redirected mdn_url', () => {
      mockInventory({
        redirects: {
          '/en-US/docs/Old/Page': '/en-US/docs/New/Page',
        },
      });
      const issues = processData(
        {
          mdn_url: 'https://developer.mozilla.org/docs/Old/Page',
          support: {},
        },
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

    it('ignores non-redirected URL', () => {
      mockInventory({
        slugs: new Map([['web/api/foo', 'Web/API/Foo']]),
      });
      const issues = processData(
        {
          mdn_url: 'https://developer.mozilla.org/docs/Web/API/Foo',
          support: {},
        },
        'some.feature',
      );
      const matches = issues.filter((i) => i.ruleName === 'mdn_url_redirect');
      assert.equal(matches.length, 0);
    });
  });

  describe('mdn_url_casing', () => {
    it('flags wrong slug casing', () => {
      mockInventory({
        slugs: new Map([['web/api/foo', 'Web/API/Foo']]),
      });
      const issues = processData(
        {
          mdn_url: 'https://developer.mozilla.org/docs/Web/API/foo',
          support: {},
        },
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
        {
          mdn_url: 'https://developer.mozilla.org/docs/Web/API/foo#bar',
          support: {},
        },
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

  describe('mdn_url_404', () => {
    it('flags non-existent slug', () => {
      mockInventory();
      const issues = processData(
        {
          mdn_url: 'https://developer.mozilla.org/docs/Web/API/NoSuchPage',
          support: {},
        },
        'some.feature',
      );
      const matches = issues.filter((i) => i.ruleName === 'mdn_url_404');
      assert.equal(matches.length, 1);
      assert.equal(matches[0].expected, '');
    });
  });

  describe('mdn_url_other_page', () => {
    it('flags when slugByPath maps to different page', () => {
      mockInventory({
        slugs: new Map([['web/api/wrong', 'Web/API/Wrong']]),
        slugByPath: new Map([['api.Foo', 'Web/API/Correct']]),
      });
      const issues = processData(
        {
          mdn_url: 'https://developer.mozilla.org/docs/Web/API/Wrong',
          support: {},
        },
        'api.Foo',
      );
      const matches = issues.filter((i) => i.ruleName === 'mdn_url_other_page');
      assert.equal(matches.length, 1);
      assert.equal(
        matches[0].expected,
        'https://developer.mozilla.org/docs/Web/API/Correct',
      );
    });

    it('does not flag when URL has hash fragment', () => {
      mockInventory({
        slugs: new Map([['web/api/wrong', 'Web/API/Wrong']]),
        slugByPath: new Map([['api.Foo', 'Web/API/Correct']]),
      });
      const issues = processData(
        {
          mdn_url: 'https://developer.mozilla.org/docs/Web/API/Wrong#section',
          support: {},
        },
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
        {
          mdn_url: 'https://developer.mozilla.org/docs/Web/API/Foo',
          support: {},
        },
        'api.Foo',
      );
      const matches = issues.filter((i) => i.ruleName === 'mdn_url_other_page');
      assert.equal(matches.length, 0);
    });
  });

  describe('mdn_url_casing_hash', () => {
    it('flags uppercase hash characters', () => {
      mockInventory({
        slugs: new Map([['web/api/foo', 'Web/API/Foo']]),
      });
      const issues = processData(
        {
          mdn_url: 'https://developer.mozilla.org/docs/Web/API/Foo#SomeSection',
          support: {},
        },
        'some.feature',
      );
      const matches = issues.filter(
        (i) => i.ruleName === 'mdn_url_casing_hash',
      );
      assert.equal(matches.length, 1);
      assert.equal(
        matches[0].expected,
        'https://developer.mozilla.org/docs/Web/API/Foo#somesection',
      );
    });

    it('ignores lowercase hash', () => {
      mockInventory({
        slugs: new Map([['web/api/foo', 'Web/API/Foo']]),
      });
      const issues = processData(
        {
          mdn_url: 'https://developer.mozilla.org/docs/Web/API/Foo#somesection',
          support: {},
        },
        'some.feature',
      );
      const matches = issues.filter(
        (i) => i.ruleName === 'mdn_url_casing_hash',
      );
      assert.equal(matches.length, 0);
    });
  });

  describe('mdn_url_new_page', () => {
    it('flags missing mdn_url when slugByPath has match', () => {
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

    it('ignores missing mdn_url when no slugByPath match', () => {
      mockInventory();
      const issues = processData(noUrl, 'api.Unknown');
      const matches = issues.filter((i) => i.ruleName === 'mdn_url_new_page');
      assert.equal(matches.length, 0);
    });
  });

  describe('buildSlugByPath', () => {
    it('ignores overview pages and landing pages', () => {
      const result = buildSlugByPath([
        {
          frontmatter: {
            slug: 'Web/API/Foo',
            'page-type': 'web-api-overview',
            'browser-compat': 'api.Foo',
          },
        },
        {
          frontmatter: {
            slug: 'Web/API/Foo/bar',
            'page-type': 'web-api-instance-method',
            'browser-compat': 'api.Foo.bar',
          },
        },
      ]);
      assert.equal(result.get('api.Foo'), undefined);
      assert.equal(result.get('api.Foo.bar'), 'Web/API/Foo/bar');
    });
  });

  describe('mdn_url_duplicate_ancestor', () => {
    it('ignores different ancestor mdn_url', () => {
      mockInventory({
        slugs: new Map([
          ['web/api/foo', 'Web/API/Foo'],
          ['web/api/foo/bar', 'Web/API/Foo/bar'],
        ]),
      });
      urlsByPath.set(
        'api.Foo',
        'https://developer.mozilla.org/docs/Web/API/Foo',
      );
      const issues = processData(
        {
          mdn_url: 'https://developer.mozilla.org/docs/Web/API/Foo/bar',
          support: {},
        },
        'api.Foo.bar',
      );
      assert.equal(
        issues.filter((i) => i.ruleName === 'mdn_url_duplicate_ancestor')
          .length,
        0,
      );
    });

    it('flags mdn_url matching direct parent', () => {
      mockInventory({
        slugs: new Map([['web/api/foo', 'Web/API/Foo']]),
      });
      const url = 'https://developer.mozilla.org/docs/Web/API/Foo';
      urlsByPath.set('api.Foo', url);
      const issues = processData({ mdn_url: url, support: {} }, 'api.Foo.bar');
      const dupes = issues.filter(
        (i) => i.ruleName === 'mdn_url_duplicate_ancestor',
      );
      assert.equal(dupes.length, 1);
      assert.equal(dupes[0].actual, url);
      assert.equal(dupes[0].expected, '');
    });

    it('flags mdn_url matching grandparent ancestor', () => {
      mockInventory({
        slugs: new Map([['web/api/foo', 'Web/API/Foo']]),
      });
      const url = 'https://developer.mozilla.org/docs/Web/API/Foo';
      urlsByPath.set('api', 'https://developer.mozilla.org/docs/Web/API');
      urlsByPath.set('api.Foo', url);
      const issues = processData(
        { mdn_url: url, support: {} },
        'api.Foo.bar.baz',
      );
      const dupes = issues.filter(
        (i) => i.ruleName === 'mdn_url_duplicate_ancestor',
      );
      assert.equal(dupes.length, 1);
    });

    it('ignores top-level path with no ancestors', () => {
      mockInventory({
        slugs: new Map([['web/api', 'Web/API']]),
      });
      const issues = processData(
        {
          mdn_url: 'https://developer.mozilla.org/docs/Web/API',
          support: {},
        },
        'api',
      );
      const dupes = issues.filter(
        (i) => i.ruleName === 'mdn_url_duplicate_ancestor',
      );
      assert.equal(dupes.length, 0);
    });

    it('reports only one issue even if multiple ancestors match', () => {
      mockInventory({
        slugs: new Map([['web/api/foo', 'Web/API/Foo']]),
      });
      const url = 'https://developer.mozilla.org/docs/Web/API/Foo';
      urlsByPath.set('api', url);
      urlsByPath.set('api.Foo', url);
      const issues = processData({ mdn_url: url, support: {} }, 'api.Foo.bar');
      const dupes = issues.filter(
        (i) => i.ruleName === 'mdn_url_duplicate_ancestor',
      );
      assert.equal(dupes.length, 1);
    });
  });
});
