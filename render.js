
function render(dataOrString, renderer, configuration) {

    /* Convert a string to the BCD data */
    let data = undefined;
    if (typeof dataOrString === 'string' || dataOrString instanceof String) {
        const dataParts = dataOrString.split('.');
        data = require('.');
        dataParts.forEach((elem) => {
            data = data[elem] || {};
        });
    } else {
        data = dataOrString;
    }
    return renderer(data, configuration);
}

function usage() {
    const usageString = `Render a feature as an HTML table.

Usage:
 npm run render <featurePath> [depth] [aggregateMode]

Options:

 featurePath: Dotted path to feature
 depth: Traversal depth
 aggregateMode: skip "Basic Support" row

Examples:

 npm run render webextensions.api.alarms
 npm run --silent render webextensions.api.alarms > test.html
 npm run render http.status.404
 npm run render webextensions.api.alarms 3 true
`;
    console.log(usageString);
}


function main() {
    const bcd = require('.');
    const query = process.argv[2];
    const depth = process.argv[3] || 1;
    const aggregateMode = process.argv[4] || false;

    if (query === undefined) {
        usage();
        process.exit(0);
    }

    const html = render(
        query,
        bcd.renderers.mdnFeatureTable,
        {
            'query': query,
            'depth': depth,
            'aggregateMode': aggregateMode,
        });
    console.log(html);
}

module.exports = render;
if (require.main === module) main();
