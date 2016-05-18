# browser-compat-data

This folder contains compatibility data for the [WebExtensions](https://developer.mozilla.org/Add-ons/WebExtensions) APIs.

It's a JSON file, structured as follows:

* one top level JSON object, which has one property for each WebExtensions API. The name of the property is the name of the module (for example, `"i18n"`, or `"downloads"`). The value is an `api` object.

* an `api` object has one property for each API element (each method, property, type, and event). The name of the property is the name of the element. For example, `"getMessage"` or `"create"`. The value is an `api-element` object.

* an `api-element` is an object with two properties, named: `"desktop_browsers"` and `"mobile_browsers"`. Each of these is a `browser-support` object.

* a `browser-support` object contains a property for each browser for which was are capturing support data.

    * For `"desktop_browsers"`, this is:
        * `"Chrome"`
        * `"Opera"`
        * `"Firefox"`
        * `"Edge"`
  
    * For `"mobile_browsers"`, it is:
        * `"Firefox OS"`
        * `"Firefox"`
        * `"Edge"`.

* each of these browser properties is a `support-statement`.

* a `support-statement` object has:

  * one mandatory property `"support"`, which is a string. This can be any of:
        * "Yes" (it is supported, but we don't know the version that added support)
        * "No"
        * "Unknown"
        * a version string

    * one optional property `"notes"`, which is an array of strings. This adds any extra information about support in this browser. It's a good idea to use different strings to comment on different aspects of support. For example: `["does not support 'byUser'", "explodes randomly"]`.
