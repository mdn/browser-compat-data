'use strict';
const bcd = require('..');

const { argv } = require('yargs').command('$0 <browser> [folder] [value]', 'Test for specified values in any specified browser', (yargs) => {
  yargs.positional('browser', {
    describe: 'The browser to test for',
    type: 'string'
  }).positional('folder', {
    describe: 'The folder(s) to test',
    type: 'array',
    default: ['api', 'css', 'html', 'http', 'svg', 'javascript', 'mathml', 'webdriver', 'xpath', 'xslt']
  }).positional('value', {
    describe: 'The value(s) to test against',
    type: 'array',
    default: [null, true]
  });
});

function traverseFeatures(obj, depth, identifier) {
  depth--;
  if (depth >= 0) {
    for (let i in obj) {
      if (!!obj[i] && typeof(obj[i]) == "object" && i !== '__compat') {
         if (obj[i].__compat) {
           let comp = obj[i].__compat.support;
           let browser = comp[argv.browser];
           if (!Array.isArray(browser)) {
              browser = [browser];
            }
            for (let range in browser) {
              if (browser[range] === undefined) {
                if (values.includes(null)) features.push(`${identifier}${i}`);
              }
              else if (values.includes(browser[range].version_added) || values.includes(browser[range].version_removed)) {
                if (browser[range].prefix) features.push(`${identifier}${i} (${browser[range].prefix} prefix)`);
                else features.push(`${identifier}${i}`);
              }
           }
         }
         traverseFeatures(obj[i], depth, identifier + i + '.');
       }
     }
   }
}

let features = [];
let folders = typeof argv.folder === 'string' ? [argv.folder] : argv.folder;
let values = typeof argv.value === 'string' ? [argv.value] : argv.value;

for (let folder in folders) traverseFeatures(bcd[folders[folder]], 100, `${folders[folder]}.`);

console.log(features.join("\n"));