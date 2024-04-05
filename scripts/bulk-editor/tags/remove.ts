/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import { TagsCommand } from './utils.js';

/** Class representing the 'tags remove' comnmand. */
export class TagsRemoveCommand extends TagsCommand {
  /**
   * removeTag - Add an extra tag to a set of bcd IDs
   * @param tag The tag to add
   * @param bcdIDs An array of strings with dot-separated bcd IDs
   */
  removeTag(tag: string, bcdIDs: string[]): void {
    const allJSONs = this.readJSONFiles(bcdIDs);

    // Remove the tag to each bcd ID
    console.log(chalk`{white \nRemove tags}`);
    for (const bcdID of bcdIDs) {
      console.log(chalk`{yellow Updating: ${bcdID}}`);
      // Find the bcd entry
      const values = bcdID.split('.');
      let result = allJSONs;
      for (const value of values) {
        result = result[value];
      }
      result = result['__compat'];

      // If there is no tags entry, create one
      if (result['tags']) {
        const index = result['tags'].indexOf(tag);
        // Actually remove it if found
        if (index !== -1) {
          result['tags'].splice(index, 1);
        }

        // Remove the tags array if empty
        if (result['tags'].length === 0) {
          delete result.tags;
        }
      }
    }

    this.writeJSONFiles(bcdIDs, allJSONs);
  }
}
