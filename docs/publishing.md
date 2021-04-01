# Publishing a new version of `@mdn/browser-compat-data`

[Project owners](/GOVERNANCE.md#owners) publish new releases of [`@mdn/browser-compat-data`](https://www.npmjs.com/package/@mdn/browser-compat-data) on npm.
MDN staff [deploy the package to the MDN site](contributing.md#updating-compatibility-tables-on-mdn).
Usually, this happens every Thursday (MDN never deploys to production on Fridays).

## Before you begin

Any project owner (or release designee) can complete the following steps to publish a new version, but please coordinate releases with [@ddbeck](https://github.com/ddbeck).

The steps in this process assume:

- `NPM_TOKEN` is set in the repository secrets. If the token is invalidated or unset, a member of the `@mdn` organization on npm must [create a new token](https://docs.npmjs.com/creating-and-viewing-authentication-tokens) and [add it to the repository's secrets](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets#creating-encrypted-secrets-for-a-repository).
- Your `origin` remote points to `mdn/browser-compat-data`. You may have to adjust the procedure to use a different remote name.

## Prepare the release

To create a new version of the package:

1. Figure out the new version number by looking at [past releases](https://github.com/mdn/browser-compat-data/releases). If the release is a non-breaking and data-only update, we're using patch versions. Lets assume that's the case and the next version should be `1.0.3`.

2. On your updated and clean `main` branch, run `npm version patch -m "Patch release containing data or non-breaking updates only"`. Locally, this updates `package.json`, creates a new commit, and creates a new release tag (see also the docs for [npm version](https://docs.npmjs.com/cli/version)).

3. Push the commit to `main`: `git push origin main`.

4. Check if the commit passes our [GitHub Actions workflows](https://github.com/mdn/browser-compat-data/actions).

5. If the commit passed, push the git tag as well: `git push origin v1.0.3`.

6. Start a draft [release on GitHub](https://github.com/mdn/browser-compat-data/releases) by running `npm run release-notes -- v1.0.3` and completing the prompts.

   _Note_: If you're not ready to publish to npm, click **Save draft** in GitHub and resume this process later.

## Publish to npm

To publish the package:

7. Click **Publish release**. Wait for the release [GitHub Actions workflow](https://github.com/mdn/browser-compat-data/actions) to finish successfully.

8. Check [mdn-browser-compat-data on npm](https://www.npmjs.com/package/mdn-browser-compat-data) to see if `1.0.3` shows up correctly.

The package is now published.

## Finish up

After the package is published:

9. Notify the `#mdn-dev` channel on Mozilla Slack about the new release.

10. Update tracking issues:

    - [#6369](https://github.com/mdn/browser-compat-data/issues/6369) for every release, update with the results of `npm run stats api`
    - [#3555](https://github.com/mdn/browser-compat-data/issues/3555) when there's significant progress, update with the results of `npm run stats`

You have finished releasing BCD! 🎉
