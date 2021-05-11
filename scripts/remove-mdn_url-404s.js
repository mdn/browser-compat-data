#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const chalk = require('chalk');
const fs = require('fs');
const request = require('sync-request');
const path = require('path');
const URL = require('url');
const { platform } = require('os');
const { promisify } = require('util');

const IS_WINDOWS = platform() === 'win32';

const sleep = promisify(setTimeout);

const log = message => console.log(chalk`{cyan        ${message}}`);
const warn = message => console.log(chalk`{yellow        ${message}}`);
const error = message => console.log(chalk`{redBright        ${message}}`);

const processUrl = (url, value) => {
  const options = {
    headers: { 'User-Agent': 'bcd-migration-script' },
    gzip: false, // prevent Z_BUF_ERROR 'unexpected end of file'
    followRedirects: true, // default
  };
  const localURL = 'http://localhost:5000' + URL.parse(url).path;
  const response = request('HEAD', localURL, options);
  const statusCode = response.statusCode;
  if (statusCode === 404) {
    const response2 = request('HEAD', url, options);
    if (response2.statusCode === 404) {
      delete value.mdn_url;
      log(`404 ${url}`);
    } else {
      warn(`not 404 ${url}`);
    }
  } else if (response.headers['retry-after']) {
    const seconds = response.headers['retry-after'];
    warn(`${statusCode} ${url} (retrying after ${seconds} seconds)`);
    sleep(seconds * 1000).then(processUrl(url, value));
  } else if (statusCode === 504) {
    warn(`504 ${url} (retrying after 10 seconds)`);
    sleep(10 * 1000).then(processUrl(url, value));
  } else if (statusCode >= 300) {
    error(`${statusCode} ${url} (unexpected status code)`);
  }
  return response;
};

const removeMdnUrl404s = (key, value) => {
  const mdnUrlBase = 'https://developer.mozilla.org/en-US/';
  if (key === '__compat') {
    if (value.mdn_url !== undefined) {
      processUrl(mdnUrlBase + value.mdn_url.substring(30), value);
    }
  }
  return value;
};

/**
 * @param {Promise<void>} filename
 */
const processFile = filename => {
  console.log(`Processing ${filename}`);

  let actual = fs.readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(JSON.parse(actual, removeMdnUrl404s), null, 2);

  if (IS_WINDOWS) {
    // prevent false positives from git.core.autocrlf on Windows
    actual = actual.replace(/\r/g, '');
    expected = expected.replace(/\r/g, '');
  }

  if (actual !== expected) {
    fs.writeFileSync(filename, expected + '\n', 'utf-8');
  }
};

if (require.main === module) {
  /**
   * @param {string[]} files
   */
  const load = (...files) => {
    for (let file of files) {
      if (file.indexOf(__dirname) !== 0) {
        file = path.resolve(__dirname, '..', file);
      }

      if (!fs.existsSync(file)) {
        continue; // Ignore non-existent files
      }

      if (fs.statSync(file).isFile()) {
        if (path.extname(file) === '.json') {
          processFile(file);
        }

        continue;
      }

      load(...subFiles(file));
    }
  };

  const subFiles = file =>
    fs.readdirSync(file).map(subfile => {
      return path.join(file, subfile);
    });

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
      'webdriver',
      'webextensions',
    );
  }
}

module.exports = { removeMdnUrl404s, processFile };
