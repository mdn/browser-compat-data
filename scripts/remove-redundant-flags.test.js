#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { platform } = require('os');

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
];

const testFixRedundantFlags = (logger = console) => {
  let hasErrors = false;
  for (let i = 0; i < tests.length; i++) {
    let expected = JSON.stringify(tests[i]['output'], null, 2);
    let output = JSON.stringify(
      JSON.parse(JSON.stringify(tests[i]['input']), removeRedundantFlags),
      null,
      2,
    );

    if (output !== expected) {
      logger.error(chalk`{red Redundant flags aren't removed properly!}
      {yellow Actual: {bold ${output}}}
      {green Expected: {bold ${expected}}}`);
      hasErrors = true;
    }
  }

  return hasErrors;
};

if (require.main === module) {
  testFixRedundantFlags();
}

module.exports = testFixRedundantFlags;
