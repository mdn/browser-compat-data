# Publishing a new version of `@mdn/browser-compat-data`

[Project owners](/GOVERNANCE.md#owners) publish new releases of [`@mdn/browser-compat-data`](https://www.npmjs.com/package/@mdn/browser-compat-data) on npm.
MDN staff [deploy the package to the MDN site](contributing.md#updating-compatibility-tables-on-mdn).
Usually, this happens every Thursday (MDN never deploys to production on Fridays).

## Before you begin

Any project owner (or release designee) can complete the following steps to publish a new version.

The steps in this process assume:

- `NPM_TOKEN` is set in the repository secrets. If the token is invalidated or unset, a member of the `@mdn` organization on npm must [create a new token](https://docs.npmjs.com/creating-and-viewing-authentication-tokens) and [add it to the repository's secrets](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets#creating-encrypted-secrets-for-a-repository).
- You have cloned the mdn/browser-compat-data repository and you have the latest `main` branch checked out.
- You have permissions to run GitHub Actions on the repository.
- You have [the `gh` CLI](https://cli.github.com/) installed.
- You have [`jq`](https://stedolan.github.io/jq/) installed.

## Prepare for an upcoming release

Anticipate a release by keeping a running draft pull request to prepare documentation and metadata for the release. See [#9466](https://github.com/mdn/browser-compat-data/pull/9466) as an example.

When a release is immenent:

1. Start a new branch for the upcoming release. For example, run `git switch -c release-YYYY-MM-DD`, where `YYYY-MM-DD` is the target release date.

2. Run `npm run release-pulls -- --labeled` to get a link to all of the labeled pull requests since the previous release to determine what type of version increment is needed (`major`, `minor` or `patch`). Most releases will increment `patch` only, but double-check these pull requests to determine if this release must be a `minor` or `major` increment for newly-introduced features or breaking changes (see [_Semantic versioning policy_](../README.md#semantic-versioning-policy)). (You will also need this information in step 4, so don't close the linked page yet!)

   A new `major` release (in other words, a release containing a breaking change) should only be released after extensive discussion. If a pull request containing a breaking change was seemingly merged without sufficient discussion and consensus, please confirm if the merge was intentional and has the majority of owner consensus before proceeding.

3. Increment the package version with `npm version --no-git-tag-version [major | minor | patch]` and commit the change.

   For example, to increment the version for a routine data update with no breaking changes or new features, run `npm version --no-git-tag-version patch`, then commit the changes to the package metadata files.

4. Run `npm run release-notes` — this command will take several minutes to finish — and copy standard output to `RELEASE_NOTES.md`.

5. From the link provided in step 2, confirm that all pull requests labeled `needs-release-note 📰` have been entered into the release notes (written manually, if necessary).

6. Add the release statistics to the release notes. Run `npm run release-stats` and complete the prompts, then copy the output and add it to `RELEASE_NOTES.md`.

7. Confirm all `TODO` comments in the `RELEASE_NOTES.md` file are completed and removed.

8. Commit your changes, push the release branch to your remote, and open a pull request on GitHub.

9. Confirm that CI passes before continuing.

10. If applicable or desired, seek a review.

You are now ready to perform the actual release!

## Perform the release

Now that you have created the PR and gotten the applicable review, you may now perform the release:

1. Merge the pull request you previously created.

2. Start a [release on GitHub](https://github.com/mdn/browser-compat-data/releases).

   - In the _Tag version_ and _Release title_ fields, enter `vX.Y.Z` where `X.Y.Z` in the version number in `package.json`.
   - In the _Describe this release_ field, paste the release note text from `RELEASE_NOTES.md`.

3. Click **Publish release** to create the tag and trigger the workflow that publishes to npm. Wait for the release [GitHub Actions workflow](https://github.com/mdn/browser-compat-data/actions) to finish successfully.

4. Check [`@mdn/browser-compat-data` on npm](https://www.npmjs.com/package/@mdn/browser-compat-data) to see if the release shows up correctly. Note that this may take a while.

The package is now published and you have finished releasing BCD! 🎉
