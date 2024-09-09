/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { updateFeatures } from '../utils.js';

const command = {
  command: 'add <tag> <bcd-id..>',
  desc: 'Add the following tag to the BCD features',
  /**
   * handler - Action to perform for 'tags add'
   * @param argv Parameter list
   */
  handler: (argv) => {
    updateFeatures(argv['bcd-id'], (json) => {
      // If there is no tags entry, create one
      if (!json['tags']) {
        json['tags'] = [];
      }

      // Add the tag
      if (!json['tags'].includes(argv['tag'])) {
        json['tags'].push(argv['tag']);
      }

      return json;
    });
  },
};

export default command;
