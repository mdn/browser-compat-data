/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import stringifyAndOrderProperties from './stringify-and-order-properties.js';

describe('Order Properties', () => {
  it('should correctly order properties for data', () => {
    const input = {
      __compat: {
        support: {
          firefox: { version_added: '1.5' },
          chrome: { version_added: '1' },
        },
        status: {
          deprecated: false,

          standard_track: true,
          experimental: false,
        },
      },
    };

    const expected =
      '{\n  "__compat": {\n    "support": {\n      "firefox": {\n        "version_added": "1.5"\n      },\n      "chrome": {\n        "version_added": "1"\n      }\n    },\n    "status": {\n      "experimental": false,\n      "standard_track": true,\n      "deprecated": false\n    }\n  }\n}';

    const result = stringifyAndOrderProperties(input);
    assert.deepEqual(result, expected);
  });

  it('should correctly order properties for browsers', () => {
    const input = {
      browsers: {
        firefox: {
          releases: [
            { version: '1.5', release_date: '2008-11-14' },
            { version: '1', release_date: '2008-09-02' },
          ],
        },
      },
    };

    const expected =
      '{\n  "browsers": {\n    "firefox": {\n      "releases": [\n        {\n          "version": "1",\n          "release_date": "2008-09-02"\n        },\n        {\n          "version": "1.5",\n          "release_date": "2008-11-14"\n        }\n      ]\n    }\n  }\n}';

    const result = stringifyAndOrderProperties(input);
    assert.deepEqual(result, expected);
  });
});
