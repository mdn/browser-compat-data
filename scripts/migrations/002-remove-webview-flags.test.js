#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const chalk = require('chalk');

const { removeWebViewFlags } = require('./002-remove-webview-flags.js');

const tests = [
  {
    input: {
      test1: {
        __compat: {
          support: {
            webview_android: {
              version_added: '61',
              flags: [
                {
                  type: 'preference',
                  name: '#service-worker-payment-apps',
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
      test1: {
        __compat: {
          support: {
            webview_android: {
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
      test2: {
        __compat: {
          support: {
            webview_android: {
              version_added: true,
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
      test2: {
        __compat: {
          support: {
            webview_android: {
              version_added: true,
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
            webview_android: [
              {
                version_added: '40',
                flags: [
                  {
                    type: 'preference',
                    name: '#service-worker-payment-apps',
                    value_to_set: 'Enabled',
                  },
                ],
              },
              {
                version_added: '56',
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
            webview_android: {
              version_added: '56',
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
];

describe('migration scripts', () => {
  it('`removeWebViewFlags()` works correctly', () => {
  let hasErrors = false;
  for (let i = 0; i < tests.length; i++) {
    let expected = JSON.stringify(tests[i]['output'], null, 2);
    let output = JSON.stringify(
      JSON.parse(JSON.stringify(tests[i]['input']), removeWebViewFlags),
      null,
      2,
    );

    if (output !== expected) {
      console.error(chalk`{red WebView flags aren't removed properly!}
      {yellow Actual: {bold ${output}}}
      {green Expected: {bold ${expected}}}`);
      hasErrors = true;
    }
  }

  return hasErrors;
})});
