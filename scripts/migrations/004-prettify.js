/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const { exec } = require('child_process');

exec('npx prettier --write **/*.js **/*.ts');
