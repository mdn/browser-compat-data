/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import compareVersions from 'compare-versions';
import chalk from 'chalk-template';
import { query } from '../../utils/index.js';
import mirrorSupport from '../../scripts/release/mirror.js';

/**
 * @typedef {import('../../types').CompatStatement} CompatStatement
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../../types').IdentifierMeta} IdentifierMeta
 * @typedef {import('../../types').PrimaryIdentifier} PrimaryIdentifier
 * @typedef {import('../../types').SimpleSupportStatement} SimpleSupportStatement
 * @typedef {import('../../types').SupportStatement} SupportStatement
 * @typedef {import('../../types').VersionValue} VersionValue
 *
 * @typedef {'unsupported' | 'support_unknown' | 'subfeature_earlier_implementation'} ErrorType
 *
 * @typedef {object} ConsistencyError
 * @property {string} feature The identifier of the feature
 * @property {string[]} path The path of the feature
 * @property {FeatureError[]} errors Any errors found
 *
 * @typedef {object} FeatureError
 * @property {ErrorType} errortype The type of the error
 * @property {string} browser The browser the error was found
 * @property {VersionValue} parent_value The value of the parent feature
 * @property {[string, VersionValue][]} subfeatures The versions of the subfeatures
 */

/**
 * Consistency check.
 *
 * This checker aims at improving data quality
 * by detecting inconsistent information.
 */
export class ConsistencyChecker {
  /**
   * Checks the data for any errors
   *
   * @param {Identifier} data The data to test
   * @returns {ConsistencyError[]} Any errors found within the data
   */
  check(data) {
    return this.checkSubfeatures({ ...data, browsers: undefined });
  }

  /**
   * Recursively checks the data for any errors
   *
   * @param {Identifier} data The data to test
   * @param {string[]} [path] The path of the data
   * @returns {ConsistencyError[]} Any errors found within the data
   */
  checkSubfeatures(data, path = []) {
    /** @type {ConsistencyError[]} */
    let allErrors = [];

    // Check this feature.
    if (this.isFeature(data)) {
      const errors = this.checkFeature(data);

      if (errors.length) {
        allErrors.push({
          path,
          errors,
        });
      }
    }

    // Check sub-features.
    this.getSubfeatures(data).forEach((key) => {
      allErrors = [
        ...allErrors,
        ...this.checkSubfeatures(query(key, data), [
          ...path,
          ...key.split('.'),
        ]),
      ];
    });

    return allErrors;
  }

  /**
   * @param {PrimaryIdentifier & Required<IdentifierMeta>} data
   * @return {Identifier[]}
   */
  getSubfeatures(data) {
    const subfeatures = [];
    const keys = Object.keys(data).filter((key) => key != '__compat');
    for (const key of keys) {
      if (data[key] === undefined) continue;

      if ('__compat' in data[key]) {
        // If the subfeature has compat data
        subfeatures.push(key);
      } else {
        // If no compat data, get the next level down
        subfeatures.push(
          ...this.getSubfeatures(data[key]).map((x) => `${key}.${x}`),
        );
      }
    }

    return subfeatures;
  }

  /**
   * Checks a specific feature for errors
   *
   * @param {Identifier} data The data to test
   * @returns {FeatureError[]} Any errors found within the data
   */
  checkFeature(data) {
    /** @type {FeatureError[]} */
    let errors = [];

    const subfeatures = this.getSubfeatures(data);

    // Test whether sub-features are supported when basic support is not implemented
    // For all unsupported browsers (basic support == false), sub-features should be set to false
    const unsupportedInParent = this.extractUnsupportedBrowsers(data.__compat);
    /** @type {Partial<Record<string, [string, VersionValue][]>>} */
    var inconsistentSubfeaturesByBrowser = {};

    subfeatures.forEach((subfeature) => {
      const unsupportedInChild = this.extractUnsupportedBrowsers(
        query(subfeature, data).__compat,
      );

      const browsers = unsupportedInParent.filter(
        (x) => !unsupportedInChild.includes(x),
      );

      browsers.forEach((browser) => {
        inconsistentSubfeaturesByBrowser[browser] =
          inconsistentSubfeaturesByBrowser[browser] || [];
        const subfeature_value = this.getVersionAdded(
          query(subfeature, data).__compat.support,
          browser,
        );
        inconsistentSubfeaturesByBrowser[browser].push([
          subfeature,
          subfeature_value,
        ]);
      });
    });

    // Add errors
    Object.keys(inconsistentSubfeaturesByBrowser).forEach((browser) => {
      const subfeatures = inconsistentSubfeaturesByBrowser[browser];
      const errortype = 'unsupported';
      const parent_value = this.getVersionAdded(data.__compat.support, browser);

      errors.push({
        errortype,
        browser,
        parent_value,
        subfeatures,
      });
    });

    // Test whether sub-features are supported when basic support is not implemented
    // For all unsupported browsers (basic support == false), sub-features should be set to false
    const supportUnknownInParent = this.extractSupportUnknownBrowsers(
      data.__compat,
    );
    inconsistentSubfeaturesByBrowser = {};

    subfeatures.forEach((subfeature) => {
      const supportUnknownInChild = this.extractSupportNotTrueBrowsers(
        query(subfeature, data).__compat,
      );

      const browsers = supportUnknownInParent.filter(
        (x) => !supportUnknownInChild.includes(x),
      );

      browsers.forEach((browser) => {
        inconsistentSubfeaturesByBrowser[browser] =
          inconsistentSubfeaturesByBrowser[browser] || [];
        const subfeature_value = this.getVersionAdded(
          query(subfeature, data).__compat.support,
          browser,
        );
        inconsistentSubfeaturesByBrowser[browser].push([
          subfeature,
          subfeature_value,
        ]);
      });
    });

    // Add errors
    Object.keys(inconsistentSubfeaturesByBrowser).forEach((browser) => {
      const subfeatures = inconsistentSubfeaturesByBrowser[browser];
      const errortype = 'support_unknown';
      const parent_value = this.getVersionAdded(data.__compat.support, browser);

      errors.push({
        errortype,
        browser,
        parent_value,
        subfeatures,
      });
    });

    // Test whether sub-features are supported at an earlier version than basic support
    const supportInParent = this.extractSupportedBrowsersWithVersion(
      data.__compat,
    );
    inconsistentSubfeaturesByBrowser = {};

    subfeatures.forEach((subfeature) => {
      supportInParent.forEach((browser) => {
        if (
          query(subfeature, data).__compat.support[browser] != undefined &&
          this.isVersionAddedGreater(
            query(subfeature, data).__compat.support,
            data.__compat.support,
            browser,
          )
        ) {
          inconsistentSubfeaturesByBrowser[browser] =
            inconsistentSubfeaturesByBrowser[browser] || [];
          const subfeature_value = this.getVersionAdded(
            query(subfeature, data).__compat.support,
            browser,
          );
          inconsistentSubfeaturesByBrowser[browser].push([
            subfeature,
            subfeature_value,
          ]);
        }
      });
    });

    // Add errors
    Object.keys(inconsistentSubfeaturesByBrowser).forEach((browser) => {
      const subfeatures = inconsistentSubfeaturesByBrowser[browser];
      const errortype = 'subfeature_earlier_implementation';
      const parent_value = this.getVersionAdded(data.__compat.support, browser);

      errors.push({
        errortype,
        browser,
        parent_value,
        subfeatures,
      });
    });

    return errors;
  }

  /**
   * Checks if the data is a feature
   *
   * @param {Identifier} data The data to test
   * @returns {boolean} If the data is a feature statement
   */
  isFeature(data) {
    return '__compat' in data;
  }

  /**
   * Get all of the unsupported browsers in a feature
   *
   * @param {CompatStatement} compatData The compat data to process
   * @returns {string[]} The list of browsers marked as unsupported
   */
  extractUnsupportedBrowsers(compatData) {
    return this.extractBrowsers(
      compatData,
      (data) =>
        data.version_added === false ||
        (typeof data.version_removed !== 'undefined' &&
          data.version_removed !== false),
    );
  }

  /**
   * Get all of the browsers with unknown support in a feature
   *
   * @param {CompatStatement} compatData The compat data to process
   * @returns {string[]} The list of browsers with unknown support
   */
  extractSupportUnknownBrowsers(compatData) {
    return this.extractBrowsers(
      compatData,
      (data) => data.version_added === null,
    );
  }

  /**
   * Get all of the browsers with either unknown or no support in a feature
   *
   * @param {CompatStatement} compatData The compat data to process
   * @returns {string[]} The list of browsers with non-truthy (false or null) support
   */
  extractSupportNotTrueBrowsers(compatData) {
    return this.extractBrowsers(
      compatData,
      (data) =>
        data.version_added === false ||
        data.version_added === null ||
        (typeof data.version_removed !== 'undefined' &&
          data.version_removed !== false),
    );
  }
  /**
   * Get all of the browsers with a version number in a feature.
   *
   * @param {CompatStatement} compatData The compat data to process
   * @returns {string[]} The list of browsers with an exact version number
   */
  extractSupportedBrowsersWithVersion(compatData) {
    return this.extractBrowsers(
      compatData,
      (data) => typeof data.version_added === 'string',
    );
  }

  /**
   * Return the earliest recorded version number from a support statement or null.
   *
   * @param {SupportBlock} supportBlock The compat data to process
   * @param {BrowserName} browser The browser to get data for
   * @returns {?string} The earliest version added in the data
   */
  getVersionAdded(supportBlock, browser) {
    const supportStatement = supportBlock[browser];

    if (supportStatement === 'mirror') {
      return this.getVersionAdded(
        { [browser]: mirrorSupport(browser, supportBlock) },
        browser,
      );
    }

    // A convenience function to squash non-real values and previews into null
    const resolveVersionAddedValue = (statement) =>
      [true, false, 'preview', null].includes(statement?.version_added) ||
      statement.flags
        ? null
        : statement?.version_added;

    // Handle simple support statements
    if (!Array.isArray(supportStatement)) {
      return resolveVersionAddedValue(supportStatement);
    }

    // Handle array support statements
    let selectedValue = null;
    for (const statement of supportStatement) {
      const resolvedValue = resolveVersionAddedValue(statement);

      if (resolvedValue === null) {
        // We're not going to get a more specific version, so bail out now
        continue;
      }

      if (selectedValue !== null) {
        // Earlier value takes precedence
        const resolvedIsEarlier = compareVersions.compare(
          resolvedValue.replace('≤', ''),
          selectedValue.replace('≤', ''),
          '<',
        );
        if (resolvedIsEarlier) {
          selectedValue = resolvedValue;
        }
      } else {
        selectedValue = resolvedValue;
      }
    }
    return selectedValue;
  }

  /**
   * Compare two versions and determine if a's version is greater (later) than b's version
   *
   * @param {SupportBlock} a The first support block to compare
   * @param {SupportBlock} b The second support block to compare
   * @param {BrowserName} browser The browser to compare
   * @returns {boolean} If a's version is greater (later) than b's version
   */
  isVersionAddedGreater(a, b, browser) {
    var a_version_added = this.getVersionAdded(a, browser);
    var b_version_added = this.getVersionAdded(b, browser);

    if (
      typeof a_version_added === 'string' &&
      typeof b_version_added === 'string'
    ) {
      if (b_version_added.startsWith('≤')) {
        return false;
      }
      if (a_version_added === 'preview' && b_version_added === 'preview') {
        return false;
      }
      if (b_version_added === 'preview') {
        return true;
      }
      if (a_version_added === 'preview') {
        return false;
      }
      return compareVersions.compare(
        a_version_added.replace('≤', ''),
        b_version_added,
        a_version_added.startsWith('≤') ? '<=' : '<',
      );
    }

    return false;
  }

  /**
   * Get all of the browsers within the data and pass the data to the callback.
   *
   * @param {CompatStatement} compatData The compat data to process
   * @param {(browserData: SimpleSupportStatement) => boolean} callback The function to pass the data to
   * @returns {boolean} The result of the invoked callback, or "false"
   */
  extractBrowsers(compatData, callback) {
    return Object.keys(compatData.support).filter((browser) => {
      let browserData = compatData.support[browser];
      if (browserData === 'mirror') {
        browserData = mirrorSupport(browser, compatData.support);
      }

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

export default {
  name: 'Consistency',
  description: 'Test the version consistency between parent and child',
  scope: 'tree',
  check(logger, { data }) {
    const checker = new ConsistencyChecker();
    const allErrors = checker.check(data);

    for (const { path, errors } of allErrors) {
      for (const { errortype, browser, parent_value, subfeatures } of errors) {
        let errorMessage = '';
        if (errortype == 'unsupported') {
          errorMessage += chalk`No support in {bold ${browser}}, but support is declared in the following sub-feature(s):`;
        } else if (errortype == 'support_unknown') {
          errorMessage += chalk`Unknown support in parent for {bold ${browser}}, but support is declared in the following sub-feature(s):`;
        } else if (errortype == 'subfeature_earlier_implementation') {
          errorMessage += chalk`Basic support in {bold ${browser}} was declared implemented in a later version ({bold ${parent_value}}) than the following sub-feature(s):`;
        }

        for (const subfeature of subfeatures) {
          errorMessage += chalk`\n{red         → {bold ${path.join('.')}.${
            subfeature[0]
          }}: ${subfeature[1] === undefined ? '[Array]' : subfeature[1]}}`;
        }

        logger.error(errorMessage, { path: path.join('.') });
      }
    }
  },
};
