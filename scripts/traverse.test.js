/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { iterateFeatures } from './traverse.js';

describe('iterateFeatures', () => {
  it('should yield correct identifiers for given object', () => {
    const obj = {
      feature1: {
        __compat: {
          support: {
            chrome: { version_added: '1.0' },
            firefox: { version_added: '1.5' },
          },
        },
      },
      feature2: {
        __compat: {
          support: {
            chrome: { version_added: '2.0' },
            firefox: { version_added: null },
          },
        },
      },
    };

    const browsers = ['chrome', 'firefox'];
    const values = ['1.0', 'null'];
    const depth = 2;
    const tag = '';
    const identifier = '';

    const result = Array.from(
      iterateFeatures(obj, browsers, values, depth, tag, identifier),
    );

    assert.deepEqual(result, ['feature1', 'feature2']);
  });
});
