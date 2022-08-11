/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { queryPRs } from './utils.js';

const releaseNotesLabels = {
  major: 'semver-major-bump 🚨',
  minor: 'semver-minor-bump ➕',
};

export const getSemverBumpPulls = (fromDate: string) =>
  Object.fromEntries(
    ['major', 'minor'].map((l) => [
      l,
      queryPRs({
        search: `merged:>=${fromDate} label:"${releaseNotesLabels[l]}"`,
      }),
    ]),
  );
