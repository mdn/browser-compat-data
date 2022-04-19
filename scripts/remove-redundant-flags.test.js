#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const fs = require('fs');
const path = require('path');
const { platform } = require('os');
const assert = require('assert');

const { removeRedundantFlags } = require('./remove-redundant-flags.js');

const tests = [
  {
    input: {
      test1: {
        __compat: {
          support: {
            chrome: [
              {
                version_added: '70',
              },
              {
                version_added: '21',
                version_removed: '65',
                flags: [
                  {
                    type: 'preference',
                    name: '#service-worker-payment-apps',
                    value_to_set: 'Enabled',
                  },
                ],
              },
            ],
          },
          status: {
            experimental: true,
            standard_track: false,
            deprecated: false,
          },
        },
      },
    },
    output: {
      test1: {
        __compat: {
          support: {
            chrome: {
              version_added: '70',
            },
          },
          status: {
            experimental: true,
            standard_track: false,
            deprecated: false,
          },
        },
      },
    },
  },
  {
    input: {
      test2: {
        __compat: {
          support: {
            chrome: [
              {
                version_added: '62',
              },
              {
                version_added: '21',
                version_removed: '80',
                flags: [
                  {
                    type: 'preference',
                    name: '#service-worker-payment-apps',
                    value_to_set: 'Enabled',
                  },
                ],
              },
            ],
          },
          status: {
            experimental: true,
            standard_track: false,
            deprecated: false,
          },
        },
      },
    },
    output: {
      test2: {
        __compat: {
          support: {
            chrome: {
              version_added: '62',
            },
          },
          status: {
            experimental: true,
            standard_track: false,
            deprecated: false,
          },
        },
      },
    },
  },
  {
    input: {
      test3: {
        __compat: {
          support: {
            chrome: [
              {
                version_added: '62',
              },
              {
                version_added: '21',
                flags: [
                  {
                    type: 'preference',
                    name: '#service-worker-payment-apps',
                    value_to_set: 'Enabled',
                  },
                ],
              },
            ],
          },
          status: {
            experimental: true,
            standard_track: false,
            deprecated: false,
          },
        },
      },
    },
    output: {
      test3: {
        __compat: {
          support: {
            chrome: {
              version_added: '62',
            },
          },
          status: {
            experimental: true,
            standard_track: false,
            deprecated: false,
          },
        },
      },
    },
  },
  {
    input: {
      test4: {
        __compat: {
          support: {
            chrome: [
              {
                version_added: '42',
                flags: [
                  {
                    type: 'preference',
                    name: '#enable-experimental-web-features',
                    value_to_set: 'Enabled',
                  },
                ],
              },
              {
                version_added: '21',
                version_removed: '45',
                flags: [
                  {
                    type: 'preference',
                    name: '#service-worker-payment-apps',
                    value_to_set: 'Enabled',
                  },
                ],
              },
            ],
          },
          status: {
            experimental: true,
            standard_track: false,
            deprecated: false,
          },
        },
      },
    },
    output: {
      test4: {
        __compat: {
          support: {
            chrome: {
              version_added: '42',
              flags: [
                {
                  type: 'preference',
                  name: '#enable-experimental-web-features',
                  value_to_set: 'Enabled',
                },
              ],
            },
          },
          status: {
            experimental: true,
            standard_track: false,
            deprecated: false,
          },
        },
      },
    },
  },
  {
    input: {
      test5: {
        __compat: {
          support: {
            chrome: {
              version_added: '42',
              version_removed: '43',
              flags: [
                {
                  type: 'preference',
                  name: '#enable-experimental-web-features',
                  value_to_set: 'Enabled',
                },
              ],
            },
          },
          status: {
            experimental: true,
            standard_track: false,
            deprecated: false,
          },
        },
      },
    },
    output: {
      test5: {
        __compat: {
          support: {
            chrome: {
              version_added: false,
            },
          },
          status: {
            experimental: true,
            standard_track: false,
            deprecated: false,
          },
        },
      },
    },
  },
  {
    input: {
      test6: {
        __compat: {
          support: {
            chrome: [
              {
                version_added: '80',
              },
              {
                version_added: '21',
                version_removed: '80',
                flags: [
                  {
                    type: 'preference',
                    name: '#service-worker-payment-apps',
                    value_to_set: 'Enabled',
                  },
                ],
              },
            ],
          },
          status: {
            experimental: true,
            standard_track: false,
            deprecated: false,
          },
        },
      },
    },
    output: {
      test6: {
        __compat: {
          support: {
            chrome: [
              {
                version_added: '80',
              },
              {
                version_added: '21',
                version_removed: '80',
                flags: [
                  {
                    type: 'preference',
                    name: '#service-worker-payment-apps',
                    value_to_set: 'Enabled',
                  },
                ],
              },
            ],
          },
          status: {
            experimental: true,
            standard_track: false,
            deprecated: false,
          },
        },
      },
    },
  },
  {
    input: {
      test7: {
        __compat: {
          support: {
            edge: [
              {
                version_added: '79',
                flags: [
                  {
                    type: 'preference',
                    name: 'enable-experimental-web-platform-features',
                    value_to_set: 'enabled',
                  },
                ],
              },
              {
                version_added: '12',
                version_removed: '79',
              },
            ],
          },
          status: {
            experimental: true,
            standard_track: false,
            deprecated: false,
          },
        },
      },
    },
    output: {
      test7: {
        __compat: {
          support: {
            edge: [
              {
                version_added: '79',
                flags: [
                  {
                    type: 'preference',
                    name: 'enable-experimental-web-platform-features',
                    value_to_set: 'enabled',
                  },
                ],
              },
              {
                version_added: '12',
                version_removed: '79',
              },
            ],
          },
          status: {
            experimental: true,
            standard_track: false,
            deprecated: false,
          },
        },
      },
    },
  },
  {
    input: {
      test8: {
        __compat: {
          support: {
            chrome: [
              {
                version_added: '86',
              },
              {
                version_added: '21',
                flags: [
                  {
                    type: 'preference',
                    name: '#service-worker-payment-apps',
                    value_to_set: 'Enabled',
                  },
                ],
              },
            ],
          },
          status: {
            experimental: true,
            standard_track: false,
            deprecated: false,
          },
        },
      },
    },
    output: {
      test8: {
        __compat: {
          support: {
            chrome: [
              {
                version_added: '86',
              },
              {
                version_added: '21',
                flags: [
                  {
                    type: 'preference',
                    name: '#service-worker-payment-apps',
                    value_to_set: 'Enabled',
                  },
                ],
              },
            ],
          },
          status: {
            experimental: true,
            standard_track: false,
            deprecated: false,
          },
        },
      },
    },
  },
];

describe('remove-redundant-flags', () => {
  let i = 1;
  for (const test of tests) {
    it(`Test #${i}`, () => {
      let expected = JSON.stringify(test['output'], null, 2);
      let output = JSON.stringify(
        JSON.parse(JSON.stringify(test['input']), removeRedundantFlags),
        null,
        2,
      );

      assert.deepStrictEqual(expected, output);
    });

    i += 1;
  }
});
