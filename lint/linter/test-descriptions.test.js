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
    it('flags <code> tags as no_code_tag_in_description', () => {
      /** @type {InternalCompatStatement} */
      const data = {
        description: '<code>transient_attachment</code> usage',
        support: {},
      };
      const errors = processData(data, 'api', 'api.Foo.bar');
      const err = /** @type {DescriptionError} */ (
        errors.find(
          (e) =>
            typeof e !== 'string' &&
            e.ruleName === 'no_code_tag_in_description',
        )
      );
      assert.ok(err);
      assert.equal(err.actual, '<code>transient_attachment</code> usage');
      assert.equal(err.expected, '`transient_attachment` usage');
    });

    it('flags <a> tags as no_link_tag_in_description', () => {
      /** @type {InternalCompatStatement} */
      const data = {
        description: "See <a href='https://example.com'>the docs</a>",
        support: {},
      };
      const errors = processData(data, 'api', 'api.Foo.bar');
      const err = /** @type {DescriptionError} */ (
        errors.find(
          (e) =>
            typeof e !== 'string' &&
            e.ruleName === 'no_link_tag_in_description',
        )
      );
      assert.ok(err);
      assert.equal(
        err.actual,
        "See <a href='https://example.com'>the docs</a>",
      );
      assert.equal(err.expected, 'See [the docs](https://example.com)');
    });

    it('converts nested <code> before the link in a single expectation', () => {
      /** @type {InternalCompatStatement} */
      const data = {
        description: "See <a href='https://example.com'><code>foo()</code></a>",
        support: {},
      };
      const errors = processData(data, 'api', 'api.Foo.bar');
      const err = /** @type {DescriptionError} */ (
        errors.find(
          (e) =>
            typeof e !== 'string' &&
            e.ruleName === 'no_link_tag_in_description',
        )
      );
      assert.ok(err);
      assert.equal(err.expected, 'See [`foo()`](https://example.com)');
    });

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
