/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { getRefDate, exec, queryPRs } from './utils.js';

const ghQueryCmd = 'gh pr list --json number --search {QUERY}';
const releaseNotesLabels = {
  major: 'semver-major-bump 🚨',
  minor: 'semver-minor-bump ➕',
};

export const getSemverBumpPulls = (fromDate: string) =>
  Object.fromEntries(
    ['major', 'minor'].map((l) => [
      l,
      queryPRs({
        search: `merged:>=${fromDate} label:"${l}"`,
      }),
    ]),
  );
