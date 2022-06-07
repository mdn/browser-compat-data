/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { Linters } from '../utils';

import testBrowsersData from './test-browsers-data';
import testBrowsersPresence from './test-browsers-presence';
import testConsistency from './test-consistency';
import testDescriptions from './test-descriptions';
import testLinks from './test-links';
import testNotes from './test-notes';
import testObsolete from './test-obsolete';
import testPrefix from './test-prefix';
import testSchema from './test-schema';
import testSpecURLs from './test-spec-urls';
import testStatus from './test-status';
import testStyle from './test-style';
import testVersions from './test-versions';

export default new Linters([
  testBrowsersData,
  testBrowsersPresence,
  testConsistency,
  testDescriptions,
  testLinks,
  testNotes,
  testObsolete,
  testPrefix,
  testSchema,
  testSpecURLs,
  testStatus,
  testStyle,
  testVersions,
]);
