'use strict';
const { exec } = require('child_process');
const chalk = require('chalk');
const bcd = require('..');

const start =
  process.platform == 'darwin'
    ? 'open'
    : process.platform == 'win32'
    ? 'start'
    : 'xdg-open';

const { argv } = require('yargs').command(
  '$0 <feature>',
  'Open the MDN documentation for a specified feature',
  yargs => {
    yargs.positional('feature', {
      describe: 'The feature identifier',
      type: 'string',
    });
  },
);

function openDocs(ident) {
  let feature = ident.split('.');
  let currentObj = bcd;

  for (let depth = 0; depth < feature.length; depth++) {
    currentObj = currentObj[feature[depth]];

    if (!currentObj) {
      console.error(chalk`{red Could not find {bold ${ident}}!}`);
      return false;
    }
  }

  if (!currentObj.__compat) {
    console.error(
      chalk`{red {bold ${ident}} has no compatibility data!  Maybe try its parent or a child?}`,
    );
    return false;
  }

  if (!currentObj.__compat.mdn_url) {
    console.error(
      chalk`{red {bold ${ident}} has no documentation!  Maybe try its parent?}`,
    );
    return false;
  }

  exec(`${start} ${currentObj.__compat.mdn_url}`);
}

openDocs(argv.feature);
