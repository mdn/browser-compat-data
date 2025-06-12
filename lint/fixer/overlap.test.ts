/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { checkOverlap } from '../common/overlap.js';
import { SupportStatement } from '../../types/types.js';

const tests: { input: SupportStatement; output?: SupportStatement }[] = [
  // Use version_added from following as version_removed of previous.
  {
    input: [
      {
        version_added: '3',
      },
      {
        version_added: '1',
      },
    ],
    output: [
      {
        version_added: '3',
      },
      {
        version_added: '1',
        version_removed: '3',
      },
    ],
  },
  // Don't touch open-ended stable/preview side-by-side.
  {
    input: [
      {
        version_added: 'preview',
      },
      {
        version_added: '1',
      },
    ],
  },
  // Don't touch flag data.
  {
    input: [
      {
        version_added: '126',
        flags: [
          {
            name: '#web-machine-learning-neural-network',
            type: 'preference',
            value_to_set: 'Enabled',
          },
        ],
        notes: 'Supported on CPUs, GPUs and NPUs on macOS.',
      },
      {
        version_added: '121',
        flags: [
          {
            name: '#web-machine-learning-neural-network',
            type: 'preference',
            value_to_set: 'Enabled',
          },
        ],
        notes: 'Supported on GPUs and NPUs on Windows.',
      },
      {
        version_added: '116',
        flags: [
          {
            name: '#web-machine-learning-neural-network',
            type: 'preference',
            value_to_set: 'Enabled',
          },
        ],
        notes: 'Supported on CPUs on Windows, ChromeOS and Linux.',
      },
    ],
  },
];

describe('fix -> overlap', () => {
  let i = 1;
  for (const test of tests) {
    it(`Test #${i}`, () => {
      const result = checkOverlap(test.input, 'firefox', {
        fix: true,
      });

      assert.deepStrictEqual(result, test.output ?? test.input);
    });

    i += 1;
  }
});
