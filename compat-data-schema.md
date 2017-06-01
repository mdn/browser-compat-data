# The browser-compat-data JSON format

Maintained by the [MDN team at Mozilla](https://wiki.mozilla.org/MDN).

## Browser compatibility information
MDN needs the compatibility information for each feature of the Web platform. In
order to make it easier to maintain and easy to reuse by third-party tool, we
decided to store this data into a set of JSON files, stored in a git repository.

In order to ensure the coherence of the data, we define a JSON schema that
describes the content of the JSON files storing the info. Before accepting a
PR, we validate the changes against this schema with _travis-ci_.

This document describes the format in lay-man terms so that a human can create
a JSON browser-compat-data file without having to decrypt the schema from
scratch.

## The JSON format

### Division in files
The browser-compat-data schema has been designed so the division in files doesn't
convey any meaning. That means that browser compatibility information about features
can be stored in one single large files or being divided in smaller files.

The division in separate files, themselves in different directories is guided
by making it easy to maintain by humans.

### Schema versioning
There are two top-level properties that are mandatory. It is
the version of schema used inside the file, and the `"data"` property containing
the actual information:

    {
      "version": "1.0.0",
      "data": {
        …
      }
    }

We are using semantic versioning, so the version is a `string` containing three
integers separate by a dot (`.`). No whitespace or additional characters are
allowed. To see detail of the meaing fo the 3 integers, see the
[Semantic Versioning 2.0.0 specification](http://semver.org/).

The "data" contains a list of _features_, with their identifier, their description,
their support status, and thir status.

__Note:__ You cannot mix two schemas in the same file. `"version"` is unique in
a given file.

### Feature identifier
A _feature_ is a functionality of the platform. It is an entity that can be used
independently. A _sub-feature_ is a specific value or behavior of a feature. The
division is a bit arbitrary, but matches the way developers perceive features of
a platform

* For CSS, an entity like a property, a pseudo-class, a pseudo-element, an
at-rule, or a descriptor is a feature. A value, a new syntax change, or a
specific behavior, like if a property applies to a set of elements or another
are sub-features.

* For HTML, an element or an attribute are features, while specific values of an
attribute are sub-features.

* For Web APIs or JavaScript, an interface, a method, a property, a constructor
are features, while arguments or special values of an enumerated type are
sub-features.

Each feature is identified by a unique hierarchy of strings. E.g the
`text-align` property is identified by `css.properties.text-align`.

The strings of an identifier are not intended to be displayed and are therefore
not translatable.

In JSON, this gives:

    "data": {
      "css": {
        "properties": {
          "text-align": {…},
          …
        },
        …
      },
      …
    }

 That way, each feature is uniquely identifier, independently of the file it is
 defined in.

 The hierarchy of identifiers is not defined inside the schema. It is a
 convention of the project using the schema.

### Feature description

A feature is represented by an identifier containing the `"__compat"` property.
In this compat property, you'll find the list of sub-features associated to the
feature.

A feature has at least one sub-feature, representing the basic support. It is
always named `"basic_support"`.

The basic support feature represents the minimal set of functionality included
when a feature is qualified of 'supported'. What this represents depends of the
evolution of the feature over time, both in term of specification and of browser
support. Another way of seeing it is to consider `"basic_support"` as representing all
the functionality of the feature that doesn't have its own sub-feature(s).

### Sub-feature

A sub-feature is the basic entity having browser compatibility information. As
explained in the previous paragraph, any feature has at least one sub-feature
called `'basic_support'`, but it may many more.

A sub-feature may have three properties.

* An optional __Sub-feature description__ contained in the `"desc"` property. It is a
`string` that contains a human-readable description of the sub-feature. As it is
intended to be used as a kind of caption or title for the feature, keep it short.
The `<code>` and `<a>` HTML elements can be used. See the localization section
below for an explanation about how this string will be localized.
* A mandatory __Compat information__ contained in the `"support"` property. It contains an
object listing the compat information for each browser. (See the description
below.)
* An optional __Status information__ contained in the `"status"` object. It contains the
information about the stability of the sub-feature: Is it a functionality that
is standard? Is it stable? Has it been deprecated and shouldn't be used anymore
(See the description below.)

### The `"support"` object
Each sub-feature has support information. For each browser identifier, it
contains a "`support_statement`" object with the information about versions, prefixes or
alternate names, as well as notes.

The currently accepted browser identifiers are:
* `"webview_android"`, Webview, the former stock browser on Android,
* `"chrome"`, Google Chrome (on desktops),
* `"chrome_android"`, Google Chrome (on Android),
* `"edge"`, MS Edge (on Windows),
* `"edge_mobile"`, MS Edge, the mobile version,
* `"firefox`", Mozilla Firefox (on desktops),
* `"firefox_android"`, Firefox for Android, sometimes nicknamed Fennec,
* `"ie_mobile"`, Microsoft Internet Explorer, the mobile version,
* `"ie"`, Microsoft Internet Explorer (discontinued)
* `"opera"`, the Opera browser (desktop), based on Blink since Opera 15,
* `"opera_android"`, the Opera browser (Android version)
* `"safari"`, Apple Safari, on Mac OS,
* `"safari_ios"`, Apple Safari, on iOS,
* `"servo"`, the experimental Mozilla engine.

No value is mandatory.

Each of these properties contains a `support-statement` object with the
practical compatibility information for this sub-feature and this browser.

### The `"support-statement"` object
This object is the key element of each browser compat information. It is a
support-statement object. It is an array of `simple_support_statement` objects, but if there
are only one of them, the array can be ommitted


Example of an `simple_support_statement` compat object (with 2 entries):

    {
      "firefox": [
        {
          "version_added": "6.0"
        },
        {
          "prefix": "-moz-",
          "version_added": "3.5",
          "version_removed": "9.0"
        }

      ]
    }

Example of a `support` compat object (with 1 entry, array ommitted):

    {
      "ie": { "version_added": "6.0" }
    }

### Compat information in a `"simple_support_statement"` field.
Compatibility information is stored in a `"simple_support_statement"` field. It may consist of the
following properties:

#### `"version_added"`
This is the only mandatory property and it contains a string with the version number the sub-feature has
been added (and is therefore supported), the Boolean values to indicate the
sub-feature is supported (`true`, with the additional meaning that the we don't
know in which version) or not (`false`). A value of `null` indicates that we
don't have support information for it.

* Support from version 3.5 (included)

      {
        "version_added": "3.5"
      }

* Support, but version unknown

      {
        "version_added": true
      }

* No support

      {
        "version_added": false
      }

* Support unknown (default value)

      {
        "version_added" : null
      }

#### `"version_removed"`
Contains a string with the version number the sub-feature
stopped to be supported. It may be a Boolean value of (`true` or `false`), or the
`null` value. If `"version_added"` is set to a Boolean or a `string`, `"version_removed"`
default value is `false`; if it is `null`, the default value of `"version_removed"`
is `null` too.

* Removed in version 10 (start in 3.5):

      {
        "version_added": "3.5",
        "version_removed": "10"
      }

* Not removed (default if `"version_added"` is not `null`):

     {
       "version_added": "3.5",
       "version_removed": false
     }


#### `"prefix"`
Contains the prefix to add to the sub-feature name (default to the empty
string). Note that leading and trailing `-` must be included.

* Prefixed sub-feature:

      {
        "prefix": "-moz-",
        "version_added": "3.5"
      }

#### `"alternative_name"`
For the cases when prefixing is not enough, contains the whole name of the sub-feature. ( A
sub-feature may have a completely different name in some older version.

* Prefixed version had a different capitalization

      {
        "alternative_name": "mozRequestFullScreen",
        "version_added": "true",
        "version_removed": "9.0"
      }

#### `"flags"`
Is a specific object indicating what kind of flags must be set for this feature
to work. It consists of three values:
* `"type"`, an enum that indicates what kind of flag it is: `"preference"` represents
a flag that the user can set himself on its browser, like in `about:config` on Firefox;
or `"compile_flag"` that is a flag that has to be set before the compilation of the browser.
* `"name"`, a `string` representing the flag or preference to modify.
* `"value_to_set"` representing the actual to set the flag to. It is a string, that may be
converted to the right type (that is `true` or `false` for Boolean value, or `4` for an
integer valuie).

#### `partial_implementation`
Is a `boolean` value indicating if the implementation of the subfeature follows the current
spec close enough not to create major interoperability problem. It defaults to `false` (no
interoperability problem expected). If set `true`, it is recommended to add a note indicating
how it diverges from the standard (implement an old version of the standard, …)

#### `"notes"`
Is an `array` of zero or more translatable `string` containing
additional pertinent information. If there are only 1 entry in the array,
the array can be ommitted

* Indication of an experimental support behind a flag

      {
        "version_added" : false,
        "notes": "Experimental implementation available when <code>layout.css.text-align</code> is set to <code>true</code>."
      }

* Linking to a bug and indicating a restriction

      {
        "version_added": "3.5",
        "notes": ["See <a href='https://bugzil.la/123456'>bug 123456</a>.",
                  "Do not work on {{cssxref('::first-letter)}} pseudo-elements."]
      }

Each `string` that contains a human-readable description of the sub-feature. The
`<code>` and `<a>` HTML elements can be used. See the localization section
below for an explanation about how this string will be localized.

### Status information
The status indicates the stability of the feature. It is an object named
`"status"` and has four mandatory properties:
* `"experimental"`, a `boolean` value that indicates this functionality is
intended to be an addition to the Web platform. Some features are added to
conduct tests. Set to `false`, it means the functionality is mature, and no
significant incompatible changes is expected in the future.
* `"standard_track"`, a `boolean` value indicating if the feature is in a
standard track.
* `"obsolete`", a `"boolean"` value that indicates if the functionality is only
kept for compatibility purpose and shouldn't be used anymore. It may be removed
from the Web platform in the future.

## Localization
There is no localization happening inside the .json files themselves; l10n is
handled separately in order to take advantage of existing toolchains.

In the case of MDN, .po files with the translated string will be created. We
will work on them once the prototype validating the structure of the json will
be done.

The plan is:

1. Define all source strings as English in the spec, as well as which data elements are plain text, HTML, etc.  Avoiding HTML is a good idea, but being clear about it is necessary if you can't avoid it.
2. Create a script to extract strings into the standard gettext format
3. Manage translation using gettext conventions, like Kuma, perhaps even using Pontoon to translate the strings. With gettext, you get fuzzy translations, notifications of changed strings, etc. etc. for free.
4. Create a second script to export gettext-formatted files to a JSON data structure.
5. Implement a gettext-like translation in KumaScript (I'm pretty sure this is already done, and multiple times).

1. is done in this document.
