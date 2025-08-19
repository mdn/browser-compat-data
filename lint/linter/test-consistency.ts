/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { compare } from 'compare-versions';
import chalk from 'chalk-template';

import { Linter, Logger, LinterData } from '../utils.js';
import {
  BrowserName,
  CompatData,
  CompatStatement,
  Identifier,
  SimpleSupportStatement,
  VersionValue,
} from '../../types/types.js';
import {
  DataType,
  InternalSupportBlock,
  InternalSupportStatement,
} from '../../types/index.js';
import { query } from '../../utils/index.js';
import mirrorSupport from '../../scripts/build/mirror.js';
import bcd from '../../index.js';

type ErrorType =
  | 'unsupported'
  | 'support_unknown'
  | 'subfeature_earlier_implementation';

interface ConsistencyError {
  path: string[];
  errors: FeatureError[];
}

interface FeatureError {
  type: ErrorType;
  browser: BrowserName;
  parentValue: VersionValue;
  subfeatures: [string, VersionValue][];
}

/**
 * Consistency check.
 *
 * This checker aims at improving data quality
 * by detecting inconsistent information.
 */
export class ConsistencyChecker {
  /**
   * Checks the data for any errors
   * @param data The data to test
   * @returns Any errors found within the data
   */
  check(data: CompatData): ConsistencyError[] {
    return this.checkSubfeatures({ ...data, browsers: undefined });
  }

  /**
   * Recursively checks the data for any errors
   * @param data The data to test
   * @param [path] The path of the data
   * @returns Any errors found within the data
   */
  checkSubfeatures(data: DataType, path: string[] = []): ConsistencyError[] {
    let allErrors: ConsistencyError[] = [];

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
   * Get the subfeatures of an identifier
   * @param data The identifier
   * @returns The subfeatures
   */
  getSubfeatures(data: Identifier): string[] {
    const subfeatures: string[] = [];
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
   * Checks a specific feature for errors
   * @param data The data to test
   * @returns Any errors found within the data
   */
  checkFeature(data: Identifier): FeatureError[] {
    const errors: FeatureError[] = [];

    const subfeatures = this.getSubfeatures(data);

    // Test whether sub-features are supported when basic support is not implemented
    // For all unsupported browsers (basic support == false), sub-features should be set to false
    const unsupportedInParent = this.extractUnsupportedBrowsers(data.__compat);
    let inconsistentSubfeaturesByBrowser: Partial<
      Record<BrowserName, [string, VersionValue][]>
    > = {};

    subfeatures.forEach((subfeature) => {
      const unsupportedInChild = this.extractUnsupportedBrowsers(
        query(subfeature, data).__compat,
      );

      const browsers = unsupportedInParent.filter(
        (x) => !unsupportedInChild.includes(x),
      ) as BrowserName[];

      browsers.forEach((browser) => {
        const feature_value = this.getVersionAdded(
          data.__compat?.support,
          browser,
        );
        const subfeature_value = this.getVersionAdded(
          query(subfeature, data).__compat.support,
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
        inconsistentSubfeaturesByBrowser[browser as BrowserName];
      if (subfeatures) {
        errors.push({
          type: 'unsupported',
          browser: browser as BrowserName,
          parentValue: this.getVersionAdded(
            data?.__compat?.support,
            browser as BrowserName,
          ),
          subfeatures,
        });
      }
    });

    // Test whether sub-features are supported when basic support is not implemented
    // For all unsupported browsers (basic support == false), sub-features should be set to false
    const supportUnknownInParent = this.extractSupportUnknownBrowsers(
      data.__compat,
    );
    inconsistentSubfeaturesByBrowser = {};

    for (const subfeature of subfeatures) {
      const supportUnknownInChild = this.extractSupportNotTrueBrowsers(
        query(subfeature, data).__compat,
      );

      const browsers = supportUnknownInParent.filter(
        (x) => !supportUnknownInChild.includes(x),
      ) as BrowserName[];

      for (const browser of browsers) {
        inconsistentSubfeaturesByBrowser[browser] =
          inconsistentSubfeaturesByBrowser[browser] || [];
        const subfeature_value = this.getVersionAdded(
          query(subfeature, data).__compat.support,
          browser,
        );
        inconsistentSubfeaturesByBrowser[browser]?.push([
          subfeature,
          subfeature_value,
        ]);
      }
    }

    // Add errors
    Object.keys(inconsistentSubfeaturesByBrowser).forEach((browser) => {
      const subfeatures =
        inconsistentSubfeaturesByBrowser[browser as BrowserName];
      if (subfeatures) {
        errors.push({
          type: 'support_unknown',
          browser: browser as BrowserName,
          parentValue: this.getVersionAdded(
            data?.__compat?.support,
            browser as BrowserName,
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
        if (
          query(subfeature, data).__compat.support[browser] != undefined &&
          this.isVersionAddedGreater(
            query(subfeature, data).__compat.support,
            data.__compat?.support,
            browser as BrowserName,
          )
        ) {
          inconsistentSubfeaturesByBrowser[browser] =
            inconsistentSubfeaturesByBrowser[browser] || [];
          const subfeature_value = this.getVersionAdded(
            query(subfeature, data).__compat.support,
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
        inconsistentSubfeaturesByBrowser[browser as BrowserName];
      if (subfeatures) {
        errors.push({
          type: 'subfeature_earlier_implementation',
          browser: browser as BrowserName,
          parentValue: this.getVersionAdded(
            data?.__compat?.support,
            browser as BrowserName,
          ),
          subfeatures,
        });
      }
    });

    return errors;
  }

  /**
   * Checks if the data is a feature
   * @param data The data to test
   * @returns If the data is a feature statement
   */
  isFeature(data: Identifier): boolean {
    return '__compat' in data;
  }

  /**
   * Get all of the unsupported browsers in a feature
   * @param compatData The compat data to process
   * @returns The list of browsers marked as unsupported
   */
  extractUnsupportedBrowsers(compatData?: CompatStatement): BrowserName[] {
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
   * @param compatData The compat data to process
   * @returns The list of browsers with unknown support
   */
  extractSupportUnknownBrowsers(compatData?: CompatStatement): BrowserName[] {
    return this.extractBrowsers(
      compatData,
      (data) => data.version_added === null,
    );
  }

  /**
   * Get all of the browsers with either unknown or no support in a feature
   * @param compatData The compat data to process
   * @returns The list of browsers with non-truthy (false or null) support
   */
  extractSupportNotTrueBrowsers(compatData?: CompatStatement): BrowserName[] {
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
   * @param compatData The compat data to process
   * @returns The list of browsers with an exact version number
   */
  extractSupportedBrowsersWithVersion(
    compatData?: CompatStatement,
  ): BrowserName[] {
    return this.extractBrowsers(
      compatData,
      (data: SimpleSupportStatement) => typeof data.version_added === 'string',
    );
  }

  /**
   * Return the earliest recorded version number from a support statement or null.
   * @param supportBlock The compat data to process
   * @param browser The browser to get data for
   * @returns The earliest version added in the data
   */
  getVersionAdded(
    supportBlock: InternalSupportBlock | undefined,
    browser: BrowserName,
  ): VersionValue {
    if (!supportBlock) {
      return null;
    }

    const supportStatement = supportBlock[browser];
    if (!supportStatement) {
      return null;
    }

    if (supportStatement === 'mirror') {
      return this.getVersionAdded(
        { [browser]: mirrorSupport(browser, supportBlock) },
        browser,
      );
    }

    /**
     * A convenience function to squash non-real values and previews into null
     * @param statement The statement to use
     * @returns The version number or 'null'
     */
    const resolveVersionAddedValue = (
      statement: SimpleSupportStatement,
    ): VersionValue =>
      [true, false, 'preview', null].includes(statement?.version_added) ||
      statement.flags
        ? null
        : statement?.version_added;

    // Handle simple support statements
    if (!Array.isArray(supportStatement)) {
      return resolveVersionAddedValue(supportStatement);
    }

    // Handle array support statements
    let selectedValue: string | boolean | null = null;
    for (const statement of supportStatement) {
      const resolvedValue = resolveVersionAddedValue(statement);

      if (resolvedValue === null) {
        // We're not going to get a more specific version, so bail out now
        continue;
      }

      if (selectedValue !== null) {
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
        } else if (typeof resolvedValue === 'string') {
          // If selectedValue is bool/null but resolvedValue is string
          selectedValue = resolvedValue;
        } else {
          // If neither are version numbers, assign to the truthiest value
          selectedValue = selectedValue || resolvedValue;
        }
      } else {
        selectedValue = resolvedValue;
      }
    }
    return selectedValue;
  }

  /**
   * Compare two versions and determine if a's version is greater (later) than b's version
   * @param a The first support block to compare
   * @param b The second support block to compare
   * @param browser The browser to compare
   * @returns If a's version is greater (later) than b's version
   */
  isVersionAddedGreater(
    a: InternalSupportBlock | undefined,
    b: InternalSupportBlock | undefined,
    browser: BrowserName,
  ): boolean {
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
   * @param compatData The compat data to process
   * @param callback The function to pass the data to
   * @returns The list of browsers using the callback as a filter
   */
  extractBrowsers(
    compatData: CompatStatement | undefined,
    callback: (browserData: SimpleSupportStatement) => boolean,
  ): BrowserName[] {
    if (!compatData) {
      return [];
    }

    return (Object.keys(bcd.browsers) as BrowserName[]).filter((browser) => {
      if (!(browser in compatData.support)) {
        return callback({ version_added: false });
      }

      let browserData: InternalSupportStatement = compatData.support[browser];
      if ((browserData as InternalSupportStatement) === 'mirror') {
        browserData = mirrorSupport(browser, compatData.support);
      }

      if (Array.isArray(browserData)) {
        return browserData.every(callback);
      } else if (typeof browserData === 'object') {
        return callback(browserData);
      }
      return false;
    });
  }
}

export default {
  name: 'Consistency',
  description: 'Test the version consistency between parent and child',
  scope: 'tree',
  /**
   * Test the data
   * @param logger The logger to output errors to
   * @param root The data to test
   * @param root.data The browser data
   */
  check: (logger: Logger, { data }: LinterData) => {
    const checker = new ConsistencyChecker();
    const allErrors = checker.check(data);

    for (const { path, errors } of allErrors) {
      for (const { type, browser, parentValue, subfeatures } of errors) {
        let errorMessage = '';
        if (type == 'unsupported') {
          errorMessage += chalk`No support in {bold ${browser}}, but support is declared in the following sub-feature(s):`;
        } else if (type == 'support_unknown') {
          errorMessage += chalk`Unknown support in parent for {bold ${browser}}, but support is declared in the following sub-feature(s):`;
        } else if (type == 'subfeature_earlier_implementation') {
          errorMessage += chalk`Basic support in {bold ${browser}} was declared implemented in a later version ({bold ${parentValue}}) than the following sub-feature(s):`;
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
} as Linter;
