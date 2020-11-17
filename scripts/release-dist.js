'use strict';

const fs = require('fs').promises;
const path = require('path');

const directory = './dist/';

function createDataBundle() {
  const bcd = require('../index.js');
  const string = JSON.stringify(bcd);
  return string;
}

async function main() {
  const dest = path.resolve(directory, './data.json');
  const data = createDataBundle();
  await fs.writeFile(dest, data);
}

// This is needed because NodeJS does not support top-level await.
main().then(() => console.log('Data bundle is ready'));
