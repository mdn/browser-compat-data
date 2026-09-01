/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {InternalDataType, InternalSupportBlock} from '../types/index.js' */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { collectPartials, comparePartials } from './diff-partials.js';

/**
 * Build compat data for a single feature
 * @param {InternalSupportBlock} support The support block of the feature
 * @returns {InternalDataType} The compat data
 */
const feature = (support) =>
  /** @type {*} */ ({
    css: { properties: { fries: { __compat: { support } } } },
  });

/** @type {{ name: string; data: InternalDataType; expected: string[] }[]} */
const collectTests = [
  {
    name: 'a simple statement with a partial implementation',
    data: feature({
      chrome: { version_added: '20', partial_implementation: true },
    }),
    expected: ['css.properties.fries.chrome'],
  },
  {
    name: 'a simple statement without a partial implementation',
    data: feature({ chrome: { version_added: '20' } }),
    expected: [],
  },
  {
    name: 'one partial implementation among multiple statements',
    data: feature({
      chrome: [
        { version_added: '20' },
        {
          version_added: '10',
          version_removed: '20',
          partial_implementation: true,
        },
      ],
    }),
    expected: ['css.properties.fries.chrome'],
  },
  {
    name: 'multiple browsers',
    data: feature({
      chrome: { version_added: '20', partial_implementation: true },
      firefox: { version_added: '20' },
      safari: { version_added: '20', partial_implementation: true },
    }),
    expected: ['css.properties.fries.chrome', 'css.properties.fries.safari'],
  },
  {
    name: 'an unresolved "mirror" statement',
    data: feature({
      chrome: { version_added: '20', partial_implementation: true },
      chrome_android: 'mirror',
    }),
    expected: ['css.properties.fries.chrome'],
  },
  {
    name: 'subfeatures',
    data: /** @type {*} */ ({
      css: {
        properties: {
          fries: {
            __compat: { support: { chrome: { version_added: '20' } } },
            crispy: {
              __compat: {
                support: {
                  chrome: { version_added: '20', partial_implementation: true },
                },
              },
            },
          },
        },
      },
    }),
    expected: ['css.properties.fries.crispy.chrome'],
  },
];

describe('collectPartials', () => {
  for (const { name, data, expected } of collectTests) {
    it(`should collect ${name}`, () => {
      assert.deepEqual([...collectPartials(data)].sort(), expected);
    });
  }
});

/** @type {{ name: string; before: string[]; after: string[]; expected: { added: string[]; removed: string[] } }[]} */
const compareTests = [
  {
    name: 'an added partial implementation',
    before: [],
    after: ['css.properties.fries.chrome'],
    expected: { added: ['css.properties.fries.chrome'], removed: [] },
  },
  {
    name: 'a removed partial implementation',
    before: ['css.properties.fries.chrome'],
    after: [],
    expected: { added: [], removed: ['css.properties.fries.chrome'] },
  },
  {
    name: 'an unchanged partial implementation',
    before: ['css.properties.fries.chrome'],
    after: ['css.properties.fries.chrome'],
    expected: { added: [], removed: [] },
  },
  {
    name: 'a partial implementation moved to another browser',
    before: ['css.properties.fries.chrome'],
    after: ['css.properties.fries.safari'],
    expected: {
      added: ['css.properties.fries.safari'],
      removed: ['css.properties.fries.chrome'],
    },
  },
  {
    name: 'sorted results',
    before: [],
    after: ['css.properties.fries.safari', 'css.properties.fries.chrome'],
    expected: {
      added: ['css.properties.fries.chrome', 'css.properties.fries.safari'],
      removed: [],
    },
  },
];

describe('comparePartials', () => {
  for (const { name, before, after, expected } of compareTests) {
    it(`should report ${name}`, () => {
      assert.deepEqual(
        comparePartials(new Set(before), new Set(after)),
        expected,
      );
    });
  }
});
