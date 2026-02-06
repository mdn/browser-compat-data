/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {CompatStatement} from '../../types/types.js' */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { fixExperimental } from './007-experimental-false.js';

describe('fixExperimental()', () => {
  it('chrome + firefox + safari', () => {
    /** @type {*} */
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
    /** @type {*} */
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
    assert.equal(bcd.api.fetch.__compat.status.experimental, false);
  });

  it('just chrome', () => {
    /** @type {*} */
    const bcd = {
      api: {
        fetch: {
          __compat: {
            support: {
              chrome: {
                version_added: '100',
              },
              firefox: {
                version_added: false,
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

  it('mobile chrome + safari', () => {
    /** @type {*} */
    const bcd = {
      api: {
        fetch: {
          __compat: {
            support: {
              chrome: {
                version_added: false,
              },
              chrome_android: {
                version_added: '100',
              },
              firefox: {
                version_added: false,
              },
              safari: {
                version_added: false,
              },
              safari_ios: {
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
});
