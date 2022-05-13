/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const iterSupport = require('./iter-support');
const query = require('./query');
const { walk } = require('./walk');
const visit = require('./visit');

module.exports = {
  iterSupport,
  query,
  walk,
  visit,
};
