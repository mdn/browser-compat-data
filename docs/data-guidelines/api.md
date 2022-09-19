# Data guidelines for API features

This file contains guidelines that are specific to the web API features (`api/`).


## Adding features and subfeatures

A json file should be created for every _top level feature_ that has a released public implementation on one of the supported set of browsers (and not before).
For Web APIs the top level features are individual Web API interfaces and the children of namespace objects like `Intl`.

A possible structure for a Web API is shown below. 

```
api                           // category - always api for Web APIs
  interface                   // top level feature
    properties               // feature: required
    methods                  // feature: required
       parameters             //   subfeature: compatibility is different
         parameter options    //   subfeature: if compatibility is different
    support in workers     // subfeature: if compatibility is different (might also just be on specific methods)
```

The interface must include subnodes for _all_ its properties and methods (that have an implementation in at least one of the supported browsers), whether or not they were added at the same time as the parent interface, and hence share the same compatibility information.

All other code and behavioral aspects of the interface are given nested nodes **only** if their compatibility is _different_ to that of their parent feature.
This applies to method arguments, method argument options, and behaviour changes like the addition of support for workers, or the type of return value.

> **Note:** Items that must be given nodes are referred to as "features", while those that are only created when there is a compatibility difference to the parent are called _subfeatures_.

> **Tip:** A good rule of thumb is that if a subfeature has the same compatibility information as its parent, then the subfeature is not needed.

Here is an example scenario:

- An interface is defined in a specification with a method (feature) that has two parameters (subfeatures).
- A supported browser implements the method and both the parameters:
  - A feature node is created for the method (by default)
  - Subfeature nodes are not created for the method parameters because they were created in the same version as the methods; there is no compatibility change.
- Another browser implements the methods, but only one of the parameters.
  - A subfeature node is added to the method parameter that was _not_ supported by the second browser.
- Yet another browser implements the method with a new parameter. 
  - A method subfeature is added for the new parameter because it was added in a different version than the parent method.
- The browser changes to require that the interface now can be used in workers:
  - A "supported in workers" subfeature is added to the interface feature because this is a change in compatibility.

    > **Note:** If all browsers implemented worker support in their first implementation then no subfeature would be required.
    > It is only once a browser does something different that the subfeature is created.

## Constants

Don't include data for constants in BCD. The rationale for not including them is that they're not known to be a source of any compatibility issues.

For example, although the UI Events specification defines a [`DOM_KEY_LOCATION_STANDARD`](https://w3c.github.io/uievents/#dom-keyboardevent-dom_key_location_standard) constant, we don't include data for it in BCD.

This guideline was proposed in [#7936](https://github.com/mdn/browser-compat-data/issues/7585), based in part on previous discussion in [#7585](https://github.com/mdn/browser-compat-data/issues/7585).

## Mixins

[Interface mixins](https://webidl.spec.whatwg.org/#idl-interface-mixins) in Web IDL are used in specifications to define Web APIs. For web developers, they aren't observable directly; they act as helpers for web browser engineers to avoid internally repeating API definitions. Add mixin members directly to the corresponding interface they're exposed on.

For example, [`HTMLHyperlinkElementUtils`](https://html.spec.whatwg.org/multipage/links.html#htmlhyperlinkelementutils) is a mixin defined in the HTML specification.

Members of this mixin are available to `HTMLAnchorElement` and `HTMLAreaElement`, so that's where BCD exposes them. As such, members of `HTMLHyperlinkElementUtils` should be added directly to the `api/HTMLAnchorElement.json` and `api/HTMLAreaElement.json` files as if they were regular members of these interfaces.

This guideline was proposed in [#8929](https://github.com/mdn/browser-compat-data/issues/8929), based in part on previous discussion in [#472](https://github.com/mdn/browser-compat-data/issues/472).

## Callback interfaces and functions

Don't add unexposed callbacks as features in `api`. If needed, represent callbacks as subfeatures of relevant methods or properties.

Callback [functions](https://webidl.spec.whatwg.org/#idl-callback-functions) and [interfaces](https://webidl.spec.whatwg.org/#idl-callback-interfaces) (denoted by `callback` and `callback inferface` in Web IDL) are used in specifications to define Web APIs. Where defined without the `[Exposed]` attribute, they aren't observable directly to web developers.

For example, [`addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) is specified as taking an `EventListener` callback. Since `EventListener` is specified as an unexposed `callback interface EventListener`, it would be represented as a subfeature of `api.EventTarget.addEventListener`.

This guideline is based on a discussion in [#3068](https://github.com/mdn/browser-compat-data/issues/3068) and was proposed in [#14302](https://github.com/mdn/browser-compat-data/pull/14302).

## Global APIs

An API is considered global when it is available for both [`Window`](https://developer.mozilla.org/en-US/docs/Web/API/Window) and [`WorkerGlobalScope`](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope). Such APIs are recorded in the `api/_globals/` folder.

For example, the [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) method is global, recorded like this in `api/_globals/fetch.json`:

```json
{
  "api": {
    "fetch": {
      "__compat": {},
      "worker_support": {
        "__compat": {
          "description": "Available in workers",
          "support": {}
        }
      }
    }
  }
}
```

All APIs defined on the [`WindowOrWorkerGlobalScope`](https://html.spec.whatwg.org/multipage/webappapis.html#windoworworkerglobalscope-mixin) mixin are considered global.

Note that APIs available on only _some_ types of workers are not considered global. For example:

- The `cookieStore` property, available in `Window` and `ServiceWorkerGlobalScope`.
- The `requestAnimationFrame()` function, available in `Window` and `DedicatedWorkerGlobalScope`.

This guideline is based on a discussion in [#11518](https://github.com/mdn/browser-compat-data/pull/11518).

## Constructors

Name a constructor for an API feature the same as the parent feature (unless the constructor doesn't share the name of its parent feature) and have a description with text in the form of `<code>Name()</code> constructor`.

For example, the `ImageData` constructor, `ImageData()`, is represented as `api.ImageData.ImageData`. It has the description `<code>ImageData()</code> constructor`, like this:

```json
{
  "api": {
    "ImageData": {
      "__compat": {},
      "ImageData": {
        "__compat": {
          "description": "<code>ImageData()</code> constructor",
          "support": {}
        }
      }
    }
  }
}
```

## DOM events (`eventname_event`)

Add DOM events as features of their target interfaces, using the name _eventname_\_event with the description text set to `<code>eventname</code> event`. If an event can be sent to multiple interfaces, add the event as a feature of each interface that can receive it.

For example, the feature for a `focus` event targeting the `Element` interface would be named `focus_event` with the description text `<code>focus</code> event`, like this:

```json
{
  "api": {
    "Element": {
      "__compat": {},
      "focus_event": {
        "__compat": {
          "description": "<code>focus</code> event",
          "support": {}
        }
      }
    }
  }
}
```

The event handler `onfocus` is represented by the `focus_event` entry. Don't create features for `on` event handler properties. If an implementation doesn't support the event handler property, use `partial_implementation` with the note `"The <code>onfocus</code> event handler property is not supported."`. If only the `on` event handler property is supported and not the event itself, use `"version_added": false`.

If a specification has two sections (the event handler property and the event name), add both specification links.

This practice emerged through several discussions:

- [#935](https://github.com/mdn/browser-compat-data/issues/935#issuecomment-464691417)
- [#3420](https://github.com/mdn/browser-compat-data/pull/3420)
- [#3469](https://github.com/mdn/browser-compat-data/pull/3469)
- [mdn/content#9098](https://github.com/mdn/content/discussions/9098)
- [#13595](https://github.com/mdn/browser-compat-data/pull/13595)

## Permissions API permissions (`permissionname_permission`)

Add [Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API) permissions as subfeatures of [`api.Permissions`](https://developer.mozilla.org/en-US/docs/Web/API/Permissions) using the name _permissionname_\_permission with the description text set to `<code>permissionname</code> permission`.

For example, the Geolocation permission is named `geolocation_permission` with the description text `<code>geolocation</code> permission`, like this:

```
{
  "api": {
    "Permissions": {
      "__compat": { ... },
      "geolocation_permission": {
        "__compat": {
          "description": "<code>geolocation</code> permission",
          "support": { ... }
        }
      }
    }
  }
}
```

This guideline was proposed in [#6156](https://github.com/mdn/browser-compat-data/pull/6156).

## Methods returning promises (`returns_promise`)

When a method returns a promise in some (but not all) browser releases, use a subfeature named `returns_promise` with description text `Returns a <code>Promise</code>` to record when the method returns a promise.

For example, `HTMLMediaElement`'s `play()` method returns a promise, recorded like this:

```json
{
  "api": {
    "HTMLMediaElement": {
      "__compat": {},
      "play": {
        "__compat": {},
        "returns_promise": {
          "__compat": {
            "description": "Returns a <code>Promise</code>",
            "support": {}
          }
        }
      }
    }
  }
}
```

This guideline is based on a discussion in [#11630](https://github.com/mdn/browser-compat-data/pull/11630).

## Secure context required (`secure_context_required`)

Use a subfeature named `secure_context_required` with the description text `Secure context required` to record data about whether a feature requires HTTPS. For example, the `ImageData` API requires a secure context, recorded like this:

```json
{
  "api": {
    "ImageData": {
      "__compat": {},
      "secure_context_required": {
        "__compat": {
          "description": "Secure context required",
          "support": {}
        }
      }
    }
  }
}
```

This convention is discussed in more detail in [#190](https://github.com/mdn/browser-compat-data/issues/190).

## Web Workers (`worker_support`)

Use a subfeature named `worker_support` with description text `Available in workers` to record data about an API's support for Web Workers.

For example, the `ImageData` API has worker support, recorded like this:

```json
{
  "api": {
    "ImageData": {
      "__compat": {},
      "worker_support": {
        "__compat": {
          "description": "Available in workers",
          "support": {}
        }
      }
    }
  }
}
```

Formerly named `available_in_workers`, this policy was set in [#2362](https://github.com/mdn/browser-compat-data/pull/2362).

## APIs moved on the prototype chain

[Web IDL interfaces](https://webidl.spec.whatwg.org/#idl-interface) (and [JavaScript built-in objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)) form prototype chains, with one type inheriting from another. For example, `AudioContext` inherits from `BaseAudioContext`, and `Element` inherits from `Node`.

Some of these interfaces are [abstract](https://en.wikipedia.org/wiki/Abstract_type) and never have instances, while most are concrete and can be instantiated. For example, `BaseAudioContext` and `Node` are abstract, while `AudioContext` and `Element` are concrete.

When attributes and methods are moved between interfaces in specifications and implementations, BCD should make the corresponding change. This guideline covers which versions to use, and whether to use `partial_implementation` and notes in the resulting compat data.

### When members are moved up the prototype chain

For interface members, use the version when the member is first supported on any concrete interface, regardless of where in the prototype chain the member is, even if that is earlier than the existence of the current interface. If there are any concrete interfaces where the member wasn't supported before the move, then use `partial_implementation` and notes.

For interfaces, use the version when the interface itself is first supported. If there are members supported earlier than the interface itself was introduced, then use `partial_implementation` and notes for that range of versions.

For example, most members of `AudioContext` have moved to a new `BaseAudioContext` parent interface. The data was recorded like this:

- The members were removed from `AudioContext` and added to `BaseAudioContext`.
- Since some of the members were supported on `AudioContext` earlier than on `BaseAudioContext`, `partial_implementation` and notes are used for `BaseAudioContext` for that range of versions.
- Full `BaseAudioContext` support (without `partial_implementation`) is recorded as separate entries from the versions when the `BaseAudioContext` interface itself is supported.

See [#9516](https://github.com/mdn/browser-compat-data/pull/9516) for a part of this data being fixed, and [#9479](https://github.com/mdn/browser-compat-data/pull/9479) for another example.

### When members are moved down the prototype chain

Use the version when the member is first supported on the current interface, regardless of where in the prototype chain the member is. No `partial_implementation` or notes about the move are needed.

For example, some attributes have moved from `Node` to `Attr` and `Element`. The data was recorded like this:

- The members were removed from `Node` and added to `Attr` and `Element`.
- Support is recorded from when the members were first available via `Node`, without any notes.

See [#9561](https://github.com/mdn/browser-compat-data/pull/9561) for a part of this data being fixed.

This guideline is based on a discussion in [#3463](https://github.com/mdn/browser-compat-data/issues/3463).
