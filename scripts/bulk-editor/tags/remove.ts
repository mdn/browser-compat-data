/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { updateFeatures } from '../utils.js';

const command = {
  command: 'remove <tag> <bcd-id..>',
  desc: 'Remove the following tag from the BCD features',
  /**
   * handler - Action to perform for 'tags remove'
   * @param argv Parameter list
   */
  handler: (argv) => {
    updateFeatures(argv['bcd-id'], (json) => {
      // If there is no tags entry, create one
      if (json['tags']) {
        const index = json['tags'].indexOf(argv['tag']);
        // Actually remove it if found
        if (index !== -1) {
          json['tags'].splice(index, 1);
        }

        // Remove the tags array if empty
        if (json['tags'].length === 0) {
          delete json.tags;
        }
      }

      return json;
    });
  },
};

export default command;
