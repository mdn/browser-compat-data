# browser-compat-data

This folder contains compatibility data for the [WebExtensions](https://developer.mozilla.org/Add-ons/WebExtensions) APIs.

It's a JSON file, structured as follows:

* one top level JSON object, which has one property for each WebExtensions module. The name of the property is the name of the module. The value is a module object.

* a module object has one property for each API element (each method, property, type, and event). The name of the property is the name of the element. The value is an API element object.

* an API element is an object with two properties, named: "desktop_browsers" and "mobile_browsers". Each of these is a browser support object.

* a browser support object contains a property for each browser for which was are capturing support data. For "desktop_browsers", this is: "Chrome", "Opera", "Firefox (Gecko)", and "Edge". For "mobile_browsers", it is: "Firefox OS", "Firefox Mobile (Gecko)", and "Edge".

* each of these browser properties has:

    * one mandatory property "support". This can be any of: "Yes", "No", "Unknown", or a version string. "Yes" means that we know it is supported, but we don't know the version that added support.

    * one optional property "notes" that adds any extra information about support in this browser
