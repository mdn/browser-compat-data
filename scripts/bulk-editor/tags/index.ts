/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import addCommand from './add.js';
import removeCommand from './remove.js';

const command = {
  command: 'tags',
  description: 'Modify tags',
  // Yargs requires a handler method present, regardless if it does anything
  // eslint-disable-next-line @typescript-eslint/no-empty-function,jsdoc/require-jsdoc
  handler: () => {},
  // eslint-disable-next-line jsdoc/require-jsdoc
  builder: (yargs) =>
    yargs.command([addCommand, removeCommand]).demandCommand().help(),
};

export default command;
