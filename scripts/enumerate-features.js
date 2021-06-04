const yargs = require('yargs');

const fs = require('fs');

const { walk } = require('../utils');

function features() {
  const feats = [];

  for (const { path, compat } of walk()) {
    if (compat) {
      feats.push(path);
    }
  }

  return feats;
}

function main({ dest }) {
  fs.writeFileSync(dest, JSON.stringify(features()));
}

const { argv } = yargs.command(
  '$0 [dest]',
  'Write a JSON-formatted list of feature paths',
  yargs => {
    yargs.positional('dest', {
      default: '.features.json',
      description: 'File destination',
    });
  },
);

if (require.main === module) {
  main(argv);
}
