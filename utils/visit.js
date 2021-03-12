const bcd = require("./bcd");
const query = require("./query");
const { descendantKeys, joinPath, isFeature } = require("./walkingUtils");

const BREAK = Symbol("break");
const CONTINUE = Symbol("continue");

function visit(entryPoint, testFn, visitorFn) {
  const data = entryPoint === undefined ? bcd : query(entryPoint);
  let outcome;
  if (isFeature(data) && testFn(entryPoint, data.__compat)) {
    outcome = visitorFn(entryPoint, data.__compat);
  }
  if (outcome === BREAK) {
    return outcome;
  }
  if (outcome !== CONTINUE) {
    for (const key of descendantKeys(data)) {
      const suboutcome = visit(joinPath(entryPoint, key), testFn, visitorFn);
      if (suboutcome === BREAK) {
        return suboutcome;
      }
    }
  }
  return outcome;
}

visit.BREAK = BREAK;
visit.CONTINUE = CONTINUE;

module.exports = visit;
