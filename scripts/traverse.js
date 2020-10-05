'use strict';
const bcd = require('..');

const { argv } = require('yargs').command(
  '$0 [folder..]',
  'Test for specified values in any specified browser',
  yargs => {
    yargs
      .positional('folder', {
        describe: 'The folder(s) to test',
        type: 'array',
        default: Object.keys(bcd).filter(k => k !== 'browsers'),
      })
      .option('browser', {
        alias: 'b',
        describe: 'Filter specific browsers',
        type: 'array',
        nargs: 1,
        default: Object.keys(bcd.browsers),
      })
      .option('filter', {
        alias: 'f',
        describe: 'The value(s) to test against',
        type: 'array',
        nargs: 1,
        default: [],
      })
      .option('nonreal', {
        describe: 'Alias for "-f true -f null"',
        type: 'boolean',
        nargs: 0,
      })
      .option('depth', {
        alias: 'd',
        describe:
          'Depth of features to traverse (ex. "2" will capture "api.CSSStyleSheet.insertRule" but not "api.CSSStyleSheet.insertRule.optional_index")',
        type: 'number',
        nargs: 1,
        default: 100,
      });
  },
);

function traverseFeatures(obj, browsers, values, depth, identifier) {
  let features = [];

  depth--;
  if (depth >= 0) {
    for (const i in obj) {
      if (!!obj[i] && typeof obj[i] == 'object' && i !== '__compat') {
        if (obj[i].__compat) {
          const comp = obj[i].__compat.support;
          for (const browser of browsers) {
            let browserData = comp[browser];

            if (!browserData) {
              if (values.length == 0 || values.includes('null'))
                features.push(`${identifier}${i}`);
              continue;
            }
            if (!Array.isArray(browserData)) {
              browserData = [browserData];
            }

            for (const range in browserData) {
              if (browserData[range] === undefined) {
                if (values.length == 0 || values.includes('null'))
                  features.push(`${identifier}${i}`);
              } else if (
                values.length == 0 ||
                values.includes(String(browserData[range].version_added)) ||
                values.includes(String(browserData[range].version_removed))
              ) {
                let f = `${identifier}${i}`;
                if (browserData[range].prefix)
                  f += ` (${browserData[range].prefix} prefix)`;
                if (browserData[range].alternative_name)
                  f += ` (as ${browserData[range].alternative_name})`;
                features.push(f);
              }
            }
          }
        }
        features.push(
          ...traverseFeatures(
            obj[i],
            browsers,
            values,
            depth,
            identifier + i + '.',
          ),
        );
      }
    }
  }

  return features.filter((item, pos) => features.indexOf(item) == pos);
}

const main = (folders, browsers, values) => {
  let features = [];

  for (const folder in folders) {
    features.push(
      ...traverseFeatures(
        bcd[folders[folder]],
        browsers,
        values,
        argv.depth,
        `${folders[folder]}.`,
      ),
    );
  }

  return features;
};

if (require.main === module) {
  let folders = argv.folder;
  let browsers = Array.isArray(argv.browser) ? argv.browser : [argv.browser];
  let values = Array.isArray(argv.filter) ? argv.filter : [argv.filter];

  if (argv.nonreal) {
    values.push('true', 'null');
  }

  const features = main(folders, argv.browser, values);

  console.log(features.join('\n'));
  console.log(features.length);
}
