/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { BrowserName } from '../types/types.js';

import { iterateFeatures } from './traverse.js';

describe('iterateFeatures', () => {
  let obj: any;
  beforeEach(() => {
    obj = {
      feature1: {
        __compat: {
          support: {
            chrome: { version_added: '1.0' },
            firefox: { version_added: '1.5' },
          },
          status: {
            experimental: false,
            standard_track: true,
            deprecated: false,
          },
        },
      },
      feature2: {
        __compat: {
          support: {
            chrome: { version_added: '2.0' },
            firefox: { version_added: null },
          },
          status: {
            experimental: false,
            standard_track: true,
            deprecated: true,
          },
        },
      },
    };
  });

  it('should yield correct identifiers for given object', () => {
    const browsers: BrowserName[] = ['chrome', 'firefox'];
    const values = ['1.0', 'null'];
    const depth = 2;
    const tag = '';
    const identifier = '';
    const deprecated = undefined;

    const result = Array.from(
      iterateFeatures(
        obj,
        browsers,
        values,
        depth,
        tag,
        deprecated,
        identifier,
      ),
    );

    assert.deepEqual(result, ['feature1', 'feature2']);
  });

  it('should filter out deprecated', () => {
    const browsers: BrowserName[] = ['chrome', 'firefox'];
    const values = ['1.0', 'null'];
    const depth = 2;
    const tag = '';
    const identifier = '';
    const deprecated = false;

    const result = Array.from(
      iterateFeatures(
        obj,
        browsers,
        values,
        depth,
        tag,
        deprecated,
        identifier,
      ),
    );

    assert.deepEqual(result, ['feature1']);
  });

  it('should filter out non-deprecated', () => {
    const browsers: BrowserName[] = ['chrome', 'firefox'];
    const values = ['1.0', 'null'];
    const depth = 2;
    const tag = '';
    const identifier = '';
    const deprecated = true;

    const result = Array.from(
      iterateFeatures(
        obj,
        browsers,
        values,
        depth,
        tag,
        deprecated,
        identifier,
      ),
    );

    assert.deepEqual(result, ['feature2']);
  });
});
