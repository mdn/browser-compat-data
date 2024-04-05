/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import yargs from 'yargs';

import addCommand from './add.js';
import removeCommand from './remove.js';

const command = {
  command: 'tags',
  description: 'Modify tags',
  handler: (argv) => {},
  builder: (yargs) =>
    yargs.command([addCommand, removeCommand]).demandCommand().help(),
};

export default command;
