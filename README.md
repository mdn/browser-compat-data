# mdn-browser-compat-data — plus spec data

This repo is a fork of
[https://github.com/mdn/browser-compat-data](https://github.com/mdn/browser-compat-data)
that adds spec URLs in the `*.json` sources for all features that have an
`mdn_url` for an article with a _Specifications_ table.

To (re)generate the additional data for all features:

```
time node scripts/add-specs.js fullupdate 2>&1 | tee LOG
```

To (re)generate the additional data only for features that don’t already
have spec URLs in the `*.json` sources:

```
time node scripts/add-specs.js 2>&1 | tee LOG
```
