# Getting started

This document is intended to provide a basic rundown of the [compatibility data schema](../schemas/compat-data-schema.md) for new contributors. We recommend reading that document after this one to get a full understanding of the compat data structure.

## Compat data

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
