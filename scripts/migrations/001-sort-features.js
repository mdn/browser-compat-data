/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { exec } from 'node:child_process';

exec('node scripts/fix/feature-order.js');
