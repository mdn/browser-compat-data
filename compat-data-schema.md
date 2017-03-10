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

__Note:__ The schema tries to capture as many constraints and rules about the
browser-compat-data JSON format. Nevertheless there are constraints that cannot
be described inside a schema, and won't be checked by automated tests. We tried
to mark such cases in the following text with a __Not enforced by the
schema__ notice.

## The JSON format

### Division in files
The browser-compat-data schema has been designed so the division in files doesn't
convey any meaning. That means that browser compatibility information about features
can be stored in one single large files or being divided in smaller files.

The division in separate files, themselves in different directories is guided
by making it easy to maintain by humans.

### Schema versioning
There one single information that is tied to each file, and is mandatory. It is
the version of schema used inside the file.

    {
      "version": "1.0.0",
      …
    }

We are using semantic versioning, so the version is a `string` containing three
integers separate by a dot (`.`). No whitespace or additional characters are
allowed.

* __1st digit change.__ We introduced a breaking change: some old values will no
longer validate.
* __2nd digit change.__ We introduced some novelty that are backward compatible:  
Old values still validate but some new values are now allowed.
* __3rd digit change.__ Bug fix that still allows old values to validate,
without introducing new ones: We optimized our schema to make it simpler and/or
faster and/or more readable without introducing new values nor breaking existing
ones, …

This versioning allows to transition to new schema without breaking
third-parties. The new schema is introduced, with some test schemas, third-party
tools (like MDN macros) are updated to support both the old and new schemas,
browser compat data is updated to the new schema, and finally the third-party
support for the old schema is removed.

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

    {
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

 In the MDN browser-compat case, it is:

 _Note: this list will evolve as we migrate our data_

     {
       "css": {
         "properties": {…}
         "pseudo-classes": {…}
         "pseudo-elements": {…}
         "at-rules": {…}
       },
       "html": {
         "elements": {
           …,
           "<element-name>": {
             …,
             "<attribute-name>": {…},
             …
           }
         }
         "global_attributes": {…}  
       }
     }

### Feature description

A feature is represented by an identifier containing the `"__compat"` property.
In this compat property, you'll find the list of sub-features associated to the
feature.

A feature has at least one sub-feature, representing the basic support. It is
always named `"basic"`.

The basic support feature represents the minimal set of functionality included
when a feature is qualified of 'supported'. What this represents depends of the
evolution of the feature over time, both in term of specification and of browser
support. Another way of seeing it is to consider `"support"` as representing all
the functionality of the feature that doesn't have its own sub-feature(s).

### Sub-feature

A sub-feature is the basic entity having browser compatibility information. As
explained in the previous paragraph, any feature has at least one sub-feature
called `'support'`, but it may many more.

A sub-feature may have three properties.

* __Sub-feature description__ contained in the `"desc"` property. It is a
`string` that contains a human-readable description of the sub-feature. As it is
intended to be used as a kind of caption or title for the feature, keep it short.
the `<code>` and `<a>`, as well as the macros `{{cssxref}}`, `{{HTMLElement}}`,
`{{htmlattrxref}}`, and `{{domxref}}` can be used. See the localization section
below for an explanation about how this string will be localized.
* __Compat information__ contained in the `"support"` property. It contains an
object listing the compat information for each browser. (See the description
below.)
* __Status information__ contained in the `"status"` object. It contains the
information about the stability of the sub-feature: Is it a functionality that
is standard? Is it stable? Has it been deprecated and shouldn't be used anymore
(See the description below.)

### The `"support"` object
Each sub-feature has support information. For each browser identifier, it
contains a compat object with the information about versions, prefixes or
alternate names, as well as notes.

The currently accepted browser identifiers are:
* `"android_webview"`, Webview, the former stock browser on Android,
* `"chrome"`, Google Chrome (on desktops),
* `"android_chrome"`, Google Chrome (on Android),
* `"edge"`, MS Edge (on Windows),
* `"mobile_edge"`, MS Edge, the mobile version,
* `"firefox`", Mozilla Firefox (on desktops),
* `"android_firefox"`, Firefox for Android, sometimes nicknamed Fennec,
* `"mobile_ie"`, Microsoft Internet Explorer, the mobile version,
* `"ie"`, Microsoft Internet Explorer (discontinued)
* `"opera"`, the Opera browser (desktop), based on Blink since Opera 15,
* `"android_opera"`, the Opera browser (Android version)
* `"safari"`, Apple Safari, on Mac OS,
* `"ios_safari"`, Apple Safari, on iOS,
* `"servo"`, the experimental Mozilla engine.

The following values are mandatory: `"chrome"`, `"opera"`, `"edge"`,
`"firefox"`, and `"android_firefox"`.

Each of these properties contains a `support-statement` object with the
practical compatibility information for this sub-feature and this browser.

### The `support-statement` object
This object is the key element of each browser compat information. It is a
support-statement object .It can either be an object of type
simple-support, or an array of simple-support objects, to cover more complex
cases.

Example of a simple-support compat object:

    {
      "support": { "version": "6.0" }
    }

Example of an advanced-support compat object:

    {
      "support": [
        {
          "version": "6.0"
        },
        {
          "prefix": "-moz-",
          "version": "3.5",
          "end_version": "9.0"
        }

      ]
    }

### Simple compat information: `"support"`
Compatibility information is stored in a support object. It may consist of the
following properties:

#### `"version"`
Contains a string with the version number the sub-feature has
been added (and is therefore supported), the Boolean values to indicate the
sub-feature is supported (`true`, with the additional meaning that the we don't
know in which version) or not (`false`). A value of `null` indicates that we
don't have support information for it.

* Support from version 3.5 (included)

      {
        "version": "3.5"
      }

* Support, but version unknown

      {
        "version": true
      }

* No support

      {
        "version": false
      }

* Support unknown (default value)

      {
        "version" : null
      }

#### `"end_version"`
Contains a string with the version number the sub-feature
stopped to be supported. It may be a Boolean value of (`true` or `false`), or the
`null` value. If `"version"` is set to a Boolean or a `string`, `"end_version"`
default value is `false`; if it is `null`, the default value of `"end-version"`
is `null` too.

* Removed in version 10 (start in 3.5):

      {
        "version": "3.5",
        "end_version": "10"
      }

* Not removed (default if `"version"` is not `null`):

     {
       "version": "3.5",
       "end_version": false
     }


#### `"prefix"`
Contains the prefix to add to the sub-feature name (default to the empty
string). Note that leading and trailing `-` must be included.

* Prefixed sub-feature:

      {
        "prefix": "-moz-",
        "version": "3.5"
      }

#### `"alternative_name"`
For the cases when prefixing is not enough, contains the whole name of the sub-feature. ( A
sub-feature may have a completely different name in some older version.

* Prefixed version had a different capitalization

      {
        "alternative_name": "mozRequestFullScreen",
        "version": "9.0"
      }

#### `"notes"`
Is an `array` of zero or more translatable `string` containing
additional pertinent information

* Indication of an experimental support behind a flag

      {
        "version" : false,
        "notes": [ "Experimental implementation available when <code>layout.css.text-align</code> is set to <code>true</code>." ]
      }

Each `string` that contains a human-readable description of the sub-feature. As
it is intended to be used as a kind of caption or title for the feature, keep it
short. the `<code>` and `<a>`, as well as the macros `{{cssxref}}`,
`{{HTMLElement}}`, `{{htmlattrxref}}`, and `{{domxref}}` can be used. See the
localization section below for an explanation about how this string will be
localized.

### Advanced compat information: array of `"support"`
Not all compatibility information can be described by one single value. Quite
often compatibility first appeared prefixed, before being unprefixed, and
finally having the prefix dropped. Even more complex cases, like initial
support, drop support, then reenabling support can happen.

To handle these case, an alternative to simple compat information has been
introduced: an `array` of these simple compat information can be given.

* Prefix support dropped a few versions after the full support was made
available:

      [
        {
          "prefix": "-moz-",
          "version": "3.5",
          "end_version": "23"
        },
        {
          "version": "12"
        }
      ]


### Status information
The status indicates the stability of the feature. It is an object named
`"status"` and has four mandatory properties:
* `"experimental"`, a `boolean` value that indicates this functionality is
intended to be an additon to the Web platform. Some features are added to
conduct tests.
* `"standardized"`, a `boolean` value indicating if the feature is in a
standard track.
* `"stable"`, a `boolean` value that indicates is the functionality is mature
enough, and if no significant incompatible changes is expected in the future.
* `"obsolete`", a `"boolean"` value that indicates if the functionality is only
kept for compatibility purpose and shouldn't be used anymore.

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

Entry 1. is done in this document.
