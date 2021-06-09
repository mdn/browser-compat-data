const yargs = require('yargs');

const fs = require('fs');
const path = require('path');

const { walk } = require('../utils');

function main({ dest, dataFrom }) {
  fs.writeFileSync(dest, JSON.stringify(enumerateFeatures(dataFrom)));
}

function enumerateFeatures(dataFrom) {
  const feats = [];

  const walker = dataFrom
    ? walk(undefined, require(path.join(process.cwd(), dataFrom)))
    : walk();

  for (const { path, compat } of walker) {
    if (compat) {
      feats.push(path);
    }
  }

  return feats;
}

const { argv } = yargs.command(
  '$0 [dest]',
  'Write a JSON-formatted list of feature paths',
  yargs => {
    yargs
      .positional('dest', {
        default: '.features.json',
        description: 'File destination',
      })
      .option('data-from', {
        nargs: 1,
        description: 'Require compat data from an alternate path',
      });
  },
);

if (require.main === module) {
  main(argv);
}

module.exports = enumerateFeatures;
