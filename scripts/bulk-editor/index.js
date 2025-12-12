/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import tags from './tags/index.js';

yargs(hideBin(process.argv)).command([tags]).demandCommand().help().parse();
