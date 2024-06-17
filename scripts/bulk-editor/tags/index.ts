/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import addCommand from './add.js';
import removeCommand from './remove.js';

const command = {
  command: 'tags',
  description: 'Modify tags',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handler: () => {},
  builder: (yargs) =>
    yargs.command([addCommand, removeCommand]).demandCommand().help(),
};

export default command;
