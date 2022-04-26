export function joinPath() {
  return Array.from(arguments).filter(Boolean).join('.');
}

export function isFeature(obj) {
  return '__compat' in obj;
}

export function isBrowser(obj) {
  return 'name' in obj && 'releases' in obj;
}

export function descendantKeys(data) {
  if (isFeature(data)) {
    return Object.keys(data).filter((key) => key !== '__compat');
  }

  if (isBrowser(data)) {
    // Browsers never have independently meaningful descendants
    return [];
  }

  return Object.keys(data);
}
