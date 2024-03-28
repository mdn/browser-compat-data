/**
 * This script stores the 'main' branch's HEAD commit hash in .husky/_/history
 * The stored commit hash is used by the post-merge script .husky/post-merge
 */

import fs from 'node:fs';

import { getBranchName, getHashOfHEAD } from './lib/git.js';

const HUSKY_ROOT = '.husky/_/';
const HISTORY_FILE = HUSKY_ROOT + 'history';

if (
  'main' === getBranchName() &&
  fs.existsSync(HUSKY_ROOT) &&
  process.env['HUSKY'] !== '0'
) {
  fs.writeFileSync(HISTORY_FILE, getHashOfHEAD());
}
