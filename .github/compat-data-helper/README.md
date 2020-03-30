# compat-data-helper

> A GitHub App built with [Probot](https://github.com/probot/probot), to manage PRs on mdn/browser-compat-data.

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Deployment

We're deploying on Glitch, at least for now. Here's a strategy to update that deployment:

1. Open the project page on Glitch.
2. Click **Tools** > **Full Page Console**.
3. Run the following commands:

   ```bash
   $ cd ~
   $ BCD_BOT_SRC=$(mktemp -d)

   # use GitHub's SVN support to export only the bot source
   $ svn export --force https://github.com/mdn/browser-compat-data/trunk/.github/compat-data-helper $BCD_BOT_SRC

   # sync the files to /app (the home directory)
   $ rsync -av $BCD_BOT_SRC/ ~

   # if you've deleted files with recent changes, then you'll need to delete them manually, at this point
   # rm ./someDeletedFile.js

   # refresh the changes to the Glitch editor (this will also reboot the app)
   $ refresh
   ```

The latest version of the bot is now running.
