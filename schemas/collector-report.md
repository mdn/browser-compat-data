# The collector report JSON schema

This document details the structure of reports collected by https://github.com/foolip/mdn-bcd-collector and stored in https://github.com/foolip/mdn-bcd-results.

## JSON structure

Below is an example of the report data:

```json
{
  "__version": "6.2.7",
  "results": {
    "https://mdn-bcd-collector.appspot.com/tests/": [
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

The `exposure` string is a required property. It must be one of four values whether the test was executed in a window (`"Window"`), web worker (`"Worker"`), shared worker (`"SharedWorker"`) or service worker (`"ServiceWorker"`).

### `message`

The `message` string is a required property if `result` is `null`.

Some example messages are:

```js
"threw TypeError: Failed to construct 'Notification': Illegal constructor.";
'Testing CanvasRenderingContext2D in workers is not yet implemented';
'Browser does not support detection methods';
```

### `name`

The `name` string is a required property and represents the feature identifier the result is for. The identifier is made of dot-separated elements. For example `"javascript.builtins.Array.at"` points to feature in BCD under `{"javascript": {"builtins": {"Array": {"at": {"__compat": ...}}}}}`.

### `result`

The `result` boolean or `null` value is a required property indicating if the tested feature under the given `exposure` is present, not present, or cannot be determined by the test.

### `__version`

The `__version` string is a required property and the version of https://github.com/foolip/mdn-bcd-collector that collected the report.

### `results`

The `results` object is a required property and maps the collection page endpoint to an array of test results. There must be at least one key in the map. Each key must start with `https://mdn-bcd-collector.appspot.com/tests/`.

### `userAgent`

The `userAgent` string is a required property and states the user agent of the tested browser the results were collected from.
