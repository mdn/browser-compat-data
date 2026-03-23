/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import fixFeatureOrder from './feature-order.js';

const compat = {
  support: { chrome: { version_added: '1' } },
  status: { experimental: false, standard_track: true, deprecated: false },
};

describe('fix -> feature order', () => {
  it('sorts subfeatures of a feature that has __compat', () => {
    const input = JSON.stringify({
      api: {
        MyInterface: {
          __compat: compat,
          zebra: { __compat: compat },
          alpha: { __compat: compat },
        },
      },
    });

    const result = JSON.parse(fixFeatureOrder('api/MyInterface.json', input));
    const keys = Object.keys(result.api.MyInterface);
    assert.deepStrictEqual(keys, ['__compat', 'alpha', 'zebra']);
  });

  it('sorts two levels of nested namespace containers', () => {
    const input = JSON.stringify({
      svg: {
        elements: {
          zebra_group: {
            zebra: { __compat: compat },
            alpha: { __compat: compat },
          },
          alpha_group: {
            zebra: { __compat: compat },
            alpha: { __compat: compat },
          },
        },
      },
    });

    const result = JSON.parse(fixFeatureOrder('svg/elements.json', input));
    const topKeys = Object.keys(result.svg.elements);
    assert.deepStrictEqual(topKeys, ['alpha_group', 'zebra_group']);
  });

  it('sorts subfeatures of a namespace container that has no __compat', () => {
    const input = JSON.stringify({
      svg: {
        global_attributes: {
          zebra: { __compat: compat },
          alpha: { __compat: compat },
        },
      },
    });

    const result = JSON.parse(
      fixFeatureOrder('svg/global_attributes.json', input),
    );
    const keys = Object.keys(result.svg.global_attributes);
    assert.deepStrictEqual(keys, ['alpha', 'zebra']);
  });
});
