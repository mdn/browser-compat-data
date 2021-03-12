const bcd = require('./bcd');
const { isBrowser, descendantKeys, joinPath } = require('./walkingUtils');
const query = require('./query');

function* lowLevelWalk(data = bcd, path, depth = Infinity) {
  if (path !== undefined) {
    yield {
      path,
      data,
      compat: data.__compat,
      browser: isBrowser(data) ? data : undefined,
    };
  }

  if (depth > 0) {
    for (const key of descendantKeys(data)) {
      yield* lowLevelWalk(data[key], joinPath(path, key), depth - 1);
    }
  }
}

function* walk(entryPoints) {
  const walkers = [];

  if (entryPoints === undefined) {
    walkers.push(lowLevelWalk());
  } else {
    entryPoints = Array.isArray(entryPoints) ? entryPoints : [entryPoints];
    walkers.push(
      ...entryPoints.map(entryPoint =>
        lowLevelWalk(query(entryPoint), entryPoint),
      ),
    );
  }

  for (const walker of walkers) {
    for (const step of walker) {
      if (step.compat) {
        yield step;
      }
    }
  }
}

module.exports = { walk, lowLevelWalk };
