# Migrations

From time to time, we make changes that must modify many files in [mdn/browser-compat-data](https://github.com/mdn/browser-compat-data/). We approach such changes like database migrations: automate the change, test that it works, and apply the change at a time that minimizes disruption to others. Using this process saves time (compared to manually creating and reviewing changes) and improves data quality.

Follow this process for changes that are amenable to automation, affects many files, and modifies existing data. If you want to make smaller-scale changes or changes that aren’t compatible with automation, open a pull request or issue instead.

## Step 1: Announce your intent

In a new or existing issue, announce your intent to complete a migration. This issue is where the overall migration process will be discussed and tracked.

A good migration starts with a clear description of the changes to be made, with a focus on one kind of change at a time. Using a checklist to plan and track progress can be helpful. Finally, consider awaiting feedback before proceeding to the next step.

## Step 2: Create and test the migration scripts

Next, create a migration script and tests for that script.

Put migration scripts in the [`/scripts/migrations/`](../scripts/migrations) directory. Name the scripts in the pattern `###-<description>.js` where `###` is the sequential number of the migration and `<description>` is a short name for the migration. For example, the first migration was `001-sort-features.js`.

The script must be accompanied by one or more tests that demonstrate that the migration makes the changes described and doesn’t introduce other, unrelated changes. Typically, tests in the `/scripts/migrations/` directory are named in the form `###-<description>.test.js`.

When the script and tests are ready, open a pull request. To be accepted, the PR must be reviewed and approved by at least one [project owner](../GOVERNANCE.md#owners).

## Step 3: Migrate

After the migration script is merged, schedule a time with a project owner to complete the migration. At the scheduled time, one project participant will run the migration script and open a PR; the owner will merge it.

To find a good time to run the migration, review open pull requests for potential conflicts. If there are large manual PRs still in review, consider allowing time for those to be merged before completing the migration.

## Step 4: Wrap up

If applicable, follow the migration with a pull request to apply new linter checks or other quality enforcement tools related to the migration.

Finally, celebrate by announcing the completion of the project in the original issue!
