const extend = require('extend');

function processImports(feature, data, stack) {
  const imports = feature.__import;

  for (const ref in imports) {
    const import_ = imports[ref];
    let empty = true;
    for (const override in import_) {
      if (override === '__as') continue;
      // If the import overrides something, then we clone the target instead.
      empty = false;
      break;
    }
    let target = data;
    let name;
    for (name of ref.split('.')) {
      if (name in target && name !== '__compat' && name !== '__import') {
        target = target[name];
      } else {
        throw `Invalid import: "${stack.join('.')}" imports "${ref}", which doesn’t exist.`;
      }
    }
    if ('__as' in import_) {
      name = import_.__as;
    }
    if (!empty) {
      target = Object.assign({}, target);
      for (const override in import_) {
        if (override === '__as') continue;
        if (override in target) {
          extend(true, target[override], import_[override]);
        } else {
          target[override] = import_[override];
        }
      }
    }
    feature[name] = target;
  }

  delete feature.__import;
}

function resolveImports(data, allData = data, stack = []) {
  if (stack.length > 100) {
    throw `Probable stack overflow at: ${stack.join('.')}`;
  }

  for (const key in data) {
    if (stack.length === 0 && key === 'browsers') continue;
    if (key !== '__compat' && key !== '__import') {
      resolveImports(data[key], allData, [...stack, key]);
    }
  }

  if (stack.length > 0 ) {
    // Process imports after children to lessen issues with cycles,
    // which are currently allowed unless overrides are also used
    if ('__import' in data) {
      processImports(data, allData, stack);
    }
  }

  return data;
}

module.exports = {
  resolveImports: function (data) {
    return resolveImports(data);
  }
};
