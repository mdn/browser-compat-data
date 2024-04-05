/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import { TagsCommand } from './utils.js';

/** Class representing the 'tags add' comnmand. */
export class TagsAddCommand extends TagsCommand {
  /**
   * addTag - Add an extra tag to a set of bcd IDs
   * @param tag The tag to add
   * @param bcdIDs An array of strings with dot-separated bcd IDs
   */
  addTag(tag: string, bcdIDs: string[]): void {
    const allJSONs = this.readJSONFiles(bcdIDs);

    // Add the tag to each bcd ID
    console.log(chalk`{white \nAdd tags}`);
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
      if (!result['tags']) {
        result['tags'] = [];
      }

      // Add the tag
      if (!result['tags'].includes(tag)) {
        result['tags'].push(tag);
      }
    }

    this.writeJSONFiles(bcdIDs, allJSONs);
  }
}
