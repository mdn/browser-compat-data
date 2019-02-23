'use strict';

const path = require('path');
const compareVersions = require('compare-versions');

/**
 * Version is Bool check.
 * 
 * This checker aims at improving data quality
 * by detecting inconsistent information.
 */
 class VersionBoolChecker
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

    // Add errors
    Object.keys(data['__compat']['support']).forEach(browser => {
      if (browser == "firefox" && data['__compat']['support'][browser]['version_added'] === true) {
        const errortype = 'version_added_true';
        errors.push({errortype, browser});
      }
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

function testVersionBool(filename) {
  let data = require(filename);

  const checker = new VersionBoolChecker();
  const errors = checker.check(data);
  
  if (errors.length) {
    const relativeFilename = path.relative(process.cwd(), filename);
    console.error(`\x1b[34m  Found \x1b[1m${errors.length}\x1b[0m\x1b[34m inconsistent feature(s) in \x1b[3m${relativeFilename}:\x1b[0m`);
    errors.forEach(({ feature, path, errors }) =>  {
      console.error(`\x1b[34m  → \x1b[1m${errors.length}\x1b[0m\x1b[34m × \x1b[1m${feature}\x1b[0m\x1b[34m [\x1b[3m${path.join('.')}\x1b[0m\x1b[34m]: `);
      errors.forEach(({ errortype, browser }) => {
        console.error(`\x1b[34m    → version_added for \x1b[1m${browser}\x1b[0m\x1b[34m was declared as \x1b[1mtrue\x1b[0m`);
      });
    })
    return true;
  } else {
    console.log('\x1b[32m  Version is Bool – OK \x1b[0m');
    return false;
  }
}

module.exports.testVersionBool = testVersionBool;
