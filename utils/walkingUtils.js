function joinPath() {
  return Array.from(arguments).filter(Boolean).join('.');
}

function isFeature(obj) {
  return '__compat' in obj;
}
function isBrowser(obj) {
  return 'name' in obj && 'releases' in obj;
}

function descendantKeys(data) {
  if (typeof data !== 'object') {
    // Return if the data isn't an object, like __version
    return [];
  }

  if (isFeature(data)) {
    return Object.keys(data).filter(
      (key) => key !== '__compat' && key !== '__version',
    );
  }

  if (isBrowser(data)) {
    // Browsers never have independently meaningful descendants
    return [];
  }

  return Object.keys(data).filter(key => key !== '__version');
}

module.exports = {
  joinPath,
  isFeature,
  isBrowser,
  descendantKeys,
};
