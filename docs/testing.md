# Testing, validating, and linting

## Code style

The JSON files should be formatted according to the [.editorconfig](https://github.com/mdn/browser-compat-data/blob/master/.editorconfig) file.

## Validating the data

All data in the repo must conform to the schema. The formal feature data schema is defined in [`compat-data.schema.json`](https://github.com/mdn/browser-compat-data/blob/master/schemas/compat-data.schema.json); see [`compat-data-schema.md`](https://github.com/mdn/browser-compat-data/blob/master/schemas/compat-data-schema.md) for more info. The browser data schema is defined in [`browsers.schema.json`](https://github.com/mdn/browser-compat-data/blob/master/schemas/browsers.schema.json); see [`browsers-schema.md`](https://github.com/mdn/browser-compat-data/blob/master/schemas/browsers-schema.md) for more info.

You can use `npm test` to validate data against the schema. You might need to install the `devDependencies` using `npm install`.
The JSON data is validated against the schema using [`ajv`](http://epoberezkin.github.io/ajv/).

## Rendering

You can use `npm run render $query $depth $aggregateMode` to output an HTML like it would be rendered on MDN.
The parameters are the same as the [`{{compat}}` macro](https://github.com/mdn/kumascript/blob/master/macros/Compat.ejs).

Paste the generated HTML into the MDN editor (source mode). You can use a new page, for example: https://developer.mozilla.org/en-US/docs/new and verify if the output looks correct.

## Statistics

To see how changes will affect the statistics of real, true, and null values, you can run `npm run stats`.  This generates a Markdown-formatted table of the percentages of real, true, and null values for the eight primary browsers that browser-compat-data is focusing on.
