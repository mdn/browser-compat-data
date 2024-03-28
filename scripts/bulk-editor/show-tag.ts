/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import { TagsCommand } from './tag-command.js';

/** Class representing the 'tags remove' comnmand. */
export class TagsShowCommand extends TagsCommand {
  /**
   * removeTag - Add an extra tag to a set of bcd IDs
   * @param bcdIDs An array of strings with dot-separated bcd IDs
   */
  showTag(bcdIDs: string[]): void {
    const allJSONs = this.readJSONFiles(bcdIDs);

    // Show the tag to each bcd ID
    console.log(chalk`{white \nShow tags}`);
    for (const bcdID of bcdIDs) {
      console.log(chalk`{yellow Tags for: ${bcdID}}`);
      // Find the bcd entry
      const values = bcdID.split('.');
      let result = allJSONs;
      for (const value of values) {
        result = result[value];
        if (!result) {
          console.log(chalk`{red Entry not found for ${bcdID}}`);
          break;
        }
      }
      if (!result) {
        break;
      }
      result = result['__compat'];

      // List tags
      if (result['tags']) {
        for (const tag of result['tags']) {
          console.log(tag);
        }
      }
    }
  }
}
