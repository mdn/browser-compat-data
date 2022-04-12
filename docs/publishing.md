# Publishing a new version of `@mdn/browser-compat-data`

[Project owners](/GOVERNANCE.md#owners) publish new releases of [`@mdn/browser-compat-data`](https://www.npmjs.com/package/@mdn/browser-compat-data) on npm.
MDN staff [deploy the package to the MDN site](contributing.md#updating-compatibility-tables-on-mdn).
Usually, this happens every Thursday (MDN never deploys to production on Fridays).

## Before you begin

Any project owner (or release designee) can complete the following steps to publish a new version.

The steps in this process assume:

- `NPM_TOKEN` is set in the repository secrets. If the token is invalidated or unset, a member of the `@mdn` organization on npm must [create a new token](https://docs.npmjs.com/creating-and-viewing-authentication-tokens) and [add it to the repository's secrets](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets#creating-encrypted-secrets-for-a-repository).
- You have cloned the mdn/browser-compatibility-data repository and you have the latest `main` branch checked out.
- You have [the `gh` CLI](https://cli.github.com/) installed.
- You have [`jq`](https://stedolan.github.io/jq/) installed.

## Prepare for an upcoming release

Anticipate a release by keeping a running draft pull request to prepare documentation and metadata for the release. See [#9466](https://github.com/mdn/browser-compat-data/pull/9466) as an example.

When a release is immenent:

1. Start a new branch for the upcoming release. For example, run `git switch -c release-YYYY-MM-DD`, where `YYYY-MM-DD` is the target release date.

2. Increment the package version with `npm version --no-git-tag-version` and commit the change.

   For example, to increment the version for a routine data update with no breaking changes or new features, run `npm version --no-git-tag-version patch`, then commit the changes to the package metadata files.

   If needed, you can repeat this step on the same branch, using a `minor` or `major` argument (instead of `patch`), to increment the version for newly-introduced features or breaking changes (see [_Semantic versioning policy_](../README.md#semantic-versioning-policy)).

3. Run `npm run release-notes` — this command will take several minutes to finish — and copy standard output to `RELEASE_NOTES.md`.

4. Run `npm run release-pulls` to get a link to all of the labeled pull requests since the previous release. Confirm that all pull requests labeled `needs-release-note 📰` have been entered into the release notes (written manually, if necessary). Remove the labels when release notes are complete.

5. Add the release statistics to the release notes. Switch to the `main` branch, then run `npm run release-stats`. After completing the prompts, copy the output, switch back to the release branch, and add the statistics to `RELEASE_NOTES.md`.

6. Confirm all `TODO` comments in the `RELEASE_NOTES.md` file are completed and removed.

7. Commit your changes, push the release branch to your remote, and open a pull request on GitHub.

8. Mark the pull request as ready for review.

9. Confirm that CI passes before continuing.

10. If applicable or desired, seek a review, then merge the pull request.

11. Start a [release on GitHub](https://github.com/mdn/browser-compat-data/releases).

    - In the _Tag version_ and _Release title_ fields, enter `vX.Y.Z` where `X.Y.Z` in the version number in `package.json`.
    - In the _Describe this release_ field, paste the release note text from `RELEASE_NOTES.md`.

12. Click **Publish release** to create the tag and trigger the workflow that publishes to npm. Wait for the release [GitHub Actions workflow](https://github.com/mdn/browser-compat-data/actions) to finish successfully.

13. Check [`@mdn/browser-compat-data` on npm](https://www.npmjs.com/package/@mdn/browser-compat-data) to see if the release shows up correctly.

The package is now published and you have finished releasing BCD! 🎉
