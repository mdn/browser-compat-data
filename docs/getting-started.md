# Getting started

This document is intended to provide a basic rundown of the [compatibility data schema](../schemas/compat-data-schema.md) for new contributors. We recommend reading that document after this one to get a full understanding of the compat data structure.

## Compat data file

Each compat data file within BCD is a JSON file containing information about web features and their browser support. An example of a compat data file would be the following:

```js
{
  "css": {
    "properties": {
      "text-align": {
        "__compat": {
          // ...
        },
        "start": {
          "__compat": {
            // ...
          }
        },
        "end": {
          "__compat": {
            // ...
          }
        }
      }
    }
  }
}
```

Each compat data file defines a number of web features. Every feature is defined by a `__compat` object, which we will explain shortly.

## The `__compat` object

In BCD, every feature is defined using a `__compat` object, which contains information such as an optional description of the feature, a link to the associated MDN article, the specification URL(s), standard track status, and the browser support.

Here is an example of a `__compat` statement, with all of the properties and the common possible support statements.

```js
{
  "api": {
    "Document": {
      "fake_event": {
        "__compat": { // <---
          "description": "<code>fake</code> event", // A friendly description of the feature
          "mdn_url": "https://developer.mozilla.org/docs/Web/API/Document/fake_event", // The associated MDN article
          "spec_url": [ // The spec URL(s) for the feature if applicable, may be one or many
            "https://example.com/a-fake-spec#fake-event",
            "https://example.com/a-fake-spec#onfake"
          ],
          "support": { // The support data for each browser
            "chrome": { // Supported since Chrome 57 on
              "version_added": "57"
            },
            "chrome_android": "mirror", // Mirrors from Chrome Desktop, so "57"
            "edge": {  // Supported since Edge 12, with a note about a difference in behavior
              "version_added": "12",
              "notes": "Before Edge 79, the event interface included additional proprietary properties."
            },
            "firefox": { // Added in Firefox 59, then removed in Firefox 80 (AKA supported from 59 until 79)
              "version_added": "59",
              "version_removed": "80"
            },
            "firefox_android": { // Supported in Firefox Android, we just don't know what version it was added in
              "version_added": true
            },
            "ie": { // Supported since IE 10, but has a caveat that impacts compatibility
              "version_added": "10",
              "partial_implementation": true,
              "notes": "The <code>onfake</code> event handler property is not supported."
            },
            "oculus": "mirror",
            "opera": { // Not supported at all in Opera
              "version_added": false
            },
            "opera_android": { // We don't know if Opera Android supports this or not
              "version_added": null
            },
            "safari": [ // A support statement can be an array of multiple statements to better describe the compatibility story
              {
                "version_added": "13" // Supported since Safari 13...
              },
              {
                "version_added": "10.1", // ...but also supported since Safari 10.1 with the "webkit" prefix (AKA "webkitfake")...
                "prefix": "webkit"
              },
              {
                "version_added": "4", // ...and supported between Safari 4 (inclusive) and 10.1 (exclusive) as "webkitnonreal"
                "version_removed": "10.1",
                "alternative_name": "webkitnonreal"
              }
            ],
            "safari_ios": "mirror",
            "samsunginternet_android": "mirror",
            "webview_android": "mirror"
          },
          "status": { // Standards track, deprecation and experimental status
            "experimental": false,
            "standard_track": true,
            "deprecated": false
          }
        }
      }
    }
  }
}
```
