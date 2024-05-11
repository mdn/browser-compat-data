# Data guidelines for when to add features

This file contains specific guidelines on when to add features to BCD, and the various types of features tracked in BCD.

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
