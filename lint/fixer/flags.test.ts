/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { SupportStatement } from '../../types/types.js';

import { removeIrrelevantFlags } from './flags.js';

const tests: { input: SupportStatement; output: SupportStatement }[] = [
  {
    input: [
      {
        version_added: '70',
      },
      {
        version_added: '21',
        version_removed: '65',
        flags: [
          {
            type: 'preference',
            name: '#service-worker-payment-apps',
            value_to_set: 'Enabled',
          },
        ],
      },
    ],
    output: {
      version_added: '70',
    },
  },
  {
    input: [
      {
        version_added: '62',
      },
      {
        version_added: '21',
        version_removed: '80',
        flags: [
          {
            type: 'preference',
            name: '#service-worker-payment-apps',
            value_to_set: 'Enabled',
          },
        ],
      },
    ],
    output: {
      version_added: '62',
    },
  },
  {
    input: [
      {
        version_added: '62',
      },
      {
        version_added: '21',
        flags: [
          {
            type: 'preference',
            name: '#service-worker-payment-apps',
            value_to_set: 'Enabled',
          },
        ],
      },
    ],
    output: {
      version_added: '62',
    },
  },
  {
    input: [
      {
        version_added: '42',
        flags: [
          {
            type: 'preference',
            name: '#enable-experimental-web-features',
            value_to_set: 'Enabled',
          },
        ],
      },
      {
        version_added: '21',
        version_removed: '45',
        flags: [
          {
            type: 'preference',
            name: '#service-worker-payment-apps',
            value_to_set: 'Enabled',
          },
        ],
      },
    ],
    output: {
      version_added: '42',
      flags: [
        {
          type: 'preference',
          name: '#enable-experimental-web-features',
          value_to_set: 'Enabled',
        },
      ],
    },
  },
  {
    input: {
      version_added: '42',
      version_removed: '43',
      flags: [
        {
          type: 'preference',
          name: '#enable-experimental-web-features',
          value_to_set: 'Enabled',
        },
      ],
    },
    output: {
      version_added: false,
    },
  },
  {
    input: [
      {
        version_added: '80',
      },
      {
        version_added: '21',
        version_removed: '80',
        flags: [
          {
            type: 'preference',
            name: '#service-worker-payment-apps',
            value_to_set: 'Enabled',
          },
        ],
      },
    ],
    output: {
      version_added: '80',
    },
  },
  {
    input: [
      {
        version_added: '79',
        flags: [
          {
            type: 'preference',
            name: 'enable-experimental-web-platform-features',
            value_to_set: 'enabled',
          },
        ],
      },
      {
        version_added: '12',
        version_removed: '79',
      },
    ],
    output: [
      {
        version_added: '79',
        flags: [
          {
            type: 'preference',
            name: 'enable-experimental-web-platform-features',
            value_to_set: 'enabled',
          },
        ],
      },
      {
        version_added: '12',
        version_removed: '79',
      },
    ],
  },
  {
    input: [
      {
        version_added: '86',
      },
      {
        version_added: '21',
        flags: [
          {
            type: 'preference',
            name: '#service-worker-payment-apps',
            value_to_set: 'Enabled',
          },
        ],
      },
    ],
    output: {
      version_added: '86',
    },
  },
  {
    input: [
      {
        version_added: '79',
        version_removed: '80',
        flags: [
          {
            type: 'preference',
            name: 'WebVR',
          },
        ],
      },
      {
        version_added: '15',
        version_removed: '79',
      },
    ],
    output: {
      version_added: '15',
      version_removed: '79',
    },
  },
  {
    input: [
      {
        version_added: 'preview',
      },
      {
        version_added: '105',
        flags: [
          {
            type: 'preference',
            name: 'layout.css.font-tech.enabled',
            value_to_set: 'true',
          },
        ],
      },
    ],
    output: [
      {
        version_added: 'preview',
      },
      {
        version_added: '105',
        flags: [
          {
            type: 'preference',
            name: 'layout.css.font-tech.enabled',
            value_to_set: 'true',
          },
        ],
      },
    ],
  },
];

describe('fix -> flags', () => {
  let i = 1;
  for (const test of tests) {
    it(`Test #${i}`, () => {
      const result = removeIrrelevantFlags(test.input);

      assert.deepStrictEqual(result, test.output);
    });

    i += 1;
  }
});
