if (process.env.BCD_UTILS_BCD_PACKAGE_PATH) {
  console.warn('Warning: loading BCD in development mode');
}

const bcd = require(process.env.BCD_UTILS_BCD_PACKAGE_PATH ||
  '@mdn/browser-compat-data');

module.exports = bcd;
