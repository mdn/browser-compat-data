import yargs from 'yargs';

import { TagsAddCommand } from  './add-tag.js';

/**
 * handler - Action to perform for 'tags XYZ' command
 * @param argv Parameter list
 */
export const executeTagCommand = (argv) => {
  yargs(argv.splice(1))
  .command({
    command: 'add tag [bcd-id..]',
    /**
     * handler - Action to perform for 'tags add <tag> <bcd-ids>'
     * @param argv Parameter list
     */
    handler: (argv) => {

      const cmd = new TagsAddCommand(argv['path']);
      cmd.addTag(argv['tag'], argv['bcd-id']);
    }
  })
  .demandCommand()
  .help()
  .parse()
}
