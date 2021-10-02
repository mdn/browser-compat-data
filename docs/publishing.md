# Publishing a new version of `@mdn/browser-compat-data`

[Project owners](/GOVERNANCE.md#owners) publish new releases of [`@mdn/browser-compat-data`](https://www.npmjs.com/package/@mdn/browser-compat-data) on npm.
MDN staff [deploy the package to the MDN site](contributing.md#updating-compatibility-tables-on-mdn).
Usually, this happens every Thursday (MDN never deploys to production on Fridays).

## Before you begin

Any project owner (or release designee) can complete the following steps to publish a new version, but please coordinate releases with [@ddbeck](https://github.com/ddbeck).

The steps in this process assume:

- `NPM_TOKEN` is set in the repository secrets. If the token is invalidated or unset, a member of the `@mdn` organization on npm must [create a new token](https://docs.npmjs.com/creating-and-viewing-authentication-tokens) and [add it to the repository's secrets](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets#creating-encrypted-secrets-for-a-repository).

## Prepare for an upcoming release

Anticipate a release by keeping a running draft pull request to prepare documentation and metadata for the release. See [#9466](https://github.com/mdn/browser-compat-data/pull/9466) as an example.

Start preparing a release when:

- the first pull request labeled [needs-release-note 📰](https://github.com/mdn/browser-compat-data/pulls?q=is%3Apr+label%3A%22needs-release-note+%3Anewspaper%3A%22+) has been merged after the most-recent release
- you're ready to issue a new release

whichever comes first.

1. Start a new branch for the upcoming release. For example, run `git switch -c release-YYYY-MM-DD`, where `YYYY-MM-DD` is the target release date.

2. Increment the package version with `npm version --no-git-tag-version` and commit the change.

   For example, to increment the version for a routine data update with no breaking changes or new features, run `npm version --no-git-tag-version patch`, then commit the changes to the package metadata files.

   If needed, you can repeat this step on the same branch, using a `minor` or `major` argument (instead of `patch`), to increment the version for newly-introduced features or breaking changes (see [_Semantic versioning policy_](../README.md#semantic-versioning-policy)).

3. Add a section for the upcoming release to [`RELEASE_NOTES.md`](../RELEASE_NOTES.md). Use the previous release as a template. Omit or leave a placeholder for the statistics.

4. Push the release branch to your remote, then open a draft pull request.

5. Until you're ready to issue a release, add more release notes to the draft pull request, when such changes are merged.

## Finalizing a release

When a release is imminent:

1. Confirm that all pull requests labeled [needs-release-note 📰](https://github.com/mdn/browser-compat-data/pulls?q=is%3Apr+label%3A%22needs-release-note+%3Anewspaper%3A%22+) have been entered into the release notes. Run `npm run release-pulls` to get a link to all of the since the previous release to `HEAD`.

2. Add the release statistics to the release notes. Switch to the `main` branch, then run `npm run release-stats`. After completing the prompts, copy the output, switch back to the release branch, and add the statistics to `RELEASE_NOTES.md`.

3. Push any outstanding changes to the release branch.

4. Mark the pull request as ready for review. If applicable or desired, seek a review, then merge the pull request.

The package is now ready to be published.

## Publish to npm

1. Start a draft [release on GitHub](https://github.com/mdn/browser-compat-data/releases).

   - In the _Tag version_ and _Release title_ fields, enter `vX.Y.Z` where `X.Y.Z` in the version number in `package.json`.
   - In the _Describe this release_ field, paste the release note text from `RELEASE_NOTES.md`.

   _Note_: If you're not ready to publish to npm, click **Save draft** in GitHub and resume this process later.

2. Click **Publish release** to create the tag and trigger the workflow that publishes to npm. Wait for the release [GitHub Actions workflow](https://github.com/mdn/browser-compat-data/actions) to finish successfully.

3. Check [`@mdn/browser-compat-data` on npm](https://www.npmjs.com/package/@mdn/browser-compat-data) to see if the release shows up correctly.

The package is now published.

## Wrap up

After the release is published, update tracking issues:

- [#6369](https://github.com/mdn/browser-compat-data/issues/6369) for every release, update with the results of `npm run stats api`
- [#3555](https://github.com/mdn/browser-compat-data/issues/3555) when there's significant progress, update with the results of `npm run stats`

You have finished releasing BCD! 🎉
