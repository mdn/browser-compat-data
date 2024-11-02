/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { iterateFeatures } from './traverse.js';

describe('iterateFeatures', () => {
  let obj: any;
  let options: any;
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
            deprecated: false,
          },
        },
      },
    };
    options = {
      browsers: ['chrome', 'firefox'],
      values: ['1.0', 'null'],
      depth: 2,
      tag: '',
      identifier: '',
      status: {
        deprecated: undefined,
        standard_track: undefined,
        experimental: undefined,
      },
    };
  });

  it('should yield correct identifiers for given object', () => {
    const result = Array.from(
      iterateFeatures(
        obj,
        options.browsers,
        options.values,
        options.depth,
        options.tag,
        options.identifier,
      ),
    );

    assert.deepEqual(result, ['feature1', 'feature2']);
  });

  it('should filter out deprecated', () => {
    options.status.deprecated = false;
    obj.feature2.__compat.status.deprecated = true;
    const result = Array.from(
      iterateFeatures(
        obj,
        options.browsers,
        options.values,
        options.depth,
        options.tag,
        options.identifier,
        options.status,
      ),
    );

    assert.deepEqual(result, ['feature1']);
  });

  it('should filter out non-deprecated', () => {
    options.status.deprecated = true;
    obj.feature2.__compat.status.deprecated = true;
    const result = Array.from(
      iterateFeatures(
        obj,
        options.browsers,
        options.values,
        options.depth,
        options.tag,
        options.identifier,
        options.status,
      ),
    );

    assert.deepEqual(result, ['feature2']);
  });

  it('should filter out non-experimental', () => {
    obj.feature2.__compat.status.experimental = true;
    options.status.experimental = true;
    const result = Array.from(
      iterateFeatures(
        obj,
        options.browsers,
        options.values,
        options.depth,
        options.tag,
        options.identifier,
        options.status,
      ),
    );

    assert.deepEqual(result, ['feature2']);
  });

  it('should filter out experimental', () => {
    obj.feature2.__compat.status.experimental = true;
    options.status.experimental = false;
    const result = Array.from(
      iterateFeatures(
        obj,
        options.browsers,
        options.values,
        options.depth,
        options.tag,
        options.identifier,
        options.status,
      ),
    );

    assert.deepEqual(result, ['feature1']);
  });

  it('should filter out non-standard track', () => {
    obj.feature1.__compat.status.standard_track = false;
    options.status.standard_track = true;
    const result = Array.from(
      iterateFeatures(
        obj,
        options.browsers,
        options.values,
        options.depth,
        options.tag,
        options.identifier,
        options.status,
      ),
    );

    assert.deepEqual(result, ['feature2']);
  });

  it('should filter out standard track', () => {
    obj.feature1.__compat.status.standard_track = false;
    options.status.standard_track = false;
    const result = Array.from(
      iterateFeatures(
        obj,
        options.browsers,
        options.values,
        options.depth,
        options.tag,
        options.identifier,
        options.status,
      ),
    );

    assert.deepEqual(result, ['feature1']);
  });
});
