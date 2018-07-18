'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Consistency check.
 * 
 * This fixer aims at improving data quality
 * by repairing inconsistent information.
 */
 class ConsistencyFixer
 {
  /**
   * @param {object} data
   * @returns {object}
   */
  fix(data) {
    const clone = JSON.parse(JSON.stringify(data));
    return this.fixSubfeatures(clone);
  }

  /**
   * @param {object} data
   * @returns {object}
   */
  fixSubfeatures(data) {
    if (typeof data !== 'object') {
      return data;
    }

    // Fix this feature.
    if (this.isFeature(data)) {
      data = this.fixFeature(data);
    }
  
    // Fix sub-features.
    const keys = Object.keys(data);
    for (let key of keys) {
      if (key != '__compat') {
        data[key] = this.fixSubfeatures(data[key]);
      }
    }
  
    return data;
  }

  /**
   * @param {object} data
   * @returns {object}
   */
  fixFeature(data) {
    const unsupportedInParent = this.extractUnsupportedBrowsers(data.__compat);

    // For all unsupported browsers, sub-features should be set to false.
    const subfeatures = Object.keys(data).filter(key => this.isFeature(data[key]));
    const inconsistentSubfeaturesByBrowser = {};

    for (let subfeature of subfeatures) {
      const unsupportedInChild = this.extractUnsupportedBrowsers(data[subfeature].__compat);

      const browsers = unsupportedInParent.filter(x => !unsupportedInChild.includes(x));

      const support = data[subfeature].__compat.support;
      for (let browser of browsers) {
        if (typeof support[browser] === null) {
          support[browser].version_added = false;
        }
      };
    }

    return data;
  }

  /**
   * @param {object} data
   * @returns {boolean}
   */
  isFeature(data) {
    return typeof(data) === 'object' && '__compat' in data;
  }

  /**
   * @param {object} compatData
   * @returns {Array<string>}
   */
  extractUnsupportedBrowsers(compatData) {
    return this.extractBrowsers(compatData, data => data.version_added === false || typeof data.version_removed !== 'undefined' && data.version_removed !== false);
  }
  
  /**
   * 
   * @param {object} compatData
   * @param {callback} callback
   * @returns {boolean}
   */
  extractBrowsers(compatData, callback)
  {
    return Object.keys(compatData.support).filter(browser => {
      const browserData = compatData.support[browser];
  
      if (Array.isArray(browserData)) {
        return browserData.every(callback);
      } else if (typeof browserData === 'object') {
        return callback(browserData);
      } else {
        return false;
      }
    });
  }
 }

 /**
  * @param {Promise<void>} filename 
  */
function fixConsistency(filename) {
  const originalData = require(filename);

  const fixer = new ConsistencyFixer();
  const fixedData = fixer.fix(originalData);


  if (JSON.stringify(originalData) === JSON.stringify(fixedData)) {
    return;
  }

  console.log("Fixed consistency: " + path.relative(path.resolve(__dirname, '..'), filename));

  const json = JSON.stringify(fixedData, null, 2) + "\n";
  fs.writeFileSync(filename, json, 'utf8');
}

module.exports.fixConsistency = fixConsistency;
