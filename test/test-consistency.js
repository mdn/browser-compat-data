'use strict';

const path = require('path');
const compareVersions = require('compare-versions');

/**
 * Consistency check.
 * 
 * This checker aims at improving data quality
 * by detecting inconsistent information.
 */
 class ConsistencyChecker
 {
  /**
   * @param {object} data
   * @returns {Array<object>}
   */
  check(data) {
    return this.checkSubfeatures(data);
  }

  /**
   * @param {object} data
   * @param {array} path
   * @returns {Array<object>}
   */
  checkSubfeatures(data, path = []) {
    let allErrors = [];
  
    // Check this feature.
    if (this.isFeature(data)) {
      const feature = path.length ? path[path.length - 1] : 'ROOT';
      const featurePath = path.length ? path.slice(0, path.length - 1).join('.') : '';

      const errors = this.checkFeature(data);

      if (errors.length) {
        allErrors.push({
          feature,
          path,
          errors
        });
      }
    }
  
    // Check sub-features.
    const keys = Object.keys(data).filter(key => key != '__compat');
    keys.forEach(key => {
      allErrors = [
        ...allErrors,
        ...this.checkSubfeatures(data[key], [...path, key])
      ];
    });
  
    return allErrors;
  }

  /**
   * @param {object} data
   * @returns {Array<object>}
   */
  checkFeature(data) {
    let errors = [];

    const subfeatures = Object.keys(data).filter(key => this.isFeature(data[key]));

    // Test whether sub-features are supported when basic support is not implemented
    // For all unsupported browsers (basic support == false), sub-features should be set to false
    const unsupportedInParent = this.extractUnsupportedBrowsers(data.__compat);
    var inconsistentSubfeaturesByBrowser = {};

    subfeatures.forEach(subfeature => {
      const unsupportedInChild = this.extractUnsupportedBrowsers(data[subfeature].__compat);

      const browsers = unsupportedInParent.filter(x => !unsupportedInChild.includes(x));

      browsers.forEach(browser => {
        inconsistentSubfeaturesByBrowser[browser] = inconsistentSubfeaturesByBrowser[browser] || [];
        inconsistentSubfeaturesByBrowser[browser].push(subfeature);
      });
    });

    // Add errors
    Object.keys(inconsistentSubfeaturesByBrowser).forEach(browser => {
      const subfeatures = inconsistentSubfeaturesByBrowser[browser];
      const errortype = 'unsupported';

      errors.push({
        errortype,
        browser,
        subfeatures
      });
    });

    // Test whether sub-features are supported when basic support is not implemented
    // For all unsupported browsers (basic support == false), sub-features should be set to false
    const supportUnknownInParent = this.extractSupportUnknownBrowsers(data.__compat);
    var inconsistentSubfeaturesByBrowser = {};

    subfeatures.forEach(subfeature => {
      const supportUnknownInChild = this.extractSupportNotTrueBrowsers(data[subfeature].__compat);

      const browsers = supportUnknownInParent.filter(x => !supportUnknownInChild.includes(x));

      browsers.forEach(browser => {
        inconsistentSubfeaturesByBrowser[browser] = inconsistentSubfeaturesByBrowser[browser] || [];
        inconsistentSubfeaturesByBrowser[browser].push(subfeature);
      });
    });

    // Add errors
    Object.keys(inconsistentSubfeaturesByBrowser).forEach(browser => {
      const subfeatures = inconsistentSubfeaturesByBrowser[browser];
      const errortype = 'support_unknown';

      errors.push({
        errortype,
        browser,
        subfeatures
      });
    });

    // Test whether sub-features are supported at an earlier version than basic support
    const supportInParent = this.extractSupportedBrowsersWithVersion(data.__compat);
    inconsistentSubfeaturesByBrowser = {};

    subfeatures.forEach(subfeature => {
      supportInParent.forEach(browser => {
        if (data[subfeature].__compat.support[browser] != undefined && this.isVersionAddedGreater(data[subfeature].__compat.support[browser], data.__compat.support[browser])) {
          inconsistentSubfeaturesByBrowser[browser] = inconsistentSubfeaturesByBrowser[browser] || [];
          inconsistentSubfeaturesByBrowser[browser].push(subfeature);
        }
      });
    });

    // Add errors
    Object.keys(inconsistentSubfeaturesByBrowser).forEach(browser => {
      const subfeatures = inconsistentSubfeaturesByBrowser[browser];
      const errortype = 'subfeature_earlier_implementation';

      errors.push({
        errortype,
        browser,
        subfeatures
      });
    });

    return errors;
  }

  /**
   * @param {object} data
   * @returns {boolean}
   */
  isFeature(data) {
    return '__compat' in data;
  }

  /**
   * @param {object} compatData
   * @returns {Array<string>}
   */
  extractUnsupportedBrowsers(compatData) {
    return this.extractBrowsers(compatData, data => data.version_added === false || typeof data.version_removed !== 'undefined' && data.version_removed !== false);
  }

  /**
   * @param {object} compatData
   * @returns {Array<string>}
   */
  extractSupportUnknownBrowsers(compatData) {
    return this.extractBrowsers(compatData, data => data.version_added === null);
  }

  /**
   * @param {object} compatData
   * @returns {Array<string>}
   */
  extractSupportNotTrueBrowsers(compatData) {
    return this.extractBrowsers(compatData, data => (data.version_added === false || data.version_added === null) || typeof data.version_removed !== 'undefined' && data.version_removed !== false);
  }
  /**
   * @param {object} compatData
   * @returns {Array<string>}
   */
  extractSupportedBrowsersWithVersion(compatData) {
    return this.extractBrowsers(compatData, data => typeof(data.version_added) === 'string');
  }

  /*
   * @param {object} compatData
   * @returns {string}
   */
  getVersionAdded(compatData) {
    var version_added = null;

    if (typeof(compatData.version_added) === 'string')
      return compatData.version_added;
    
    if (compatData.constructor === Array) {
      for (var i = compatData.length - 1; i >= 0; i--) {
        var va = compatData[i].version_added;
        if (typeof(va) === 'string' && (version_added == null || compareVersions(version_added, va) == 1))
          version_added = va;
      }
    }

    return version_added;
  }

  /*
   * @param {string} a
   * @param {string} b
   * @returns {boolean}
   */
  isVersionAddedGreater(a, b) {
    var a_version_added = this.getVersionAdded(a);
    var b_version_added = this.getVersionAdded(b);

    if (typeof(a_version_added) === 'string' && typeof(b_version_added) === 'string')
      return compareVersions(a_version_added, b_version_added) == -1;
    return false;
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

function testConsistency(filename) {
  let data = require(filename);

  const checker = new ConsistencyChecker();
  const errors = checker.check(data);
  
  if (errors.length) {
    const relativeFilename = path.relative(process.cwd(), filename);
    console.error(`\x1b[34m  Found \x1b[1m${errors.length}\x1b[0m\x1b[34m inconsistent feature(s) in \x1b[3m${relativeFilename}:\x1b[0m`);
    errors.forEach(({ feature, path, errors }) =>  {
      console.error(`\x1b[34m  → \x1b[1m${errors.length}\x1b[0m\x1b[34m × \x1b[1m${feature}\x1b[0m\x1b[34m [\x1b[3m${path.join('.')}\x1b[0m\x1b[34m]: `);
      errors.forEach(({ errortype, browser, subfeatures }) => {
        if (errortype == "unsupported") {
          console.error(`\x1b[34m    → No support in \x1b[1m${browser}\x1b[0m\x1b[34m, but this is not declared for sub-feature(s): \x1b[1m${subfeatures.join(', ')}\x1b[0m`);
        } else if (errortype == "support_unknown") {
          console.error(`\x1b[34m    → No support known in \x1b[1m${browser}\x1b[0m\x1b[34m, but support declared in the following sub-feature(s): \x1b[1m${subfeatures.join(', ')}\x1b[0m`);
        } else if (errortype == "subfeature_earlier_implementation") {
          console.error(`\x1b[34m    → Basic support in \x1b[1m${browser}\x1b[0m\x1b[34m was declared implemented in a later version than the following sub-feature(s): \x1b[1m${subfeatures.join(', ')}\x1b[0m`);
        }
      });
    })
    return true;
  } else {
    console.log('\x1b[32m  Consistency – OK \x1b[0m');
    return false;
  }
}

module.exports.testConsistency = testConsistency;
