/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { styleText } from 'node:util';

import { compare } from 'compare-versions';

import { query } from '../../utils/index.js';
import mirrorSupport from '../../scripts/build/mirror.js';
import bcd from '../../index.js';

/** @import {Linter, LinterData} from '../types.js' */
/** @import {Logger} from '../utils.js' */
/** @import {BrowserName, InternalCompatData, InternalCompatStatement, InternalIdentifier, InternalSimpleSupportStatement, InternalSupportBlock, InternalSupportStatement, VersionValue} from '../../types/index.js' */

/**
 * @typedef {'unsupported' | 'subfeature_earlier_implementation' | 'subfeature_outside_parent_range'} ErrorType
 */

/**
 * @typedef {object} ConsistencyError
 * @property {string[]} path
 * @property {FeatureError[]} errors
 */

/**
 * @typedef {object} FeatureError
 * @property {ErrorType} type
 * @property {BrowserName} browser
 * @property {VersionValue} parentValue
 * @property {[string, VersionValue][]} subfeatures
 */

/**
 * Consistency check.
 *
 * This checker aims at improving data quality
 * by detecting inconsistent information.
 */
export class ConsistencyChecker {
  /** @type {WeakMap<object, Map<string, InternalSupportStatement>>} */
  #mirrorCache = new WeakMap();

  /**
   * Resolve a mirror support statement with caching.
   * @param {BrowserName} browser The browser to resolve
   * @param {InternalSupportBlock} supportBlock The support block containing the mirror
   * @returns {InternalSupportStatement} The resolved support statement
   */
  #resolveMirror(browser, supportBlock) {
    let byBrowser = this.#mirrorCache.get(supportBlock);
    if (!byBrowser) {
      byBrowser = new Map();
      this.#mirrorCache.set(supportBlock, byBrowser);
    }
    let resolved = byBrowser.get(browser);
    if (resolved === undefined) {
      resolved = mirrorSupport(browser, supportBlock);
      byBrowser.set(browser, resolved);
    }
    return resolved;
  }

  /**
   * Checks the data for any errors
   * @param {InternalCompatData} data The data to test
   * @returns {ConsistencyError[]} Any errors found within the data
   */
  check(data) {
    const { browsers: _browsers, ...rest } = data;
    return this.checkSubfeatures(rest);
  }

  /**
   * Recursively checks the data for any errors
   * @param {InternalIdentifier} data The data to test
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
        ...this.checkSubfeatures(
          /** @type {InternalIdentifier} */ (query(key, data)),
          [...path, ...key.split('.')],
        ),
      ];
    });

    return allErrors;
  }

  /**
   * Get the subfeatures of an identifier
   * @param {InternalIdentifier} data The identifier
   * @returns {string[]} The subfeatures
   */
  getSubfeatures(data) {
    /** @type {string[]} */
    const subfeatures = [];
    const keys = Object.keys(data).filter((key) => key != '__compat');
    for (const key of keys) {
      if (data[key] === undefined) {
        continue;
      }

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
   * Whether a support statement represents unprefixed support under the
   * feature's canonical name (no `prefix`, no `alternative_name`).
   * @param {InternalSimpleSupportStatement} statement The support statement
   * @returns {boolean} Whether the statement is for the canonical name
   */
  #isCanonicalName(statement) {
    return !statement.prefix && !statement.alternative_name;
  }

  /**
   * Whether a support statement represents ongoing (not removed), unflagged
   * support under the canonical name — i.e. the feature is currently usable,
   * including `"preview"` builds.
   * @param {InternalSimpleSupportStatement} statement The support statement
   * @returns {boolean} Whether the statement is currently supported
   */
  #isCurrentlySupported(statement) {
    return (
      this.#isCanonicalName(statement) &&
      !statement.flags &&
      Boolean(statement.version_added) &&
      statement.version_removed === undefined
    );
  }

  /**
   * Resolve a browser's support statement to an array of simple statements,
   * resolving `"mirror"` if necessary.
   * @param {InternalSupportBlock | undefined} supportBlock The support block
   * @param {BrowserName} browser The browser to resolve
   * @returns {InternalSimpleSupportStatement[]} The simple support statements
   */
  #resolveStatements(supportBlock, browser) {
    if (!supportBlock) {
      return [];
    }
    let support = supportBlock[browser];
    if (support === undefined) {
      return [];
    }
    if (support === 'mirror') {
      support = this.#resolveMirror(browser, supportBlock);
    }
    return Array.isArray(support)
      ? support
      : [/** @type {InternalSimpleSupportStatement} */ (support)];
  }

  /**
   * Format a support statement as a human-readable version range.
   * @param {InternalSimpleSupportStatement} statement The statement to format
   * @returns {string} The formatted range
   */
  #formatSupport(statement) {
    /** @type {string[]} */
    const parts = [`added: ${statement.version_added}`];
    if (statement.version_removed) {
      parts.push(`removed: ${statement.version_removed}`);
    }
    if (statement.flags) {
      parts.push('behind a flag');
    }
    return `{ ${parts.join(', ')} }`;
  }

  /**
   * Check whether a child's supported version range extends beyond its parent's
   * for a given browser. This complements the scalar `version_added` checks by
   * flagging a child that is currently (or in `"preview"`) supported under the
   * canonical name while the parent's canonical-name support exists but is no
   * longer current (entirely `version_removed` or only available behind a flag).
   * Prefixed and alternative-name statements are intentionally ignored, since
   * BCD does not consistently propagate those to sub-features.
   * @param {InternalCompatStatement} parentCompat The parent compat data
   * @param {InternalCompatStatement} childCompat The child compat data
   * @param {BrowserName} browser The browser to check
   * @returns {InternalSimpleSupportStatement | null} The violating child
   *   statement, or `null` if the child range is contained
   */
  checkParentRangeContainment(parentCompat, childCompat, browser) {
    const childStatements = this.#resolveStatements(
      childCompat?.support,
      browser,
    );
    const violatingChild = childStatements.find((statement) =>
      this.#isCurrentlySupported(statement),
    );
    if (!violatingChild) {
      return null;
    }

    const parentStatements = this.#resolveStatements(
      parentCompat?.support,
      browser,
    );
    const parentHasCanonicalSupport = parentStatements.some((statement) =>
      this.#isCanonicalName(statement),
    );
    const parentCurrentlySupported = parentStatements.some((statement) =>
      this.#isCurrentlySupported(statement),
    );

    // Only flag when the parent actually records canonical-name support that is
    // no longer current. If the parent lacks canonical support altogether
    // (unsupported, or only prefixed/alternative-name), that is either handled
    // by the `unsupported` check or is an intentional modelling choice.
    if (parentHasCanonicalSupport && !parentCurrentlySupported) {
      return violatingChild;
    }

    return null;
  }

  /**
   * Checks a specific feature for errors
   * @param {InternalIdentifier} data The data to test
   * @returns {FeatureError[]} Any errors found within the data
   */
  checkFeature(data) {
    /** @type {FeatureError[]} */
    const errors = [];

    const subfeatures = this.getSubfeatures(data);

    // Test whether sub-features are supported when basic support is not implemented
    // For all unsupported browsers (basic support == false), sub-features should be set to false
    const unsupportedInParent = this.extractUnsupportedBrowsers(data.__compat);
    /** @type {Partial<Record<BrowserName, [string, VersionValue][]>>} */
    let inconsistentSubfeaturesByBrowser = {};

    subfeatures.forEach((subfeature) => {
      const subfeatureId = /** @type {InternalIdentifier} */ (
        query(subfeature, data)
      );
      const unsupportedInChild = this.extractUnsupportedBrowsers(
        subfeatureId.__compat,
      );

      const browsers = /** @type {BrowserName[]} */ (
        unsupportedInParent.filter((x) => !unsupportedInChild.includes(x))
      );

      browsers.forEach((browser) => {
        const feature_value = this.getVersionAdded(
          data.__compat?.support,
          browser,
        );
        const subfeature_value = this.getVersionAdded(
          subfeatureId.__compat?.support,
          browser,
        );
        if (feature_value === subfeature_value) {
          return;
        }
        inconsistentSubfeaturesByBrowser[browser] =
          inconsistentSubfeaturesByBrowser[browser] || [];
        inconsistentSubfeaturesByBrowser[browser]?.push([
          subfeature,
          subfeature_value,
        ]);
      });
    });

    // Add errors
    Object.keys(inconsistentSubfeaturesByBrowser).forEach((browser) => {
      const subfeatures =
        inconsistentSubfeaturesByBrowser[/** @type {BrowserName} */ (browser)];
      if (subfeatures) {
        errors.push({
          type: 'unsupported',
          browser: /** @type {BrowserName} */ (browser),
          parentValue: this.getVersionAdded(
            data?.__compat?.support,
            /** @type {BrowserName} */ (browser),
          ),
          subfeatures,
        });
      }
    });

    // Test whether sub-features are supported at an earlier version than basic support
    const supportInParent = this.extractSupportedBrowsersWithVersion(
      data.__compat,
    );
    inconsistentSubfeaturesByBrowser = {};

    for (const subfeature of subfeatures) {
      for (const browser of supportInParent) {
        const subfeatureData = /** @type {InternalIdentifier} */ (
          query(subfeature, data)
        );
        if (
          subfeatureData.__compat?.support[browser] != undefined &&
          this.isVersionAddedGreater(
            subfeatureData.__compat?.support,
            data.__compat?.support,
            /** @type {BrowserName} */ (browser),
          )
        ) {
          inconsistentSubfeaturesByBrowser[browser] =
            inconsistentSubfeaturesByBrowser[browser] || [];
          const subfeature_value = this.getVersionAdded(
            subfeatureData.__compat?.support,
            browser,
          );
          inconsistentSubfeaturesByBrowser[browser]?.push([
            subfeature,
            subfeature_value,
          ]);
        }
      }
    }

    // Add errors
    Object.keys(inconsistentSubfeaturesByBrowser).forEach((browser) => {
      const subfeatures =
        inconsistentSubfeaturesByBrowser[/** @type {BrowserName} */ (browser)];
      if (subfeatures) {
        errors.push({
          type: 'subfeature_earlier_implementation',
          browser: /** @type {BrowserName} */ (browser),
          parentValue: this.getVersionAdded(
            data?.__compat?.support,
            /** @type {BrowserName} */ (browser),
          ),
          subfeatures,
        });
      }
    });

    // Test whether sub-features are supported in a version range that is not
    // contained within the parent's supported version range.
    inconsistentSubfeaturesByBrowser = {};

    for (const subfeature of subfeatures) {
      const subfeatureData = /** @type {InternalIdentifier} */ (
        query(subfeature, data)
      );
      for (const browser of /** @type {BrowserName[]} */ (
        Object.keys(bcd.browsers)
      )) {
        if (!data.__compat || !subfeatureData.__compat) {
          continue;
        }
        const violation = this.checkParentRangeContainment(
          data.__compat,
          subfeatureData.__compat,
          browser,
        );
        if (violation) {
          inconsistentSubfeaturesByBrowser[browser] =
            inconsistentSubfeaturesByBrowser[browser] || [];
          inconsistentSubfeaturesByBrowser[browser]?.push([
            subfeature,
            this.#formatSupport(violation),
          ]);
        }
      }
    }

    // Add errors
    Object.keys(inconsistentSubfeaturesByBrowser).forEach((browser) => {
      const subfeatures =
        inconsistentSubfeaturesByBrowser[/** @type {BrowserName} */ (browser)];
      if (subfeatures) {
        const parentCanonical = this.#resolveStatements(
          data.__compat?.support,
          /** @type {BrowserName} */ (browser),
        )
          .filter((statement) => this.#isCanonicalName(statement))
          .map((statement) => this.#formatSupport(statement))
          .join(', ');
        errors.push({
          type: 'subfeature_outside_parent_range',
          browser: /** @type {BrowserName} */ (browser),
          parentValue: parentCanonical,
          subfeatures,
        });
      }
    });

    return errors;
  }

  /**
   * Checks if the data is a feature
   * @param {InternalIdentifier} data The data to test
   * @returns {data is InternalIdentifier & {__compat: InternalCompatStatement}} If the data is a feature statement
   */
  isFeature(data) {
    return '__compat' in data;
  }

  /**
   * Get all of the unsupported browsers in a feature
   * @param {InternalCompatStatement} [compatData] The compat data to process
   * @returns {BrowserName[]} The list of browsers marked as unsupported
   */
  extractUnsupportedBrowsers(compatData) {
    return this.extractBrowsers(
      compatData,
      (data) =>
        data.version_added === false ||
        typeof data.version_removed !== 'undefined',
    );
  }

  /**
   * Get all of the browsers with a version number in a feature.
   * @param {InternalCompatStatement} [compatData] The compat data to process
   * @returns {BrowserName[]} The list of browsers with an exact version number
   */
  extractSupportedBrowsersWithVersion(compatData) {
    return this.extractBrowsers(
      compatData,
      (/** @type {InternalSimpleSupportStatement} */ data) =>
        typeof data.version_added === 'string',
    );
  }

  /**
   * Return the earliest recorded version number from a support statement or null.
   * @param {InternalSupportBlock | undefined} supportBlock The compat data to process
   * @param {BrowserName} browser The browser to get data for
   * @returns {VersionValue} The earliest version added in the data
   */
  getVersionAdded(supportBlock, browser) {
    if (!supportBlock) {
      return false;
    }

    const supportStatement = supportBlock[browser];
    if (!supportStatement) {
      return false;
    }

    if (supportStatement === 'mirror') {
      return this.getVersionAdded(
        { [browser]: this.#resolveMirror(browser, supportBlock) },
        browser,
      );
    }

    /**
     * A convenience function to squash preview and flag support into `false`
     * @param {InternalSimpleSupportStatement} statement The statement to use
     * @returns {VersionValue} The version number or `false`
     */
    const resolveVersionAddedValue = (statement) =>
      statement?.version_added == 'preview' || statement.flags
        ? false
        : statement?.version_added;

    // Handle simple support statements
    if (!Array.isArray(supportStatement)) {
      return resolveVersionAddedValue(supportStatement);
    }

    // Handle array support statements
    /** @type {string | false} */
    let selectedValue = false;
    for (const statement of supportStatement) {
      const resolvedValue = resolveVersionAddedValue(statement);

      if (resolvedValue === false) {
        // We're not going to get a more specific version, so bail out now
        continue;
      }

      if (
        typeof resolvedValue === 'string' &&
        typeof selectedValue === 'string'
      ) {
        // Earlier value takes precedence
        const resolvedIsEarlier = compare(
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
   * @param {InternalSupportBlock | undefined} a The first support block to compare
   * @param {InternalSupportBlock | undefined} b The second support block to compare
   * @param {BrowserName} browser The browser to compare
   * @returns {boolean} If a's version is greater (later) than b's version
   */
  isVersionAddedGreater(a, b, browser) {
    const a_version_added = this.getVersionAdded(a, browser);
    const b_version_added = this.getVersionAdded(b, browser);

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
      return compare(
        a_version_added.replace('≤', ''),
        b_version_added,
        a_version_added.startsWith('≤') ? '<=' : '<',
      );
    }

    return false;
  }

  /**
   * Get all of the browsers within the data and pass the data to the callback.
   * @param {InternalCompatStatement | undefined} compatData The compat data to process
   * @param {(browserData: InternalSimpleSupportStatement) => boolean} callback The function to pass the data to
   * @returns {BrowserName[]} The list of browsers using the callback as a filter
   */
  extractBrowsers(compatData, callback) {
    if (!compatData) {
      return [];
    }

    return /** @type {BrowserName[]} */ (Object.keys(bcd.browsers)).filter(
      (browser) => {
        if (!(browser in compatData.support)) {
          return callback({ version_added: false });
        }

        let browserData = /** @type {InternalSupportStatement | undefined} */ (
          compatData.support[browser]
        );
        if (
          /** @type {InternalSupportStatement} */ (browserData) === 'mirror'
        ) {
          browserData = this.#resolveMirror(browser, compatData.support);
        }

        if (Array.isArray(browserData)) {
          return browserData.every(callback);
        } else if (typeof browserData === 'object') {
          return callback(browserData);
        }
        return false;
      },
    );
  }
}

/** @type {Linter} */
export default {
  name: 'Consistency',
  description: 'Test the version consistency between parent and child',
  scope: 'tree',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger, { data }) => {
    const checker = new ConsistencyChecker();
    const allErrors = checker.check(/** @type {InternalCompatData} */ (data));

    for (const { path, errors } of allErrors) {
      for (const { type, browser, parentValue, subfeatures } of errors) {
        let errorMessage = '';
        if (type == 'unsupported') {
          errorMessage += `No support in ${styleText('bold', browser)}, but support is declared in the following sub-feature(s):`;
        } else if (type == 'subfeature_earlier_implementation') {
          errorMessage += `Basic support in ${styleText('bold', browser)} was declared implemented in a later version (${styleText('bold', String(parentValue))}) than the following sub-feature(s):`;
        } else if (type == 'subfeature_outside_parent_range') {
          errorMessage += `Support range in ${styleText('bold', browser)} is not contained within the parent's support range (${styleText('bold', String(parentValue))}) for the following sub-feature(s):`;
        }

        for (const subfeature of subfeatures) {
          errorMessage += styleText(
            'red',
            `\n         → ${styleText('bold', `${path.join('.')}.${subfeature[0]}`)}: ${subfeature[1] === undefined ? '[Array]' : subfeature[1]}`,
          );
        }

        logger.error(errorMessage, { path: path.join('.') });
      }
    }
  },
};
