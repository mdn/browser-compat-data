/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { checkOverlappingStatements } from '../common/overlapping-statements.js';
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
  // Copy notes for multiple open-ended statements.
  {
    input: [
      {
        version_added: '3',
        notes: 'Note from version 3',
      },
      {
        version_added: '1',
        notes: 'Note from version 1',
      },
    ],
    output: [
      {
        version_added: '3',
        notes: ['Note from version 3', 'Note from version 1'],
      },
      {
        version_added: '1',
        version_removed: '3',
        notes: 'Note from version 1',
      },
    ],
  },
  // Don't copy notes for partial implementation.
  {
    input: [
      {
        version_added: '3',
        partial_implementation: true,
        notes: 'Note from version 3',
      },
      {
        version_added: '1',
        partial_implementation: true,
        notes: 'Note from version 1',
      },
    ],
    output: [
      {
        version_added: '3',
        partial_implementation: true,
        notes: 'Note from version 3',
      },
      {
        version_added: '1',
        version_removed: '3',
        partial_implementation: true,
        notes: 'Note from version 1',
      },
    ],
  },
];

describe('fix -> version_overlap', () => {
  let i = 1;
  for (const test of tests) {
    it(`Test #${i}`, () => {
      const result = checkOverlappingStatements(test.input, 'firefox', {
        fix: true,
      });

      assert.deepStrictEqual(result, test.output ?? test.input);
    });

    i += 1;
  }
});
