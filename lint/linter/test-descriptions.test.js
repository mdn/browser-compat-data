/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {InternalCompatStatement} from '../../types/index.js' */
/** @import {DescriptionError} from './test-descriptions.js' */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { processData } from './test-descriptions.js';

describe('test-descriptions', () => {
  describe('API data', () => {
    it('should ignore anything that is not an interface subfeature', () => {
      const path = 'api.Interface.feature.subfeature';
      /** @type {InternalCompatStatement} */
      const data = {
        support: {},
      };

      const errors = processData(data, 'api', path);
      assert.equal(errors.length, 0);
    });

    it('should check description for constructor', () => {
      const path = 'api.Interface.Interface';
      /** @type {InternalCompatStatement} */
      const data = {
        description: '',
        support: {},
      };

      const errors = processData(data, 'api', path);
      assert.equal(errors.length, 1);
      assert.equal(
        /** @type {DescriptionError} */ (errors[0]).ruleName,
        'constructor',
      );
    });

    it('should check description for event', () => {
      const path = 'api.Interface.click_event';
      /** @type {InternalCompatStatement} */
      const data = {
        description: '',
        support: {},
      };

      const errors = processData(data, 'api', path);
      assert.equal(errors.length, 1);
      assert.equal(
        /** @type {DescriptionError} */ (errors[0]).ruleName,
        'event',
      );
    });

    it('should check description for permission', () => {
      const path = 'api.Interface.geolocation_permission';
      /** @type {InternalCompatStatement} */
      const data = {
        description: '',
        support: {},
      };

      const errors = processData(data, 'api', path);
      assert.equal(errors.length, 1);
      assert.equal(
        /** @type {DescriptionError} */ (errors[0]).ruleName,
        'permission',
      );
    });

    it('should check description for secure context required', () => {
      const path = 'api.Interface.secure_context_required';
      /** @type {InternalCompatStatement} */
      const data = {
        description: '',
        support: {},
      };

      const errors = processData(data, 'api', path);
      assert.equal(errors.length, 1);
      assert.equal(
        /** @type {DescriptionError} */ (errors[0]).ruleName,
        'secure context required',
      );
    });

    it('should check description for worker support', () => {
      const path = 'api.Interface.worker_support';
      /** @type {InternalCompatStatement} */
      const data = {
        description: '',
        support: {},
      };

      const errors = processData(data, 'api', path);
      assert.equal(errors.length, 1);
      assert.equal(
        /** @type {DescriptionError} */ (errors[0]).ruleName,
        'worker',
      );
    });

    it('should check for redundant description', () => {
      const path = 'css.properties.width.auto';
      /** @type {InternalCompatStatement} */
      const data = {
        description: '`auto`',
        support: {},
      };

      const errors = processData(data, 'css', path);
      assert.equal(errors.length, 1);
    });
  });

  describe('HTML in descriptions', () => {
    /**
     * Find the description error with the given rule name.
     * @param {(string | DescriptionError)[]} errors The errors to search.
     * @param {string} ruleName The rule name to look for.
     * @returns {DescriptionError | undefined} The matching error, if any.
     */
    const findError = (errors, ruleName) =>
      /** @type {DescriptionError | undefined} */ (
        errors.find((e) => typeof e !== 'string' && e.ruleName === ruleName)
      );

    /** @type {{name: string, description: string, ruleName: string, actual?: string, expected: string, fixable?: false}[]} */
    const cases = [
      {
        name: 'flags <code> tags as no_code_tag_in_description',
        description: '<code>transient_attachment</code> usage',
        ruleName: 'no_code_tag_in_description',
        actual: '<code>transient_attachment</code> usage',
        expected: '`transient_attachment` usage',
      },
      {
        name: 'flags <a> tags as no_link_tag_in_description',
        description: "See <a href='https://example.com'>the docs</a>",
        ruleName: 'no_link_tag_in_description',
        actual: "See <a href='https://example.com'>the docs</a>",
        expected: 'See [the docs](https://example.com)',
      },
      {
        name: 'converts nested <code> before the link in a single expectation',
        description: "See <a href='https://example.com'><code>foo()</code></a>",
        ruleName: 'no_link_tag_in_description',
        expected: 'See [`foo()`](https://example.com)',
      },
      // HTML the conversion cannot express in Markdown is reported as
      // unfixable, so that the fixer leaves it for a human to rewrite.
      {
        name: 'reports a <code> tag containing a backtick as unfixable',
        description: 'A <code>a`b</code> usage',
        ruleName: 'unconvertible_html_in_description',
        expected: 'A `a`b` usage',
        fixable: false,
      },
      {
        name: 'reports adjacent <code> tags as unfixable',
        description: 'A <code>a</code><code>b</code> usage',
        ruleName: 'unconvertible_html_in_description',
        expected: 'A `a``b` usage',
        fixable: false,
      },
      {
        name: 'reports link text with a closing bracket as unfixable',
        description: "See <a href='https://example.com'>a]b</a>",
        ruleName: 'unconvertible_html_in_description',
        expected: 'See [a]b](https://example.com)',
        fixable: false,
      },
    ];

    for (const {
      name,
      description,
      ruleName,
      actual,
      expected,
      fixable,
    } of cases) {
      it(name, () => {
        /** @type {InternalCompatStatement} */
        const data = { description, support: {} };
        const errors = processData(data, 'api', 'api.Foo.bar');
        const err = findError(errors, ruleName);
        assert.ok(err);
        if (actual !== undefined) {
          assert.equal(err.actual, actual);
        }
        assert.equal(err.expected, expected);
        assert.equal(err.fixable, fixable);
      });
    }

    it('does not flag descriptions without HTML', () => {
      /** @type {InternalCompatStatement} */
      const data = {
        description: '`transient_attachment` usage',
        support: {},
      };
      const errors = processData(data, 'api', 'api.Foo.bar');
      assert.ok(
        !errors.some(
          (e) =>
            typeof e !== 'string' &&
            (e.ruleName === 'no_code_tag_in_description' ||
              e.ruleName === 'no_link_tag_in_description'),
        ),
      );
    });
  });
});
