/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/**
 * @typedef {import('../../types/types.js').CompatStatement} CompatStatement
 */

import assert from 'node:assert/strict';

import { processData } from './test-descriptions.js';

describe('test-descriptions', () => {
  describe('API data', () => {
    it('should ignore anything that is not an interface subfeature', () => {
      const path = 'api.Interface.feature.subfeature';
      /** @type {CompatStatement} */
      const data = {
        support: {},
      };

      const errors = processData(data, 'api', path);
      assert.equal(errors.length, 0);
    });

    it('should check description for constructor', () => {
      const path = 'api.Interface.Interface';
      /** @type {CompatStatement} */
      const data = {
        description: '',
        support: {},
      };

      const errors = processData(data, 'api', path);
      assert.equal(errors.length, 1);
      assert.equal(errors[0].ruleName, 'constructor');
    });

    it('should check description for event', () => {
      const path = 'api.Interface.click_event';
      /** @type {CompatStatement} */
      const data = {
        description: '',
        support: {},
      };

      const errors = processData(data, 'api', path);
      assert.equal(errors.length, 1);
      assert.equal(errors[0].ruleName, 'event');
    });

    it('should check description for permission', () => {
      const path = 'api.Interface.geolocation_permission';
      /** @type {CompatStatement} */
      const data = {
        description: '',
        support: {},
      };

      const errors = processData(data, 'api', path);
      assert.equal(errors.length, 1);
      assert.equal(errors[0].ruleName, 'permission');
    });

    it('should check description for secure context required', () => {
      const path = 'api.Interface.secure_context_required';
      /** @type {CompatStatement} */
      const data = {
        description: '',
        support: {},
      };

      const errors = processData(data, 'api', path);
      assert.equal(errors.length, 1);
      assert.equal(errors[0].ruleName, 'secure context required');
    });

    it('should check description for worker support', () => {
      const path = 'api.Interface.worker_support';
      /** @type {CompatStatement} */
      const data = {
        description: '',
        support: {},
      };

      const errors = processData(data, 'api', path);
      assert.equal(errors.length, 1);
      assert.equal(errors[0].ruleName, 'worker');
    });

    it('should check for redundant description', () => {
      const path = 'css.properties.width.auto';
      /** @type {CompatStatement} */
      const data = {
        description: '`auto`',
        support: {},
      };

      const errors = processData(data, 'css', path);
      assert.equal(errors.length, 1);
    });
  });
});
