# The collector report JSON schema

This document details the structure of reports produced by https://mdn-bcd-collector.appspot.com/, https://mdn-bcd-collector.gooborg.com/, and potentially other tooling.

## JSON structure

Below is an example of the report data:

```json
{
  "__version": "9.3.1",
  "results": {
    "https://mdn-bcd-collector.example/tests/": [
      {
        "exposure": "ServiceWorker",
        "name": "api.AbortController.AbortController",
        "result": false
      },
      {
        "exposure": "Window",
        "message": "threw TypeError: Array.isArray is not a function",
        "name": "api.AbortController.AbortController",
        "result": null
      }
    ]
  },
  "userAgent": "Mozilla/5.0 (Windows; U; Windows NT 5.0; en-US; rv:1.8) Gecko/20051111 Firefox/1.5"
}
```

## Properties

### `exposure`

The `exposure` string is a required property. It must be one of four values whether the test was executed in a window (`"Window"`), dedicated worker (`"Worker"`), shared worker (`"SharedWorker"`) or service worker (`"ServiceWorker"`).

### `message`

The `message` string is a required property if `result` is `null` and optional if `result` is a `boolean`.

The message can be an error message from the browser or from the test framework, for example "threw TypeError: Failed to construct 'Notification': Illegal constructor." or "Browser does not support detection methods" respectively.

### `name`

The `name` string is a required property and represents the feature identifier the result is for. The identifier is a dot-separated path commonly used in BCD. For example, "javascript.builtins.Array.at" refers to the feature at `{"javascript": {"builtins": {"Array": {"at": {"__compat": ...}}}}}`.

### `result`

The `result` boolean or `null` value is a required property indicating if the tested feature under the given `exposure` is present, not present, or cannot be determined by the test.

### `__version`

The `__version` string is a required property and the version of mdn-bcd-collector that collected the report.

### `results`

The `results` object is a required property and maps the collection page endpoint to an array of test results. There must be at least one key in the map.

### `userAgent`

The `userAgent` string is a required property and states the user agent of the tested browser the results were collected from.
