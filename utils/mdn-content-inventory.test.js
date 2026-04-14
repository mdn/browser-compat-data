/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { tailsMatch } from './mdn-content-inventory.js';

describe('tailsMatch()', () => {
  it('matches identical tails', () => {
    assert.ok(tailsMatch('abort', 'abort'));
  });

  it('matches when slug tail contains path tail', () => {
    assert.ok(tailsMatch('Symbol.dispose', 'dispose'));
  });

  it('matches when path tail contains slug tail', () => {
    assert.ok(tailsMatch('bar', 'foobar'));
  });

  it('matches @@symbol path tail against Symbol.* slug tail', () => {
    assert.ok(tailsMatch('Symbol.dispose', '@@dispose'));
    assert.ok(tailsMatch('Symbol.iterator', '@@iterator'));
    assert.ok(tailsMatch('Symbol.asyncIterator', '@@asyncIterator'));
    assert.ok(tailsMatch('Symbol.toPrimitive', '@@toPrimitive'));
  });

  it('does not match unrelated tails', () => {
    assert.ok(!tailsMatch('Symbol.dispose', 'foo'));
    assert.ok(!tailsMatch('abort', 'fetch'));
  });

  it('does not match when path tail is undefined', () => {
    assert.ok(!tailsMatch('abort', undefined));
  });
});
