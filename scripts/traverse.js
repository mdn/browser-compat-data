'use strict';
const bcd = require('..');

var values_to_test = [null];
var browser_to_test = 'chrome';

function traverseFeatures(obj, depth, identifier) {
  depth--;
  if (depth >= 0) {
    for (let i in obj) {
      if (!!obj[i] && typeof(obj[i]) == "object" && i !== '__compat') {
         if (obj[i].__compat) {
           let comp = obj[i].__compat.support;
           let browser = comp[browser_to_test];
           if (!Array.isArray(browser)) {
              browser = [browser];
            }
            for (let range in browser) {
              if (values_to_test.includes(browser[range].version_added) || values_to_test.includes(browser[range].version_removed)) {
                features.push(identifier + i);
              }
           }
         }
         traverseFeatures(obj[i], depth, identifier + i + '.');
       }
     }
   }
}

let features = [];
traverseFeatures(bcd.css, 100, 'css.');
console.log(features.join("\n"));