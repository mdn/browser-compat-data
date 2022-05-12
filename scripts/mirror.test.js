/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const assert = require('assert').strict;

const { browsers } = require('..');
const { getMatchingBrowserVersion } = require('./mirror');

describe('mirror', function () {
  const match = (source_browser, source_version, dest_browser) => {
    const source_release = browsers[source_browser].releases[source_version];
    return getMatchingBrowserVersion(dest_browser, source_release);
  };

  it('chrome_android', function () {
    assert.equal(match('chrome', '1', 'chrome_android'), '18');
    assert.equal(match('chrome', '2', 'chrome_android'), '18');
    assert.equal(match('chrome', '17', 'chrome_android'), '18');
    assert.equal(match('chrome', '18', 'chrome_android'), '18');
    assert.equal(match('chrome', '19', 'chrome_android'), '25');
    assert.equal(match('chrome', '24', 'chrome_android'), '25');
    assert.equal(match('chrome', '25', 'chrome_android'), '25');
    assert.equal(match('chrome', '26', 'chrome_android'), '26');
  });

  it('edge', function () {
    assert.equal(match('chrome', '1', 'edge'), false);
    assert.equal(match('chrome', '27', 'edge'), false);
    assert.equal(match('chrome', '28', 'edge'), '79');
    assert.equal(match('chrome', '79', 'edge'), '79');
    assert.equal(match('chrome', '80', 'edge'), '80');
  });

  it('firefox_android', function () {
    assert.equal(match('firefox', '1', 'firefox_android'), '4');
    assert.equal(match('firefox', '2', 'firefox_android'), '4');
    assert.equal(match('firefox', '3', 'firefox_android'), '4');
    assert.equal(match('firefox', '4', 'firefox_android'), '4');
    assert.equal(match('firefox', '68', 'firefox_android'), '68');
    assert.equal(match('firefox', '69', 'firefox_android'), '79');
    assert.equal(match('firefox', '79', 'firefox_android'), '79');
    assert.equal(match('firefox', '80', 'firefox_android'), '80');
  });

  it('opera', function () {
    assert.equal(match('chrome', '1', 'opera'), '15');
    assert.equal(match('chrome', '27', 'opera'), '15');
    assert.equal(match('chrome', '28', 'opera'), '15');
    assert.equal(match('chrome', '29', 'opera'), '16');
    assert.equal(match('chrome', '30', 'opera'), '17');
  });

  it('opera_android', function () {
    assert.equal(match('chrome_android', '18', 'opera_android'), '14');
    assert.equal(match('chrome_android', '26', 'opera_android'), '14');
    assert.equal(match('chrome_android', '27', 'opera_android'), '14'); // wrong, should be 15
    assert.equal(match('chrome_android', '28', 'opera_android'), '15');
    assert.equal(match('chrome_android', '29', 'opera_android'), '16');
    assert.equal(match('chrome_android', '30', 'opera_android'), '18');
  });

  it('safari_ios', function () {
    assert.equal(match('safari', '1', 'safari_ios'), '1');
    assert.equal(match('safari', '1.1', 'safari_ios'), '1');
    assert.equal(match('safari', '1.2', 'safari_ios'), '1');
    assert.equal(match('safari', '1.3', 'safari_ios'), '1');
    assert.equal(match('safari', '2', 'safari_ios'), '1');
    assert.equal(match('safari', '3', 'safari_ios'), '2'); // wrong, should be 1
    assert.equal(match('safari', '3.1', 'safari_ios'), '2');
    assert.equal(match('safari', '4', 'safari_ios'), '3.2'); // ambiguous
    assert.equal(match('safari', '5', 'safari_ios'), '4.2');
    assert.equal(match('safari', '5.1', 'safari_ios'), '6');
    assert.equal(match('safari', '6', 'safari_ios'), '6');
    assert.equal(match('safari', '7', 'safari_ios'), '8');
    assert.equal(match('safari', '8', 'safari_ios'), '8');
    assert.equal(match('safari', '9', 'safari_ios'), '9');
    assert.equal(match('safari', '9.1', 'safari_ios'), '9.3');
    assert.equal(match('safari', '10', 'safari_ios'), '10');
    assert.equal(match('safari', '10.1', 'safari_ios'), '10.3');
    assert.equal(match('safari', '11', 'safari_ios'), '11');
    assert.equal(match('safari', '11.1', 'safari_ios'), '11.3');
    assert.equal(match('safari', '12', 'safari_ios'), '12');
    assert.equal(match('safari', '12.1', 'safari_ios'), '12.2');
    assert.equal(match('safari', '13', 'safari_ios'), '13');
    assert.equal(match('safari', '13.1', 'safari_ios'), '13.4');
    assert.equal(match('safari', '14', 'safari_ios'), '14');
    assert.equal(match('safari', '14.1', 'safari_ios'), '14.5');
    assert.equal(match('safari', '15', 'safari_ios'), '15.1');
    assert.equal(match('safari', '15.1', 'safari_ios'), '15.1');
    assert.equal(match('safari', '15.2', 'safari_ios'), '15.2');
    assert.equal(match('safari', '15.3', 'safari_ios'), '15.3');
    assert.equal(match('safari', '15.4', 'safari_ios'), '15.4');
  });

  it('samsunginternet_android', function () {
    assert.equal(
      match('chrome_android', '18', 'samsunginternet_android'),
      '1.0',
    );
    assert.equal(
      match('chrome_android', '25', 'samsunginternet_android'),
      '1.5',
    );
    assert.equal(
      match('chrome_android', '28', 'samsunginternet_android'),
      '1.5',
    );
    assert.equal(
      match('chrome_android', '29', 'samsunginternet_android'),
      '2.0',
    );
    assert.equal(
      match('chrome_android', '33', 'samsunginternet_android'),
      '2.0',
    );
    assert.equal(
      match('chrome_android', '34', 'samsunginternet_android'),
      '2.0',
    );
    assert.equal(
      match('chrome_android', '35', 'samsunginternet_android'),
      '3.0',
    );
    assert.equal(
      match('chrome_android', '95', 'samsunginternet_android'),
      '17.0',
    );
  });

  it('webview_android', function () {
    assert.equal(match('chrome_android', '18', 'webview_android'), false);
    assert.equal(match('chrome_android', '25', 'webview_android'), false);
    assert.equal(match('chrome_android', '26', 'webview_android'), false);
    assert.equal(match('chrome_android', '27', 'webview_android'), false);
    assert.equal(match('chrome_android', '28', 'webview_android'), '4.4');
    assert.equal(match('chrome_android', '36', 'webview_android'), '37');
    assert.equal(match('chrome_android', '37', 'webview_android'), '37');
  });
});
