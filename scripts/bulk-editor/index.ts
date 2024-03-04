/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */
import chalk from 'chalk-template';

import { executeTagCommand } from './tag-command-factory.js';

const commandName = process.argv[3];

const argv = process.argv.slice(3);

switch (commandName) {
  case 'tags':
    executeTagCommand(argv);
    break;
  default:
    console.log(chalk`{red Unknown command ${commandName}}`);
}
