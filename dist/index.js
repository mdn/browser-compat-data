'use strict';

// Try to load from source, which will be missing in the release on npm.
try {
  module.exports = require('../index.js');
} catch (e) {
  module.exports = require('./data.json');
}
