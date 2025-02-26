import { Browsers, ReleaseStatement } from '../../types/types.js';

/**
 * Finds a browser release.
 * @param browsers the browser data.
 * @param browser the name of the browser.
 * @param version the version of the release.
 * @returns the browser release if it exists, or undefined.
 */
export const findBrowserRelease = (
  browsers: Browsers,
  browser: string,
  version: string,
): ReleaseStatement | undefined => {
  version = version.replace('≤', '');
  return browsers[browser].releases.find(
    (release) => release.version === version,
  );
};
