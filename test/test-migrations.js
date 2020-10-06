#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const m002 = require('../scripts/migrations/002-remove-webview-flags.test.js');

/**
 * @returns {boolean} If the migrations aren't functioning properly
 */
const testMigrations = () => {
  const logger = new Logger('Migrations');

  m002(logger);

  logger.emit();
  return logger.hasErrors();
};

module.exports = testMigrations;
