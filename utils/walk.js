const bcd = require('..');
const { isBrowser, descendantKeys, joinPath } = require('./walkingUtils');
const query = require('./query');

function* lowLevelWalk(data = bcd, path, depth = Infinity) {
  if (path !== undefined) {
    const next = {
      path,
      data,
    };

    if (isBrowser(data)) {
      next.browser = data;
    } else if (data.__compat !== undefined) {
      next.compat = data.__compat;
    }
    yield next;
  }

  if (depth > 0) {
    for (const key of descendantKeys(data)) {
      yield* lowLevelWalk(data[key], joinPath(path, key), depth - 1);
    }
  }
}

function* walk(entryPoints, data = bcd) {
  const walkers = [];

  if (entryPoints === undefined) {
    walkers.push(lowLevelWalk(data));
  } else {
    entryPoints = Array.isArray(entryPoints) ? entryPoints : [entryPoints];
    walkers.push(
      ...entryPoints.map((entryPoint) =>
        lowLevelWalk(query(entryPoint, data), entryPoint),
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
