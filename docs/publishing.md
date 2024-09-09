# Publishing a new version of `@mdn/browser-compat-data`

[Project owners](./GOVERNANCE.md#owners) publish new releases of [`@mdn/browser-compat-data`](https://www.npmjs.com/package/@mdn/browser-compat-data) on npm, usually every Tuesday and Friday.
MDN staff then deploy the package to the MDN site, usually every Thursday (MDN never deploys to production on Fridays).

## Before you begin

Any project owner (or release designee) can complete the following steps to publish a new version.

The steps in this process assume:

- `NPM_TOKEN` is set in the repository secrets. If the token is invalidated or unset, a member of the `@mdn` organization on npm must [create a new token](https://docs.npmjs.com/creating-and-viewing-authentication-tokens) and [add it to the repository's secrets](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets#creating-encrypted-secrets-for-a-repository).
- You have cloned the mdn/browser-compat-data repository and you have the latest `main` branch checked out.
- You have permissions to merge pull requests and publish releases.
- You have [the `gh` CLI](https://cli.github.com/) installed.
- You have [`jq`](https://stedolan.github.io/jq/) installed.

## Performing a release

Releasing a new version of BCD is a two-step process: first, the release script is run to bump version number, generate the changelog, and create a pull request; then, once the pull request is merged, a release on GitHub is performed.

First, run `npm run release`. This will automatically perform all of the steps needed to release a new version of BCD. If user input is needed, the script will announce as such. Once the script is complete, a pull request to release a new version of BCD will be created from your GitHub account, which can be reviewed and merged.

Once you have gotten the applicable review on your PR, it's time to finish the release process:

1. Merge the pull request created by the script.

2. Start a [release on GitHub](https://github.com/mdn/browser-compat-data/releases).

   - In the _Tag version_ and _Release title_ fields, enter `vX.Y.Z` where `X.Y.Z` in the version number in `package.json`.
   - In the _Describe this release_ field, paste the release note text from `RELEASE_NOTES.md`, after (but not including) the release date.

3. Click **Publish release** to create the tag and trigger the workflow that publishes to npm. Wait for the release [GitHub Actions workflow](https://github.com/mdn/browser-compat-data/actions) to finish successfully.

4. Check [`@mdn/browser-compat-data` on npm](https://www.npmjs.com/package/@mdn/browser-compat-data) to see if the release shows up correctly. Note that this may take a while.

The package is now published and you have finished releasing BCD! 🎉
