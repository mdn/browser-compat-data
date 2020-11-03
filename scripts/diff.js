#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

/**
 * @typedef {import('../types').SupportStatement} SupportStatement
 */

'use strict';

const compareVersions = require('compare-versions');
const deepDiff = require('deep-diff');

const chalk = require('chalk');
const path = require('path');

const { argv } = require('yargs').command(
  '$0 [lhs] [rhs]',
  'Compares two copies of BCD and summarizes differences',
  yargs => {
    yargs
      .positional('lhs', {
        describe: 'The first copy of BCD to compare',
        type: 'string',
      })
      .positional('rhs', {
        describe: 'The other copy of BCD to compare',
        type: 'string',
      })
      .option('filter', {
        describe: 'Filter to just removals',
        type: 'boolean',
        default: false,
      });
  },
);

const query = (obj, path) => {
  let value = obj;
  for (const key of path) {
    value = value[key];
  }
  return value;
};

/**
 * @param {object} lhs
 * @param {object} rhs
 * @param {Diff} diff
 * @yields {object} and it's a great one
 */
function* explainDiff(lhs, rhs, diff) {
  if (diff.kind === 'N') {
    const added = query(rhs, diff.path);
    if (typeof added.__compat === 'object') {
      for (const [browser, support] of Object.entries(added.__compat.support)) {
        yield {
          entry: diff.path,
          support: browser,
          lhs: undefined,
          rhs: support,
        };
      }
      for (const [status, value] of Object.entries(added.__compat.status)) {
        yield {
          entry: diff.path,
          status,
          lhs: undefined,
          rhs: value,
        };
      }
      return;
    }
  }
  if (diff.path[0] === 'browsers') {
    // Just note which browser's data was updated.
    if (diff.path.length > 1) {
      const browser = diff.path[1];
      yield { browser };
    }
    return;
  }

  const compatIndex = diff.path.indexOf('__compat');
  if (compatIndex === -1) {
    return;
  }

  const entryPath = diff.path.slice(0, compatIndex);
  const restPath = diff.path.slice(compatIndex + 1);
  if (restPath.length === 2 && restPath[0] == 'status') {
    yield {
      entry: entryPath,
      status: restPath[1],
      lhs: diff.lhs,
      rhs: diff.rhs,
    };
  } else if (restPath.length >= 2 && restPath[0] == 'support') {
    const browser = restPath[1];
    const statementPath = diff.path.slice(0, compatIndex + 3);
    yield {
      entry: entryPath,
      support: browser,
      lhs: query(lhs, statementPath),
      rhs: query(rhs, statementPath),
    };
  }
}

/**
 * @param {object} lhs
 * @param {object} rhs
 * @returns {object} and it's a great one
 */
const bcdDiff = (lhs, rhs) => {
  const browsers = new Set();
  const compat = new Map();
  const other = new Set();
  const differences = deepDiff(lhs, rhs);
  if (!differences) {
    return undefined;
  }

  // Pass 1: collect
  for (const diff of differences) {
    const diffs = Array.from(explainDiff(lhs, rhs, diff));
    if (!diffs.length) {
      // Couldn't explain this diff at all
      other.add(diff.path.join('.'));
      continue;
    }
    for (const details of diffs) {
      if (details.browser) {
        browsers.add(details.browser);
        continue;
      }
      if (details.entry) {
        // Save the details for phase 2.
        const path = details.entry.join('.');
        let list = compat.get(path);
        if (!list) {
          list = [];
          compat.set(path, list);
        }
        list.push(details);
        continue;
      }
      throw new Error('unreachable code');
    }
  }

  // Pass 2: combine entry data
  for (const [path, detailsList] of compat.entries()) {
    const status = [];
    const support = [];
    for (const details of detailsList) {
      if (details.status) {
        status.push([details.status, details.rhs]);
      }
      if (details.support) {
        support.push([
          details.support,
          {
            lhs: details.lhs,
            rhs: details.rhs,
          },
        ]);
      }
    }
    const result = {};
    if (status.length) {
      result.status = Object.fromEntries(status);
    }
    if (support.length) {
      result.support = Object.fromEntries(support);
    }
    compat.set(path, result);
  }

  if (!browsers.size && !compat.size && !other.size) {
    return undefined;
  }
  return {
    browsers: Array.from(browsers).sort(),
    compat: Object.fromEntries(compat.entries()),
    other: Array.from(other).sort(),
  };
};

/**
 * @param {SupportStatement} support
 * @return {string}
 */
const pretty = support => {
  if (!support) {
    return 'unset';
  }
  if (!Array.isArray(support)) {
    support = [support];
  }
  support = support.map(entry => {
    let range = '';
    if (entry.version_added !== undefined) {
      range += entry.version_added;
    }
    if (entry.version_removed !== undefined) {
      range += '-';
      range += entry.version_removed;
    }
    // TODO: flags n stuff
    return range;
  });
  if (support.length === 1) {
    return support[0];
  }
  return `(${support.join(', ')})`;
};

if (require.main === module) {
  let lhs = require(path.resolve(argv.lhs));
  let rhs = require(path.resolve(argv.rhs));
  const diff = bcdDiff(lhs, rhs);
  if (!diff) {
    console.log('No differences!');
    return;
  }
  if (diff.compat) {
    for (const [path, details] of Object.entries(diff.compat)) {
      console.log(chalk.underline(path));
      if (details.support) {
        for (const [browser, { lhs, rhs }] of Object.entries(details.support)) {
          if (argv.filter) {
            let skip = false;
            if (!lhs) {
              // adding a support statement
              skip = true;
            } else if (rhs) {
              if (!lhs.version_added && rhs.version_added) {
                // changing support from falsy to truthy
                skip = true;
              }
              if (lhs.version_added === true && typeof rhs.version_added === 'string') {
                // changing true to a specific version
                skip = true;
              }
              if (typeof lhs.version_added === 'string' && typeof rhs.version_added === 'string') {
                if (compareVersions.compare(lhs.version_added.replace('≤', ''),
                                            rhs.version_added.replace('≤', ''), '>')) {
                  // widening claimed support
                  skip = true;
                }
              }
            }
            if (skip) {
              continue;
            }
          }
          const prettyLHS = pretty(lhs);
          const prettyRHS = pretty(rhs);
          // TODO: gross formatting required by Prettier
          console.log(
            `  ${chalk.bold(browser)} support set to ${chalk.green(
              prettyRHS,
            )} (was ${chalk.red(prettyLHS)})`,
          );
        }
      }
      if (details.status) {
        for (const [status, value] of Object.entries(details.status)) {
          // TODO: gross formatting required by Prettier
          console.log(
            `  ${chalk.bold(status)} status set to ${chalk.green(value)}`,
          );
        }
      }
    }
  }
} else {
  module.exports = { bcdDiff, pretty };
}
