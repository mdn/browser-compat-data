/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { processData } from './test-links.js';

describe('test-links', () => {
  it('should process Bugzilla bug links correctly', async () => {
    const rawData = 'https://bugzilla.mozilla.org/show_bug.cgi?id=12345';
    const errors = await processData(rawData);

    assert.equal(errors.length, 1);
    assert.equal(errors[0].issue, 'Use shortenable URL');
    assert.equal(errors[0].expected, 'https://bugzil.la/12345');
  });

  it('should process new Chromium bug links correctly', async () => {
    const rawData = 'https://issues.chromium.org/issues/12345';
    const errors = await processData(rawData);

    assert.equal(errors.length, 1);
    assert.equal(errors[0].issue, 'Use shortenable URL');
    assert.equal(errors[0].expected, 'https://crbug.com/12345');
  });

  it('should process old Chromium bug links correctly', async () => {
    const rawData =
      'https://bugs.chromium.org/p/chromium/issues/detail?id=12345';
    const errors = await processData(rawData);

    assert.equal(errors.length, 1);
    assert.equal(errors[0].issue, 'Use shortenable URL');
    assert.equal(errors[0].expected, 'https://crbug.com/12345');
  });

  it('should process old Chromium bug links with categories correctly', async () => {
    const rawData =
      'https://bugs.chromium.org/p/category/issues/detail?id=12345';
    const errors = await processData(rawData);

    assert.equal(errors.length, 1);
    assert.equal(errors[0].issue, 'Use shortenable URL');
    assert.equal(errors[0].expected, 'https://crbug.com/category/12345');
  });

  it('should process Chromium revision links correctly', async () => {
    const rawData = 'https://chromium.googlesource.com/chromium/src/+/12345';
    const errors = await processData(rawData);

    assert.equal(errors.length, 1);
    assert.equal(errors[0].issue, 'Use shortenable URL');
    assert.equal(errors[0].expected, 'https://crrev.com/12345');
  });

  it('should process WebKit links correctly', async () => {
    const rawData = 'https://bugs.webkit.org/show_bug.cgi?id=12345';
    const errors = await processData(rawData);

    assert.equal(errors.length, 1);
    assert.equal(errors[0].issue, 'Use shortenable URL');
    assert.equal(errors[0].expected, 'https://webkit.org/b/12345');
  });

  it('should process multiple links correctly', async () => {
    const rawData =
      'https://bugs.chromium.org/p/chromium/issues/detail?id=12345\n' +
      'https://bugs.webkit.org/show_bug.cgi?id=12345';
    const errors = await processData(rawData);

    assert.equal(errors.length, 2);
    assert.equal(errors[0].issue, 'Use shortenable URL');
    assert.equal(errors[0].expected, 'https://crbug.com/12345');
    assert.equal(errors[1].issue, 'Use shortenable URL');
    assert.equal(errors[1].expected, 'https://webkit.org/b/12345');
  });

  it('should process bug links correctly', async () => {
    const rawData = "<a href='http://bugzil.la/12345'>Bug 12345</a>";
    const errors = await processData(rawData);

    assert.equal(errors.length, 1);
    assert.equal(errors[0].issue, 'Use HTTPS for bug links');
    assert.equal(errors[0].expected, 'https://bugzil.la/12345');
  });

  it('should process bug links with "bug" word outside correctly', async () => {
    const rawData = "bug <a href='https://bugzil.la/12345'>12345</a>";
    const errors = await processData(rawData);

    assert.equal(errors.length, 1);
    assert.equal(errors[0].issue, 'Move word "bug" into link text');
    assert.equal(
      errors[0].expected,
      "<a href='https://bugzil.la/12345'>bug 12345</a>",
    );
  });

  it('should process bug links with capital "Bug"', async () => {
    const rawData = "<a href='https://bugzil.la/12345'>Bug 12345</a>";
    const errors = await processData(rawData);

    assert.equal(errors.length, 1);
    assert.equal(errors[0].issue, 'Use lowercase "bug" word within sentence');
    assert.equal(errors[0].expected, 'bug 12345');
  });

  it('should process bug links with non-standard bug text', async () => {
    const rawData =
      "see <a href='https://crbug.com/40067890'>Chrome bug 40067890</a>.";
    const errors = await processData(rawData);

    assert.equal(errors.length, 1);
    assert.equal(errors[0].issue, 'Use standard link text');
    assert.equal(errors[0].expected, 'bug 40067890');
  });

  describe('MDN links', () => {
    it('should process MDN links on HTTP correctly', async () => {
      const rawData = '"http://developer.mozilla.org/docs/Web/API/console"';
      const errors = await processData(rawData);

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

    it('should process MDN links on subdomain correctly', async () => {
      const rawData =
        '"https://allizom.developer.mozilla.org/docs/Web/API/console"';
      const errors = await processData(rawData);

      assert.equal(errors.length, 1);
      assert.equal(errors[0].issue, 'Use correct MDN domain');
      assert.equal(
        errors[0].expected,
        'https://developer.mozilla.org/docs/Web/API/console',
      );
    });

    it('should process localized MDN links correctly', async () => {
      const rawData =
        '"https://developer.mozilla.org/en-US/docs/Web/API/console"';
      const errors = await processData(rawData);

      assert.equal(errors.length, 1);
      assert.equal(errors[0].issue, 'Use non-localized MDN URL');
      assert.equal(
        errors[0].expected,
        'https://developer.mozilla.org/docs/Web/API/console',
      );
    });
  });

  describe('Microsoft Developer links', () => {
    it('should process Microsoft Developer links correctly', async () => {
      const rawData = '"https://developer.microsoft.com/en-us/microsoft-edge"';
      const errors = await processData(rawData);

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

    it('should process localized Microsoft Developer links correctly', async () => {
      const rawData = '"https://developer.microsoft.com/fr-fr/microsoft-edge"';
      const errors = await processData(rawData);

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
