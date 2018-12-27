# mdn-browser-compat-data — minus 404s

This repo is a fork of [https://github.com/mdn/browser-compat-data](https://github.com/mdn/browser-compat-data) that removes all MDN URLs in the `*.json` sources that are 404s, and adds a script for automating the removals.

To (re)run the script that performs the removals:

```
time node scripts/remove-mdn_url-404s.js
```
