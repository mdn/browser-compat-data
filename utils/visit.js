const bcd = require('..');
const query = require('./query');
const { descendantKeys, joinPath, isFeature } = require('./walkingUtils');

const BREAK = Symbol('break');
const CONTINUE = Symbol('continue');

function visit(entryPoint, testFn, visitorFn, data = bcd) {
  const tree = entryPoint === undefined ? bcd : query(entryPoint, data);
  let outcome;
  if (isFeature(tree) && testFn(entryPoint, tree.__compat)) {
    outcome = visitorFn(entryPoint, tree.__compat);
  }
  if (outcome === BREAK) {
    return outcome;
  }
  if (outcome !== CONTINUE) {
    for (const key of descendantKeys(tree)) {
      const suboutcome = visit(
        joinPath(entryPoint, key),
        testFn,
        visitorFn,
        data,
      );
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
