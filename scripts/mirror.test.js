/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import getMatchingBrowserVersion from './mirror.js';

describe('mirror', () => {
  describe('getMatchingBrowserVersion()', () => {
    it('chrome_android', () => {
      assert.equal(getMatchingBrowserVersion('chrome', '1'), '18');
      assert.equal(getMatchingBrowserVersion('chrome', '2'), '18');
      assert.equal(getMatchingBrowserVersion('chrome', '17'), '18');
      assert.equal(getMatchingBrowserVersion('chrome', '18'), '18');
      assert.equal(getMatchingBrowserVersion('chrome', '19'), '25');
      assert.equal(getMatchingBrowserVersion('chrome', '24'), '25');
      assert.equal(getMatchingBrowserVersion('chrome', '25'), '25');
      assert.equal(getMatchingBrowserVersion('chrome', '26'), '26');
    });

    it('edge', () => {
      assert.equal(match('edge', '50'), '79');
      assert.equal(match('edge', '78'), '79');
      assert.equal(match('edge', '79'), '79');
      assert.equal(match('edge', '80'), '80');
      assert.equal(match('edge', '90'), '90');
    });

    it('firefox_android', () => {
      assert.equal(getMatchingBrowserVersion('firefox', '1'), '4');
      assert.equal(getMatchingBrowserVersion('firefox', '2'), '4');
      assert.equal(getMatchingBrowserVersion('firefox', '3'), '4');
      assert.equal(getMatchingBrowserVersion('firefox', '4'), '4');
      assert.equal(getMatchingBrowserVersion('firefox', '68'), '68');
      assert.equal(getMatchingBrowserVersion('firefox', '69'), '79');
      assert.equal(getMatchingBrowserVersion('firefox', '79'), '79');
      assert.equal(getMatchingBrowserVersion('firefox', '80'), '80');
    });

    it('opera', () => {
      assert.equal(getMatchingBrowserVersion('chrome', '1'), '15');
      assert.equal(getMatchingBrowserVersion('chrome', '27'), '15');
      assert.equal(getMatchingBrowserVersion('chrome', '28'), '15');
      assert.equal(getMatchingBrowserVersion('chrome', '29'), '16');
      assert.equal(getMatchingBrowserVersion('chrome', '30'), '17');
    });

    it('opera_android', () => {
      assert.equal(getMatchingBrowserVersion('chrome_android', '18'), '14');
      assert.equal(getMatchingBrowserVersion('chrome_android', '26'), '14');
      assert.equal(getMatchingBrowserVersion('chrome_android', '27'), '14'); // wrong, should be 15
      assert.equal(getMatchingBrowserVersion('chrome_android', '28'), '15');
      assert.equal(getMatchingBrowserVersion('chrome_android', '29'), '16');
      assert.equal(getMatchingBrowserVersion('chrome_android', '30'), '18');
    });

    it('safari_ios', () => {
      assert.equal(getMatchingBrowserVersion('safari', '1'), '1');
      assert.equal(getMatchingBrowserVersion('safari', '1.1'), '1');
      assert.equal(getMatchingBrowserVersion('safari', '1.2'), '1');
      assert.equal(getMatchingBrowserVersion('safari', '1.3'), '1');
      assert.equal(getMatchingBrowserVersion('safari', '2'), '1');
      assert.equal(getMatchingBrowserVersion('safari', '3'), '2'); // wrong, should be 1
      assert.equal(getMatchingBrowserVersion('safari', '3.1'), '2');
      assert.equal(getMatchingBrowserVersion('safari', '4'), '3.2'); // ambiguous
      assert.equal(getMatchingBrowserVersion('safari', '5'), '4.2');
      assert.equal(getMatchingBrowserVersion('safari', '5.1'), '6');
      assert.equal(getMatchingBrowserVersion('safari', '6'), '6');
      assert.equal(getMatchingBrowserVersion('safari', '7'), '8');
      assert.equal(getMatchingBrowserVersion('safari', '8'), '8');
      assert.equal(getMatchingBrowserVersion('safari', '9'), '9');
      assert.equal(getMatchingBrowserVersion('safari', '9.1'), '9.3');
      assert.equal(getMatchingBrowserVersion('safari', '10'), '10');
      assert.equal(getMatchingBrowserVersion('safari', '10.1'), '10.3');
      assert.equal(getMatchingBrowserVersion('safari', '11'), '11');
      assert.equal(getMatchingBrowserVersion('safari', '11.1'), '11.3');
      assert.equal(getMatchingBrowserVersion('safari', '12'), '12');
      assert.equal(getMatchingBrowserVersion('safari', '12.1'), '12.2');
      assert.equal(getMatchingBrowserVersion('safari', '13'), '13');
      assert.equal(getMatchingBrowserVersion('safari', '13.1'), '13.4');
      assert.equal(getMatchingBrowserVersion('safari', '14'), '14');
      assert.equal(getMatchingBrowserVersion('safari', '14.1'), '14.5');
      assert.equal(getMatchingBrowserVersion('safari', '15'), '15.1');
      assert.equal(getMatchingBrowserVersion('safari', '15.1'), '15.1');
      assert.equal(getMatchingBrowserVersion('safari', '15.2'), '15.2');
      assert.equal(getMatchingBrowserVersion('safari', '15.3'), '15.3');
      assert.equal(getMatchingBrowserVersion('safari', '15.4'), '15.4');
    });

    it('samsunginternet_android', () => {
      assert.equal(getMatchingBrowserVersion('chrome_android', '18'), '1.0');
      assert.equal(getMatchingBrowserVersion('chrome_android', '25'), '1.5');
      assert.equal(getMatchingBrowserVersion('chrome_android', '28'), '1.5');
      assert.equal(getMatchingBrowserVersion('chrome_android', '29'), '2.0');
      assert.equal(getMatchingBrowserVersion('chrome_android', '33'), '2.0');
      assert.equal(getMatchingBrowserVersion('chrome_android', '34'), '2.0');
      assert.equal(getMatchingBrowserVersion('chrome_android', '35'), '3.0');
      assert.equal(getMatchingBrowserVersion('chrome_android', '95'), '17.0');
    });

    it('webview_android', () => {
      assert.equal(getMatchingBrowserVersion('chrome_android', '18'), false);
      assert.equal(getMatchingBrowserVersion('chrome_android', '25'), false);
      assert.equal(getMatchingBrowserVersion('chrome_android', '26'), false);
      assert.equal(getMatchingBrowserVersion('chrome_android', '27'), false);
      assert.equal(getMatchingBrowserVersion('chrome_android', '28'), '4.4');
      assert.equal(getMatchingBrowserVersion('chrome_android', '36'), '37');
      assert.equal(getMatchingBrowserVersion('chrome_android', '37'), '37');
    });
  });
});
