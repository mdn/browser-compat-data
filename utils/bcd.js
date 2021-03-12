let requireId = '..';

if (process.env.BCD_UTILS_BCD_PACKAGE_PATH) {
  console.warn('Warning: loading BCD from alternate path');
  requireId = process.env.BCD_UTILS_BCD_PACKAGE_PATH;
}

if (process.env.BCD_UTILS_REQUIRE_PACKAGE) {
  // To facilitate further experimentation while also not exposing this as part
  // of BCD's public API. With this, you can use `/utils` as a submodule.
  console.warn('Warning: `require`-ing BCD');
  requireId = '@mdn/browser-compat-data';
}

const bcd = require(requireId);

module.exports = bcd;
