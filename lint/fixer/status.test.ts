/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { CompatStatement, Identifier } from '../../types/types.js';

import { fixStatusValue } from './status.js';

type TestValue = Record<string, Identifier | CompatStatement>;

const tests: { name: string; input: TestValue; output: TestValue }[] = [
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
            version_added: true,
          },
          safari: {
            version_added: true,
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
            version_added: true,
          },
          safari: {
            version_added: true,
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
      subfeature: {
        __compat: {
          support: {},
          status: {
            experimental: false,
            standard_track: true,
            deprecated: false,
          },
        },
      } as Identifier,
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
      subfeature: {
        __compat: {
          support: {},
          status: {
            experimental: false,
            standard_track: true,
            deprecated: true,
          },
        },
      } as Identifier,
    },
  },
];

describe('fixStatus', () => {
  for (const test of tests) {
    it(test.name, () => {
      const result = fixStatusValue(test.input as Identifier);

      assert.deepStrictEqual(result, test.output);
    });
  }
});
