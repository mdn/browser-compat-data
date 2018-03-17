/*

Migrated from https://github.com/mdn/kumascript/master/macros/CompatBeta.ejs

Run as render(data, configuration), where config gives rendering configuration.

Required configuration:

- query: The full querystring for the data, such as webextensions.api.alarms

Optional configuration:

- depth: How deep subfeatures should be added to the table
- strings: Replacements for the default strings, such as localized strings
- forMDNURL: The MDN URL that the table will be displayed on.
  If given, use relative links, but avoid linking to that page.
  If omitted (default), use external links to MDN.

Sample:

render(bcd.webextensions.api.alarms, {'query': 'webextensions.api.alarms'});
*/

const defaultStrings = {
  "bc_history_head": "Implementation Notes",
  "bc_icon_name_altname": "Alternate Name",
  "bc_icon_name_chrome": "Chrome",
  "bc_icon_name_chrome_android": "Chrome for Android",
  "bc_icon_name_deprecated": "Deprecated",
  "bc_icon_name_desktop": "Desktop",
  "bc_icon_name_disabled": "Disabled",
  "bc_icon_name_edge": "Edge",
  "bc_icon_name_edge_mobile": "Edge Mobile",
  "bc_icon_name_experimental": "Experimental",
  "bc_icon_name_firefox": "Firefox",
  "bc_icon_name_firefox_android": "Firefox for Android",
  "bc_icon_name_footnote": "Notes",
  "bc_icon_name_ie": "Internet Explorer",
  "bc_icon_name_mobile": "Mobile",
  "bc_icon_name_nodejs": "Node.js",
  "bc_icon_name_non-standard": "Non-standard",
  "bc_icon_name_opera": "Opera",
  "bc_icon_name_opera_android": "Opera for Android",
  "bc_icon_name_prefix": "Prefixed",
  "bc_icon_name_safari": "Safari",
  "bc_icon_name_safari_ios": "iOS Safari",
  "bc_icon_name_samsunginternet_android": "Samsung Internet",
  "bc_icon_name_server": "Server",
  "bc_icon_name_webview_android": "Android webview",
  "bc_icon_title_altname": "Uses the non-standard name: <code>$1$</code>",
  "bc_icon_title_deprecated": "Deprecated. Not for use in new websites.",
  "bc_icon_title_disabled": "User must explicitly enable this feature.",
  "bc_icon_title_experimental": "Experimental. Expect behavior to change in the future.",
  "bc_icon_title_footnote": "See implementation notes",
  "bc_icon_title_non-standard": "Non-standard. Expect poor cross-browser support.",
  "bc_icon_title_prefix": "Requires the vendor prefix: $1$",
  "feature": "Feature",
  "feature_basicsupport": "Basic support",
  "legend": "Legend",
  "legend_altname": "Uses a non-standard name.",
  "legend_deprecated": "Deprecated. Not for use in new websites.",
  "legend_disabled": "User must explicitly enable this feature.",
  "legend_experimental": "Experimental. Expect behavior to change in the future.",
  "legend_footnote": "See implementation notes.",
  "legend_non-standard": "Non-standard. Expect poor cross-browser support.",
  "legend_prefix": "Requires a vendor prefix or different name for use.",
  "supportsLong_no": "No support",
  "supportsLong_partial": "Partial support",
  "supportsLong_unknown": "Compatibility unknown",
  "supportsLong_yes": "Full support",
  "supportsShort_no": "No",
  "supportsShort_partial": "Partial",
  "supportsShort_unknown": "?",
  "supportsShort_unknown_title": "Compatibility unknown; please update this.",
  "supportsShort_yes": "Yes",
  "supportsShort_yes_title": "Please update this with the earliest version of support.",
  "no_data_found": 'No compatibility data found. Please contribute data for "${query}" (depth: ${depth}) to the <a href="https://github.com/mdn/browser-compat-data">MDN compatibility data repository</a>.',
}
const browsers = {
  "desktop": ['chrome', 'edge', 'firefox', 'ie', 'opera', 'safari'],
  "mobile": ['webview_android', 'chrome_android', 'edge_mobile', 'firefox_android', 'opera_android', 'safari_ios', 'samsunginternet_android'],
  "server": ['nodejs'],
  "webextensions-desktop": ['chrome', 'edge', 'firefox', 'opera'],
  "webextensions-mobile": ['firefox_android']
};

/* The rendering function */
function render(compatData, configuration) {
  const query = configuration.query;
  const depth = configuration.depth || 1;
  const forMDNURL = configuration.forMDNURL;
  let output = '';
  const category = query.split(".")[0];
  let legendItems = new Set(); // entries will be unique

  let strings = defaultStrings;
  for (var key in configuration.strings) {
    strings[key] = configuration.strings[key];
  }

  let bcCategory = 'web';
  let platforms = ['desktop', 'mobile'];
  let displayBrowers = [...browsers["desktop"], ...browsers["mobile"]];

  if (category === 'javascript') {
    bcCategory = 'js';
    displayBrowers.push(...browsers["server"]);
    platforms.push('server');
  }
  if (category === 'webextensions') {
    bcCategory = 'ext';
    displayBrowers = [...browsers["webextensions-desktop"], ...browsers["webextensions-mobile"]];
    platforms = ['webextensions-desktop', 'webextensions-mobile'];
  }

  /* Gather a flat list of features */
  let features = [];
  if (compatData.__compat) {
    feature = compatData.__compat;
    feature.description = strings['feature_basicsupport'];
    const identifier = query.split(".").pop();
    features.push({[identifier]: feature});
  }
  traverseFeatures(compatData, depth, '', features);

  if (features.length > 0) {
    output = '<div class="bc-data hidden">';
    output += `<table class="bc-table bc-table-${bcCategory}">`;
    output += writeCompatHead(strings, platforms, displayBrowers);
    output += writeCompatBody(strings, features, forMDNURL, displayBrowers, legendItems);
    output += '</table>';
    output += writeLegend(strings, legendItems);

    output += '</div>';
  } else {
    errString = strings['no_data_found'].replace("${group}", group).replace("${depth}", depth);
    output = errString;
  }

  return output;
}

/*
Get features that should be displayed according to the query and the depth setting
Flatten them into a features array
*/
function traverseFeatures(obj, depth, identifier, features) {
  depth--;
  if (depth >= 0) {
    for (let i in obj) {
      if (!!obj[i] && typeof(obj[i])=="object" && i !== '__compat') {
        if (obj[i].__compat) {
          features.push({[identifier + i]: obj[i].__compat});
        }
      traverseFeatures(obj[i], depth, i + '.', features);
      }
    }
  }
}

function writeCompatHead(strings, platforms, displayBrowers) {
  let output = '<thead>';
  output += writeCompatPlatformsRow(strings, platforms);
  output += writeCompatBrowsersRow(strings, displayBrowers);
  output += '</thead>';
  return output;
}

function writeCompatPlatformsRow(strings, platforms) {
  let output = '<tr class="bc-platforms">';
  output += '<td></td>';

  for (let platform of platforms) {
    let platformCount = Object.keys(browsers[platform]).length;
    let platformId = platform.replace('webextensions-', '');
    output += `<th colspan="${platformCount}" class="bc-platform-${platformId}">`;
    output += writeIcon(strings, platformId);
    output += '</th>';
  }

  output += '</tr>';
  return output;
}

function writeCompatBrowsersRow(strings, displayBrowers) {
  let output = '<tr class="bc-browsers">';
  output += '<td></td>';
  for (let browser of displayBrowers) {
    output += `<th class="bc-browser-${browser}">`;
    output += writeIcon(strings, browser);
    output += '</th>';
  }
  output += '</tr>';
  return output;
}

function writeCompatBody(strings, features, forMDNURL, displayBrowers, legendItems) {
  let output = '<tbody>';
  output += writeCompatFeatureRow(strings, features, forMDNURL, displayBrowers, legendItems)
  output += '</tbody>';
  return output;
}

function writeCompatFeatureRow(strings, features, forMDNURL, displayBrowers, legendItems) {
  let output = '';
  for (let row of features) {
    output += '<tr>';
    let feature = Object.keys(row).map((k) => row[k])[0];
    output += `<th scope="row">${writeFeatureName(strings, row, feature, forMDNURL, legendItems)}</th>`;
    output += `${writeCompatCells(strings, feature.support, displayBrowers, legendItems)}</tr>`;
    output += '</tr>';
  }
  return output;
}

/* Write a icon with localized hover text */
function writeIcon(strings, iconSlug, replacer, isLegend) {
  let iconName = stringOrKey(strings, 'bc_icon_name_' + iconSlug).replace('$1$', replacer);
  let iconTitle = stringOrKey(strings, 'bc_icon_title_' + iconSlug).replace('$1$', replacer);
  if (isLegend) {
    iconName = strings['legend_' + iconSlug];
    iconTitle = iconName;
  }
  // there is no iconTitle, fall back to iconName
  if (iconTitle === 'bc_icon_title_' + iconSlug) {
    iconTitle = iconName;
  }
  let output = '';
  output += `<abbr class="only-icon" title="${iconTitle}">`;
  output += `<span>${iconName}</span>`;
  output += `<i aria-hidden="true" class="ic-${iconSlug}"></i>`;
  output += '</abbr>';
  return output;
}

function writeFeatureName(strings, row, feature, forMDNURL, legendItems) {
  let desc = '';
  let featureIcons = '';
  let experimentalIcon = '';
  let deprecatedIcon = '';
  let nonStandardIcon = '';
  let label = Object.keys(row)[0];

  if (feature.description) {
    // Basic support or unnested features need no prefixing
    if (label.indexOf('.') === -1) {
      desc += feature.description;
      // otherwise add a prefix so that we know where this belongs to (e.g. "parse: ISO 8601 format")
    } else {
      desc += `<code>${label.slice(0, label.lastIndexOf('.'))}</code>: ${feature.description}`;
    }
  } else {
    desc += `<code>${Object.keys(row)[0]}</code>`;
  }
  if (feature.mdn_url) {
    let href = feature.mdn_url;
    if (forMDNURL) {
      // Convert to relative MDN url
      href = feature.mdn_url.replace('https://developer.mozilla.org', '');
      mdn_slug = forMDNURL.split('/docs/')[1]
      if (href == '/docs/' + mdn_slug) {
        // Don't link to the current page
        href = "";
      }
    }
    if (href !== "") {
      desc = `<a href="${href}">${desc}</a>`;
    }
  }

  if (feature.hasOwnProperty('status')) {
    if (feature.status.experimental === true) {
      experimentalIcon = writeIcon(strings, 'experimental');
      legendItems.add('experimental');
    }
    if (feature.status.deprecated === true) {
      deprecatedIcon = writeIcon(strings, 'deprecated');
      legendItems.add('deprecated');
    }
    if (feature.status.standard_track === false) {
      nonStandardIcon = writeIcon(strings, 'non-standard');
      legendItems.add('non-standard');
    }
    if (experimentalIcon || deprecatedIcon || nonStandardIcon) {
      featureIcons += ' <div class="bc-icons">';
      featureIcons += experimentalIcon;
      featureIcons += deprecatedIcon;
      featureIcons += nonStandardIcon;
      featureIcons += '</div>';
    }
  }
  return desc + featureIcons;
}

/* Use the key if no string is defined */
function stringOrKey(strings, key) {
  return strings[key] || key;
}

/*
Returns the string to appear in the table cell, like "Yes", "No" or "?", "Partial"
or the version number

`added` and `removed` are either null, true, false or a string containing a version number
`partial` is either null, true, or false indicating partial_implementation
*/
function getCellString(strings, added, removed, partial) {
  let output = '';
  switch (added) {
    case null:
      output = `<abbr title="${strings['supportsShort_unknown_title']}">
                ${strings['supportsShort_unknown']}
              </abbr>`;
    break;
    case true:
      output = `<abbr title="${strings['supportsLong_yes']}"
                class="bc-level-yes only-icon">
                <span>${strings['supportsLong_yes']}</span>
              </abbr>
              ${strings['supportsShort_yes']}`;
    break;
    case false:
      output = `<abbr title="${strings['supportsLong_no']}"
                class="bc-level-no only-icon">
                <span>${strings['supportsLong_no']}</span>
              </abbr>
              ${strings['supportsShort_no']}`;
    break;
    default:
      output = `<abbr title="${strings['supportsLong_yes']}"
                class="bc-level-yes only-icon">
                <span>${strings['supportsLong_yes']}</span>
              </abbr>
              ${added}`;
  }
  if (removed) {
    output = `<abbr title="${strings['supportsLong_no']}"
              class="bc-level-no only-icon">
              <span>${strings['supportsLong_no']}</span>
            </abbr>`;
    // We don't know when supported started
    if (typeof(added) === 'boolean' && added) {
      output += '?'
    } else { // We know when
      output += added
    }
    output += '&nbsp;— ';
    // We don't know when supported ended
    if (typeof(removed) === 'boolean' && removed) {
      output += '?'
    } else { // We know when
      output += removed;
    }
    // removed wins over partial
  } else if (partial) {
    output = `<abbr title="${strings['supportsLong_partial']}"
              class="bc-level-partial only-icon">
              <span>${strings['supportsLong_partial']}</span>
            </abbr>`;
    // Display "Partial" instead of "Yes", "No", or "?" if we have no version string
    if (typeof(added) !== 'string') {
      output += strings['supportsShort_partial'];
    } else {
      output += added;
    }
  }
  return output;
}

/*
Given the support information for a browser, this returns
a CSS class to apply to the table cell.

`supportData` is a (or an array of) support_statement(s)
*/
function getSupportClass(supportInfo) {
  let cssClass = 'unknown';

  if (Array.isArray(supportInfo)) {
    // the first entry should be the most relevant/recent and will be treated as "the truth"
    checkSupport(supportInfo[0].version_added,
                 supportInfo[0].version_removed,
                 supportInfo[0].partial_implementation);
  } else if (supportInfo) { // there is just one support statement
    checkSupport(supportInfo.version_added,
                 supportInfo.version_removed,
                 supportInfo.partial_implementation);
  } else { // this browser has no info, it's unknown
    return 'unknown';
  }

  function checkSupport(added, removed, partial) {
    if (added === null) {
      cssClass = 'unknown';
    } else if (added) {
      cssClass = 'yes';
      if (removed) {
        cssClass = 'no';
      }
    } else {
      cssClass = 'no';
    }
    if (partial && !removed) {
      cssClass = 'partial';
    }
  }

  return cssClass;
}

/*
Generate the note for a browser flag or preference
First checks version_added and version_removed to create a string indicating when
a preference setting is present. Then creates a (browser specific) string
for either a preference flag or a compile flag.

// TODO Need to localize this

`supportData` is a support_statement
`browserId` is a compat_block browser ID
*/
function writeFlagsNote(supportData, browserId) {
  let output = '';

  const firefoxPrefs = ' To change preferences in Firefox, visit about:config.';
  const chromePrefs = ' To change preferences in Chrome, visit chrome://flags.';

  if (typeof(supportData.version_added) === 'string') {
    output = `From version ${supportData.version_added}`;
  }

  if (typeof(supportData.version_removed) === 'string') {
    if (output) {
      output += ' ';
      output += `until version ${supportData.version_removed} (exclusive)`;
    } else {
      output = `Until version ${supportData.version_removed} (exclusive)`;
    }
  }

  let start = 'This';
  if (output) {
    output += ':';
    start = ' this';
  }

  start += ' feature is behind the ';

  let flagsText = '';
  let settings = '';

  for (i = 0; i < supportData.flags.length; i++) {
    let flag = supportData.flags[i];
    let nameString = `<code>${flag.name}</code>`;

    // value_to_set is optional
    let valueToSet = '';
    if (flag.value_to_set) {
      valueToSet = ` (needs to be set to <code>${flag.value_to_set}</code>)`;
    }

    let typeString = '';
    if (flag.type === 'preference') {
      switch (browserId) {
        case 'firefox':
        case 'firefox_android':
          settings = firefoxPrefs;
        break;
        case 'chrome':
        case 'chrome_android':
          settings = chromePrefs;
        break;
      }
      typeString = ` preference${valueToSet}`;
    }

    if (flag.type === 'compile_flag') {
      typeString = ` compile flag${valueToSet}`;
    }

    if (flag.type === 'runtime_flag') {
      typeString = ` runtime flag${valueToSet}`;
    }

    flagsText += nameString + typeString;

    if (i != supportData.flags.length - 1) {
      flagsText += ' and the ';
    } else {
      flagsText += '.';
    }
  }

  output += start + flagsText + settings;

  return output;
}

/*
Generates icons for the main cell
`supportData` is a support_statement

*/
function writeCellIcons(strings, support, legendItems) {
  let output = '<div class="bc-icons">';

  if (Array.isArray(support)) {
    // the first entry should be the most relevant/recent and will be used for the main cell
    support = support[0];
  }
  if (support.prefix) {
    output += writeIcon(strings, 'prefix', support.prefix) + ' ';
    legendItems.add('prefix');
  }

  if (support.notes) {
    output += writeIcon(strings, 'footnote') + ' ';
    legendItems.add('footnote');
  }

  if (support.alternative_name) {
    output += writeIcon(strings, 'altname', support.alternative_name) + ' ';
    legendItems.add('altname');
  }

  if (support.flags) {
    output += writeIcon(strings, 'disabled') + ' ';
    legendItems.add('disabled');
  }

  output += '</div>';

  return output;
}

/*
Create notes section

`supportData` is a support_statement
`browserId` is a compat_block browser ID

*/
function writeNotes(strings, support, browserId, legendItems) {
  let output = '<section class="bc-history" aria-hidden="true"><dl>';

  if (Array.isArray(support)) {
    for (supportItem of support) {
      writeSingleNote(strings, supportItem, browserId, legendItems);
    }
  } else {
    writeSingleNote(strings, support, browserId, legendItems);
  }

  function writeSingleNote(strings, support, browserId, legendItems) {
    let notes = [];

    output += `<dt class="bc-supports-${getSupportClass(support)} bc-supports">`;
    output += getCellString(strings,
                            support.version_added,
                            support.version_removed,
                            support.partial_implementation);
    output += writeCellIcons(strings, support, legendItems);
    output += '</dt>';

    if (support.prefix) {
      notes.push({
        icon: writeIcon(strings, 'prefix', support.prefix),
        text: strings['bc_icon_title_prefix'].replace('$1$', support.prefix)
      });
    }

    if (support.notes) {
      if (Array.isArray(support.notes)) {
        for (let note of support.notes) {
          notes.push({
            icon: writeIcon(strings, 'footnote'),
            text: note
          });
        }
      } else {
        notes.push({
          icon: writeIcon(strings, 'footnote'),
          text: support.notes
        });
      }
    }

    if (support.alternative_name) {
      notes.push({
        icon: writeIcon(strings, 'altname', support.alternative_name),
        text: strings['bc_icon_title_altname'].replace('$1$', support.alternative_name)
      });
    }

    if (support.flags) {
      notes.push({
        icon: writeIcon(strings, 'disabled'),
        text: writeFlagsNote(support, browserId)
      });
    }

    if (notes.length > 0) {
      for (let note of notes) {
        output += '<dd>';
        output += note.icon;
        output += ' ' + note.text;
        output += '</dd>';
      }
    } else {
      output += '<dd></dd>';
    }
  }

  output += '</dl></section>';

  return output;
}

/*
For a single row, write all the cells that contain support data.
(That is, every cell in the row except the first, which contains
an identifier for the row,  like "Basic support".

*/
function writeCompatCells(strings, supportData, displayBrowers, legendItems) {
  let output = '';

  for (let browserNameKey of displayBrowers) {
    let needsNotes = false;
    let support = supportData[browserNameKey];
    let supportInfo = '';
    if (support) {
      if (Array.isArray(support)) {
        // Take first support data
        supportInfo += getCellString(strings,
                                     support[0].version_added,
                                     support[0].version_removed,
                                     support[0].partial_implementation);
        needsNotes = true;
      } else {
        supportInfo += getCellString(strings,
                                     support.version_added,
                                     support.version_removed,
                                     support.partial_implementation);
        if (support.notes || support.prefix || support.flags || support.alternative_name) {
          needsNotes = true;
        }
      }
    } else { // browsers are optional in the data, display them as "?" in our table
      supportInfo += getCellString(strings, null);
    }

    let supportClass = getSupportClass(support);
    output += `<td class="bc-supports-${supportClass} bc-browser-${browserNameKey}`;
    legendItems.add('support_' + supportClass);

    if (needsNotes) {
      output += ' bc-has-history';
    }

    output += `">${supportInfo}`;

    if (needsNotes) {
      output += writeCellIcons(strings, support, legendItems);
      output += writeNotes(strings, support, browserNameKey, legendItems);
    }
    output += '</td>';
  }

  return output;
}

function writeLegend (strings, legendItems) {
  let output = '<section class="bc-legend">';
  output += `<h3 class="offscreen">${strings['legend']}</h3>`;
  output += '<dl>';

  let sortOrder = ['support_yes', 'support_partial', 'support_no', 'support_unknown',
                   'experimental', 'non-standard', 'deprecated',
                   'footnote', 'disabled', 'altname', 'prefix'];
  let sortedLegendItems = Array.from(legendItems).sort(function(a, b) {
    return sortOrder.indexOf(a) - sortOrder.indexOf(b);
  });

  for (let item of sortedLegendItems) {
    // handle supprt cells
    if (item.indexOf('support_') !== -1) {
      let supportType = item.substring(item.indexOf('_') + 1);
      output += `<dt><span class="bc-supports-${supportType} bc-supports">
                 <abbr title="${strings['supportsLong_' + supportType]}"
                 class="bc-level bc-level-${supportType} only-icon">
                 <span>${strings['supportsLong_' + supportType]}</span>
                 &nbsp;
                </abbr></span></dt>`;
      output += `<dd>${strings['supportsLong_' + supportType]}</dd>`;
    // handle icons
    } else {
      output += `<dt>${writeIcon(strings, item, '', true)}</dt>`;
      output += `<dd>${strings['legend_' + item]}</dd>`;
    }
  }

  output += '</dl>';
  output +='</section>';
  return output;
}

module.exports = render;
