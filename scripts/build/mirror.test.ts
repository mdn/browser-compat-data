/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { BrowserName } from '../../types/types.js';
import bcd from '../../index.js';
import { InternalSupportBlock } from '../../types/index.js';

import mirrorSupport from './mirror.js';

describe('mirror', () => {
  describe('default export', () => {
    describe('version numbers match expected values', () => {
      const mappings: {
        [index in BrowserName]?: [string, string | boolean][];
      } = {
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
          ['1', '79'],
          ['27', '79'],
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
          ['3', '2'],
          ['3.1', '2'],
          ['4', '3.2'],
          ['5', '4.2'],
          ['5.1', '5'],
          ['6', '6'],
          ['7', '7'],
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
          ['15', '15'],
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
          ['18', '4.4'],
          ['25', '4.4'],
          ['26', '4.4'],
          ['27', '4.4'],
          ['28', '4.4'],
          ['29', '4.4'],
          ['30', '4.4'],
          ['31', '4.4.3'],
          ['32', '4.4.3'],
          ['33', '4.4.3'],
          ['34', '37'],
          ['35', '37'],
          ['36', '37'],
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
              const mirrored = mirrorSupport(browser as BrowserName, support);
              assert.deepEqual(mirrored, { version_added: pair[1] });
            });
          }
        });
      }
    });

    describe('Notes', () => {
      it('version numbers in notes are mapped', () => {
        const support = {
          chrome: {
            version_added: '65',
            notes: [
              'Before Chrome 70, this method always returned <code>true</code> even if the webcam was not connected. Since version 70, this method correctly returns the webcam state.',
              'Google Chrome will always use the default webcam.',
            ],
          },
        };

        const mirrored = mirrorSupport('opera', support);
        assert.deepEqual(mirrored, {
          version_added: '52',
          notes: [
            'Before Opera 57, this method always returned <code>true</code> even if the webcam was not connected. Since version 57, this method correctly returns the webcam state.',
            'Opera will always use the default webcam.',
          ],
        });
      });

      it('ChromeOS is not renamed to EdgeOS, OperaOS, etc.', () => {
        const support = {
          chrome: {
            version_added: '65',
            notes:
              'This feature is only supported in ChromeOS, macOS and Linux.',
          },
        };

        const mirrored = mirrorSupport('opera', support);
        assert.deepEqual(mirrored, {
          version_added: '52',
          notes: 'This feature is only supported in ChromeOS, macOS and Linux.',
        });
      });
    });

    describe('Validations', () => {
      it('mirror target must have upstream browser', () => {
        assert.throws(
          () => mirrorSupport('chrome' as BrowserName, {}),
          Error,
          'Upstream is not defined for chrome, cannot mirror!',
        );
      });

      it('throw error if upstream data is not defined', () => {
        assert.throws(
          () => mirrorSupport('chrome_android' as BrowserName, {}),
          Error,
          'The data for chrome is not defined for mirroring to chrome_android, cannot mirror!',
        );
      });
    });

    describe('Edge Cases', () => {
      it('mirror from a mirrored value', () => {
        const support: InternalSupportBlock = {
          chrome: {
            version_added: '40',
          },
          chrome_android: 'mirror',
        };

        const mirrored = mirrorSupport('opera_android', support);
        assert.deepEqual(mirrored, { version_added: '27' });
      });

      it('version_added is false if resulting version_added == version_removed', () => {
        const support = {
          firefox: {
            version_added: '70',
            version_removed: '72',
          },
        };

        const mirrored = mirrorSupport('firefox_android', support);
        assert.deepEqual(mirrored, { version_added: false });
      });

      describe('destination browser does not support flags', () => {
        it('only flag statement', () => {
          const support: InternalSupportBlock = {
            chrome_android: {
              version_added: '50',
              flags: [
                {
                  name: '#enable-experimental-web-platform-features',
                  type: 'preference',
                },
              ],
              notes: 'This feature is only available on Google Pixel devices.',
            },
          };

          const mirrored = mirrorSupport('samsunginternet_android', support);
          assert.deepEqual(mirrored, { version_added: false });
        });

        it('flag and non-flag statement', () => {
          const support: InternalSupportBlock = {
            chrome_android: [
              {
                version_added: '90',
              },
              {
                version_added: '50',
                flags: [
                  {
                    name: '#enable-experimental-web-platform-features',
                    type: 'preference',
                  },
                ],
              },
            ],
          };

          const mirrored = mirrorSupport('samsunginternet_android', support);
          assert.deepEqual(mirrored, { version_added: '15.0' });
        });
      });

      it('feature removed before Chromium Edge', () => {
        const support = {
          chrome: {
            version_added: '10',
            version_removed: '38',
            prefix: 'webkit',
          },
        };

        const mirrored = mirrorSupport('edge', support);
        assert.deepEqual(mirrored, { version_added: false });
      });
    });
  });
});
