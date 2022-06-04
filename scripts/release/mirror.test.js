/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import bcd from '../../index.js';
import mirrorSupport from './mirror.js';

describe('mirror', () => {
  describe('default export', () => {
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
        ['1', false], // wrong, invalid inference
        ['27', false], // wrong, invalid inference
        ['28', '79'],
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
        ['7', '8'], // wrong, should be 7
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
        ['15', '15.1'], // wrong, should be 15
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
        ['18', '1'], // wrong, invalid inference
        ['25', '≤37'], // wrong, should be 4.4
        ['26', '≤37'], // wrong, should be 4.4
        ['27', '≤37'], // wrong, should be 4.4
        ['28', '≤37'], // wrong, should be 4.4
        ['29', '≤37'], // wrong, should be 4.4
        ['30', '4.4'],
        ['31', '4.4'],
        ['32', '4.4'],
        ['33', '4.4.3'],
        ['34', '4.4.3'],
        ['35', '4.4.3'],
        ['36', '4.4.3'],
        ['37', '37'],
      ],
    };

    for (const [browser, versionMap] of Object.entries(mappings)) {
      describe(browser, () => {
        const upstream = bcd.browsers[browser].upstream;
        for (const pair of versionMap) {
          it(`${pair[0]} => ${pair[1]}`, () => {
            const support = {
              [upstream]: {
                version_added: pair[0],
              },
            };
            const mirrored = mirrorSupport(browser, support);
            assert.equal(mirrored.version_added, pair[1]);
          });
        }
      });
    }
  });
});
