/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import yargs from 'yargs';

import { TagsAddCommand } from './add-tag.js';
import { TagsRemoveCommand } from './remove-tag.js';
import { TagsShowCommand } from './show-tag.js';

/**
 * handler - Action to perform for 'tags XYZ' command
 * @param argv Parameter list
 */
export const executeTagCommand = (argv) => {
  yargs(argv.splice(1))
    .option('p', {
      alias: 'path',
      demandOption: false,
      default: './',
      describe: 'Path to the JSON files',
      type: 'string',
    })
    .command({
      command: 'add tag [bcd-id..]',
      /**
       * handler - Action to perform for 'tags add <tag> <bcd-ids>'
       * @param argv Parameter list
       */
      handler: (argv) => {
        const cmd = new TagsAddCommand(argv['path']);
        cmd.addTag(argv['tag'], argv['bcd-id']);
      },
    })
    .command({
      command: 'remove tag [bcd-id..]',
      /**
       * handler - Action to perform for 'tags remove <tag> <bcd-ids>'
       * @param argv Parameter list
       */
      handler: (argv) => {
        const cmd = new TagsRemoveCommand(argv['path']);
        cmd.removeTag(argv['tag'], argv['bcd-id']);
      },
    })
    .command({
      command: 'show [bcd-id..]',
      /**
       * handler - Action to perform for 'tags show <bcd-ids>'
       * @param argv Parameter list
       */
      handler: (argv) => {
        const cmd = new TagsShowCommand(argv['path']);
        cmd.showTag(argv['bcd-id']);
      },
    })
    .demandCommand()
    .help()
    .parse();
};
