# Data guidelines for when to add features

This file contains specific guidelines on when to add features to BCD, and the various types of features tracked in BCD.

## Glossary

- Feature: some trackable feature supported in a browser or runtime
- Subfeature: any feature whose support is directly dependent on a parent (for example, the property of an interface)
- Top-level feature: a feature that lives at the top of a category (for example, an interface, a CSS property, etc.)
- Behavioral feature: a feature that describes the behavior of the browser or runtime (for example, security requirements, sorting, worker support, etc.)
- Parameter feature: a feature that describes the support for a return type, method parameter, property value, etc.

## Adding features and subfeatures

A JSON file should be created for every _top level feature_ that has support in any of the browsers or runtimes tracked in BCD. For Web APIs, the top level features are individual Web API interfaces.

A possible structure for a Web API is shown below:

```
category                // category name (always `api` for API interfaces)
  interface               // top level feature
    properties              // subfeature, add if supported
      property values         // parameter subfeature, add all of them if not all values were supported since property was introduced
    methods                // subfeature, add if supported
      parameters              // parameter subfeature, add all of them if not all parameters were supported since method was introduced
        parameter options       // parameter subfeature, add all of them if not all parameter options were supported since property was introduced
        parameter type          // parameter subfeature, add all of them if not all parameter types were supported since property was introduced
    support in workers     // behavioral subfeature, add if compatibility is different (might also just be on specific methods)
```

The interface must include subfeatures for _all_ its properties and methods that have an implementation in at least one of the supported browsers, whether or not they were added at the same time as the parent interface.

All other code and behavioral aspects of the interface are given nested nodes **only** if their compatibility is _different_ to that of their parent feature. This applies to method arguments, method argument options, and behavior changes like the addition of support for workers, or the type of return value.

> [!TIP]
> A good rule of thumb is that if a behavioral subfeature has the same compatibility information as its parent, then the subfeature is not needed.
> Another good rule of thumb is that if the signature of a method changes to introduce new parameters, then all parameters should be documented.

Here is an example scenario:

- An interface is defined in a specification with a method that has two parameters.
- A supported browser implements the method and both the parameters:
  - A feature node is created for the method (by default)
  - Subfeature nodes are not created for the method parameters because they were created in the same version as the methods; there is no compatibility change.
- Another browser implements the methods, but only one of the parameters.
  - A subfeature node is added to the method parameter that was supported by _both_ browsers.
  - Another subfeature node is added to the method parameter that was _not_ supported by the second browser.
- Yet another browser implements the method with a new parameter.
  - A method subfeature is added for the new parameter because it was added in a different version than the parent method.
- The browser changes to require that the interface now can be used in workers:

  - A "supported in workers" subfeature is added to the interface feature because this is a change in compatibility.

    > [!NOTE]
    > If all browsers implemented worker support in their first implementation, then no subfeature would be required. It is only when any browser does something different that the subfeature is required.
