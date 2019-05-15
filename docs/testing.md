# Testing, validating, and linting

## Code style

The JSON files should be formatted according to the [.editorconfig](https://github.com/mdn/browser-compat-data/blob/master/.editorconfig) file.

## Validating the data
You can use `npm test` to validate data against the schema. You might need to install the `devDependencies` using `npm install`.
The JSON data is validated against the schema using [`ajv`](http://epoberezkin.github.io/ajv/).

## Rendering

You can use `npm run render $query $depth $aggregateMode` to output an HTML like it would be rendered on MDN.
The parameters are the same as the [`{{compat}}` macro](https://github.com/mdn/kumascript/blob/master/macros/Compat.ejs).

Paste the generated HTML into the MDN editor (source mode). You can use a new page, for example: https://developer.mozilla.org/en-US/docs/new and verify if the output looks correct.
