/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { processData } from './test-links.js';

describe('test-links', () => {
  it('should process Bugzilla links correctly', () => {
    const rawData = 'https://bugzilla.mozilla.org/show_bug.cgi?id=12345';
    const errors = processData(rawData);

    assert.equal(errors.length, 1);
    assert.equal(errors[0].issue, 'Use shortenable URL');
    assert.equal(errors[0].expected, 'https://bugzil.la/12345');
  });

  it('should process Chromium links correctly', () => {
    const rawData =
      'https://bugs.chromium.org/p/chromium/issues/detail?id=12345';
    const errors = processData(rawData);

    assert.equal(errors.length, 1);
    assert.equal(errors[0].issue, 'Use shortenable URL');
    assert.equal(errors[0].expected, 'https://crbug.com/12345');
  });

  it('should process Chromium category links correctly', () => {
    const rawData =
      'https://bugs.chromium.org/p/category/issues/detail?id=12345';
    const errors = processData(rawData);

    assert.equal(errors.length, 1);
    assert.equal(errors[0].issue, 'Use shortenable URL');
    assert.equal(errors[0].expected, 'https://crbug.com/category/12345');
  });

  it('should process Chromium revision links correctly', () => {
    const rawData = 'https://chromium.googlesource.com/chromium/src/+/12345';
    const errors = processData(rawData);

    assert.equal(errors.length, 1);
    assert.equal(errors[0].issue, 'Use shortenable URL');
    assert.equal(errors[0].expected, 'https://crrev.com/12345');
  });

  it('should process WebKit links correctly', () => {
    const rawData = 'https://bugs.webkit.org/show_bug.cgi?id=12345';
    const errors = processData(rawData);

    assert.equal(errors.length, 1);
    assert.equal(errors[0].issue, 'Use shortenable URL');
    assert.equal(errors[0].expected, 'https://webkit.org/b/12345');
  });

  it('should process multiple links correctly', () => {
    const rawData =
      'https://bugs.chromium.org/p/chromium/issues/detail?id=12345\n' +
      'https://bugs.webkit.org/show_bug.cgi?id=12345';
    const errors = processData(rawData);

    assert.equal(errors.length, 2);
    assert.equal(errors[0].issue, 'Use shortenable URL');
    assert.equal(errors[0].expected, 'https://crbug.com/12345');
    assert.equal(errors[1].issue, 'Use shortenable URL');
    assert.equal(errors[1].expected, 'https://webkit.org/b/12345');
  });

  it('should process bug links correctly', () => {
    const rawData = "<a href='http://bugzil.la/12345'>Bug 12345</a>";
    const errors = processData(rawData);

    assert.equal(errors.length, 1);
    assert.equal(errors[0].issue, 'Use HTTPS for bug links');
    assert.equal(errors[0].expected, 'https://bugzil.la/12345');
  });

  it('should process bug links with "bug" word outside correctly', () => {
    const rawData = "bug <a href='https://bugzil.la/12345'>12345</a>";
    const errors = processData(rawData);

    assert.equal(errors.length, 1);
    assert.equal(errors[0].issue, 'Move word "bug" into link text');
    assert.equal(
      errors[0].expected,
      "<a href='https://bugzil.la/12345'>bug 12345</a>",
    );
  });

  it('should process bug links with capital "Bug"', () => {
    const rawData = "<a href='https://bugzil.la/12345'>Bug 12345</a>";
    const errors = processData(rawData);

    assert.equal(errors.length, 1);
    assert.equal(errors[0].issue, 'Use lowercase "bug" word within sentence');
    assert.equal(errors[0].expected, 'bug 12345');
  });

  it('should process bug links with non-standard bug text', () => {
    const rawData =
      "see <a href='https://crbug.com/67890'>Chrome bug 67890</a>.";
    const errors = processData(rawData);

    assert.equal(errors.length, 1);
    assert.equal(errors[0].issue, 'Use standard link text');
    assert.equal(errors[0].expected, 'bug 67890');
  });

  describe('MDN links', () => {
    it('should process MDN links on HTTP correctly', () => {
      const rawData = '"http://developer.mozilla.org/docs/Web/API/console"';
      const errors = processData(rawData);

      assert.equal(errors.length, 1);
      assert.equal(errors[0].issue, 'Use HTTPS MDN URL');
      assert.equal(
        errors[0].actual,
        'http://developer.mozilla.org/docs/Web/API/console',
      );
      assert.equal(
        errors[0].expected,
        'https://developer.mozilla.org/docs/Web/API/console',
      );
    });

    it('should process MDN links on subdomain correctly', () => {
      const rawData =
        '"https://allizom.developer.mozilla.org/docs/Web/API/console"';
      const errors = processData(rawData);

      assert.equal(errors.length, 1);
      assert.equal(errors[0].issue, 'Use correct MDN domain');
      assert.equal(
        errors[0].expected,
        'https://developer.mozilla.org/docs/Web/API/console',
      );
    });

    it('should process localized MDN links correctly', () => {
      const rawData =
        '"https://developer.mozilla.org/en-US/docs/Web/API/console"';
      const errors = processData(rawData);

      assert.equal(errors.length, 1);
      assert.equal(errors[0].issue, 'Use non-localized MDN URL');
      assert.equal(
        errors[0].expected,
        'https://developer.mozilla.org/docs/Web/API/console',
      );
    });
  });

  describe('Microsoft Developer links', () => {
    it('should process Microsoft Developer links correctly', () => {
      const rawData = '"https://developer.microsoft.com/en-us/microsoft-edge"';
      const errors = processData(rawData);

      assert.equal(errors.length, 1);
      assert.equal(
        errors[0].issue,
        'Use non-localized Microsoft Developer URL',
      );
      assert.equal(
        errors[0].expected,
        'https://developer.microsoft.com/microsoft-edge',
      );
    });

    it('should process localized Microsoft Developer links correctly', () => {
      const rawData = '"https://developer.microsoft.com/fr-fr/microsoft-edge"';
      const errors = processData(rawData);

      assert.equal(errors.length, 1);
      assert.equal(
        errors[0].issue,
        'Use non-localized Microsoft Developer URL',
      );
      assert.equal(
        errors[0].expected,
        'https://developer.microsoft.com/microsoft-edge',
      );
    });
  });
});
