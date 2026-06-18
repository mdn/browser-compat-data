/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { queryPRs } from './utils.js';

const releaseNotesLabels = {
  major: 'semver-major-bump',
  minor: 'semver-minor-bump',
};

/**
 * Get pull requests that have been merged since the specified date that perform a major/minor semver bump
 * @param {string} fromDate The date to check PRs from
 * @returns {{ major: *; minor: * }} The PRs that perform semver bumps higher than a patch
 */
export const getSemverBumpPulls = (fromDate) =>
  /** @type {{ major: *; minor: * }} */ (
    Object.fromEntries(
      ['major', 'minor'].map((l) => [
        l,
        queryPRs({
          search: `merged:>=${fromDate} label:"${releaseNotesLabels[l]}"`,
        }),
      ]),
    )
  );
