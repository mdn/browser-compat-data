/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esMain from 'es-main';

import fixBrowserOrder from './browser-order.js';
import fixFeatureOrder from './feature-order.js';
import fixPropertyOrder from './property-order.js';
import fixLinks from './links.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Recursively load one or more files and/or directories passed as arguments and perform automatic fixes.
 *
 * @param {string[]} files The files to load and perform fix upon
 * @returns {void}
 */
function load(...files) {
  for (let file of files) {
    if (file.indexOf(dirname) !== 0) {
      file = path.resolve(dirname, '..', '..', file);
    }

    if (!fs.existsSync(file)) {
      console.warn('File not found, skipping:', file);
      continue; // Ignore non-existent files
    }

    if (fs.statSync(file).isFile()) {
      if (path.extname(file) === '.json') {
        fixBrowserOrder(file);
        fixFeatureOrder(file);
        fixPropertyOrder(file);
        fixLinks(file);
      }

      continue;
    }

    const subFiles = fs.readdirSync(file).map((subfile) => {
      return path.join(file, subfile);
    });

    load(...subFiles);
  }
}

if (esMain(import.meta)) {
  if (process.argv[2]) {
    load(process.argv[2]);
  } else {
    load(
      'api',
      'css',
      'html',
      'http',
      'svg',
      'javascript',
      'mathml',
      'test',
      'webdriver',
      'webextensions',
    );
  }
}

module.exports = load;
