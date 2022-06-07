/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { Linters } from '../utils.js';

import testBrowsersData from './test-browsers-data.js';
import testBrowsersPresence from './test-browsers-presence.js';
import testConsistency from './test-consistency.js';
import testDescriptions from './test-descriptions.js';
import testLinks from './test-links.js';
import testNotes from './test-notes.js';
import testObsolete from './test-obsolete.js';
import testPrefix from './test-prefix.js';
import testSchema from './test-schema.js';
import testSpecURLs from './test-spec-urls.js';
import testStatus from './test-status.js';
import testStyle from './test-style.js';
import testVersions from './test-versions.js';

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
