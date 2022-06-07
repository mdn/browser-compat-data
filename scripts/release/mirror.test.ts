/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { getMatchingBrowserVersion } from './mirror';

describe('mirror', () => {
  describe('getMatchingBrowserVersion()', () => {
    const mappings = {
      chrome_android: [
        ['1', '18'],
        ['2', '18'],
        ['17', '18'],
        ['18', '18'],
        ['19', '25'],
        ['24', '25'],
        ['25', '25'],
        ['26', '26'],
      ],
      edge: [
        ['50', '79'],
        ['78', '79'],
        ['79', '79'],
        ['80', '80'],
        ['90', '90'],
      ],
      firefox_android: [
        ['1', '4'],
        ['2', '4'],
        ['3', '4'],
        ['4', '4'],
        ['68', '68'],
        ['69', '79'],
        ['79', '79'],
        ['80', '80'],
      ],
      opera: [
        ['1', '15'],
        ['27', '15'],
        ['28', '15'],
        ['29', '16'],
        ['30', '17'],
      ],
      opera_android: [
        ['18', '14'],
        ['26', '14'],
        ['27', '15'],
        ['28', '15'],
        ['29', '16'],
        ['30', '18'],
      ],
      safari_ios: [
        ['1', '1'],
        ['1.1', '1'],
        ['1.2', '1'],
        ['1.3', '1'],
        ['2', '1'],
        ['3', '2'], // wrong, should be 1
        ['3.1', '2'],
        ['4', '3.2'], // ambiguous
        ['5', '4.2'],
        ['5.1', '6'],
        ['6', '6'],
        ['7', '8'],
        ['8', '8'],
        ['9', '9'],
        ['9.1', '9.3'],
        ['10', '10'],
        ['10.1', '10.3'],
        ['11', '11'],
        ['11.1', '11.3'],
        ['12', '12'],
        ['12.1', '12.2'],
        ['13', '13'],
        ['13.1', '13.4'],
        ['14', '14'],
        ['14.1', '14.5'],
        ['15', '15.1'],
        ['15.1', '15.1'],
        ['15.2', '15.2'],
        ['15.3', '15.3'],
        ['15.4', '15.4'],
      ],
      samsunginternet_android: [
        ['18', '1.0'],
        ['25', '1.5'],
        ['28', '1.5'],
        ['29', '2.0'],
        ['33', '2.0'],
        ['34', '2.0'],
        ['35', '3.0'],
        ['95', '17.0'],
      ],
      webview_android: [
        ['18', false],
        ['25', false],
        ['26', false],
        ['27', false],
        ['28', '4.4'],
        ['36', '37'],
        ['37', '37'],
      ],
    };

    for (const [browser, versionMap] of Object.entries(mappings)) {
      describe(browser, () => {
        for (const pair of versionMap) {
          it(`${pair[0]} => ${pair[1]}`, () => {
            assert.equal(getMatchingBrowserVersion(browser, pair[0]), pair[1]);
          });
        }
      });
    }
  });
});
