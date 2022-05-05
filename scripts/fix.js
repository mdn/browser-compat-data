import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esMain from 'es-main';
import fixBrowserOrder from './fix-browser-order.js';
import fixFeatureOrder from './fix-feature-order.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * @param {string[]} files
 */
function load(...files) {
  for (let file of files) {
    if (file.indexOf(dirname) !== 0) {
      file = path.resolve(dirname, '..', file);
    }

    if (!fs.existsSync(file)) {
      console.warn('File not found, skipping:', file);
      continue; // Ignore non-existent files
    }

    if (fs.statSync(file).isFile()) {
      if (path.extname(file) === '.json') {
        fixBrowserOrder(file);
        fixFeatureOrder(file);
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
