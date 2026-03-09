/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {CompatStatement, Identifier} from '../../types/types.js' */

/**
 * @typedef {Record<string, Identifier | CompatStatement>} TestValue
 */

import assert from 'node:assert/strict';

import { fixStatusValue } from './status.js';

/** @type {{ name: string; input: TestValue; output: TestValue }[]} */
const tests = [
  {
    name: 'should unset experimental when feature is deprecated',
    input: {
      __compat: {
        support: {},
        status: {
          experimental: true,
          standard_track: true,
          deprecated: true,
        },
      },
    },
    output: {
      __compat: {
        support: {},
        status: {
          experimental: false,
          standard_track: true,
          deprecated: true,
        },
      },
    },
  },
  {
    name: 'should set standard_track when feature has spec_url',
    input: {
      __compat: {
        spec_url: 'https://www.example.com/',
        support: {},
        status: {
          experimental: true,
          standard_track: false,
          deprecated: false,
        },
      },
    },
    output: {
      __compat: {
        spec_url: 'https://www.example.com/',
        support: {},
        status: {
          experimental: true,
          standard_track: true,
          deprecated: false,
        },
      },
    },
  },
  {
    name: 'should unset experimental when two engines implement the feature',
    input: {
      __compat: {
        support: {
          firefox: {
            version_added: '1',
          },
          safari: {
            version_added: '1',
          },
        },
        status: {
          experimental: true,
          standard_track: false,
          deprecated: false,
        },
      },
    },
    output: {
      __compat: {
        support: {
          firefox: {
            version_added: '1',
          },
          safari: {
            version_added: '1',
          },
        },
        status: {
          experimental: false,
          standard_track: false,
          deprecated: false,
        },
      },
    },
  },
  {
    name: 'should set deprecated when parent feature is deprecated',
    input: {
      __compat: {
        support: {},
        status: {
          experimental: false,
          standard_track: true,
          deprecated: true,
        },
      },
      subfeature: /** @type {Identifier} */ ({
        __compat: {
          support: {},
          status: {
            experimental: false,
            standard_track: true,
            deprecated: false,
          },
        },
      }),
    },
    output: {
      __compat: {
        support: {},
        status: {
          experimental: false,
          standard_track: true,
          deprecated: true,
        },
      },
      subfeature: /** @type {Identifier} */ ({
        __compat: {
          support: {},
          status: {
            experimental: false,
            standard_track: true,
            deprecated: true,
          },
        },
      }),
    },
  },
];

describe('fixStatus', () => {
  for (const test of tests) {
    it(test.name, () => {
      const result = fixStatusValue(/** @type {Identifier} */ (test.input));

      assert.deepStrictEqual(result, test.output);
    });
  }
});
