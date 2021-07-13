/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const assert = require('assert').strict;

const { fixExperimental } = require('./007-experimental-false.js');

describe('fixExperimental()', () => {
  it('chrome + firefox + safari', () => {
    const bcd = {
      api: {
        fetch: {
          __compat: {
            support: {
              chrome: {
                version_added: '100',
              },
              firefox: {
                version_added: '100',
              },
              safari: {
                version_added: '15',
              },
            },
            status: {
              experimental: true,
              standard_track: true,
              deprecated: false,
            },
          },
        },
      },
    };
    assert.equal(bcd.api.fetch.__compat.status.experimental, true);
    fixExperimental(bcd);
    assert.equal(bcd.api.fetch.__compat.status.experimental, false);
  });

  it('just chrome + firefox', () => {
    const bcd = {
      api: {
        fetch: {
          __compat: {
            support: {
              chrome: {
                version_added: '100',
              },
              firefox: {
                version_added: '100',
              },
              safari: {
                version_added: false,
              },
            },
            status: {
              experimental: true,
              standard_track: true,
              deprecated: false,
            },
          },
        },
      },
    };
    assert.equal(bcd.api.fetch.__compat.status.experimental, true);
    fixExperimental(bcd);
    assert.equal(bcd.api.fetch.__compat.status.experimental, true);
  });
});
