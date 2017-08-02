/*

See https://raw.githubusercontent.com/mozilla/kumascript/master/macros/Compat.ejs

Run as `npm run render http.headers.Cache-Control`
(same parameter as the {{compat("http.headers.Cache-Control")}} call)

*/

const bcd = require('..');

var query = process.argv[2];
var depth = process.argv[3] || 1;
var output = '';

var s_no_data_found = `No compatibility data found. Please contribute data for "${query}" (depth: ${depth}) to the <a href="https://github.com/mdn/browser-compat-data">MDN compatibility data repository</a>.`;
var s_firefox_android = 'Firefox for Android';
var s_chrome_android = 'Chrome for Android';

const desktopBrowsers = {
  chrome: 'Chrome',
  edge: 'Edge',
  firefox: 'Firefox',
  ie: 'Internet Explorer',
  opera: 'Opera',
  safari: 'Safari'
};

const mobileBrowsers = {
  webview_android: 'Android',
  chrome_android: s_chrome_android,
  edge_mobile: 'Edge mobile',
  firefox_android: s_firefox_android,
  ie_mobile: 'IE mobile',
  opera_android: 'Opera Android',
  safari_ios: 'iOS Safari',
}

var notesArray = [];

/*
Write the table header.

`browserPlatformType` is either "mobile" or "desktop"
`browserNames` is either the "mobileBrowsers" or "desktopBrowsers" object
*/
function writeTableHead(browserPlatformType, browserNames) {
  let browserNameKeys = Object.keys(browserNames);
  let output = `<div id="compat-${browserPlatformType}"><table class="compat-table"><thead><tr>`;
  output +=  `<th>Feature</th>`
  for (let browserNameKey of browserNameKeys) {
    output += `<th>${browserNames[browserNameKey]}</th>`;
  }
  output += '</tr></thead>';
  return output;
}

/*
Given the value of `version_added` or `version_removed`, this returns
a string to appear in the table cell, like "Yes", "No" or "?"

`versionInfo` is either null, true, false or a string containing a version number
*/
function getVersionString(versionInfo) {
  switch (versionInfo) {
    case null:
    return `<span title="supportsShort_unknown_title"
    style="color: rgb(255, 153, 0);">?</span>`;
    break;
    case true:
    return `<span style="color: #888">(Yes)</span>`;
    break;
    case false:
    return `<span style="color: #f00">No</span>`;
    break;
    default:
    return versionInfo;
  }
}

/*
Generate the note for a browser flag or preference
First checks version_added and version_removed to create a string indicating when
a preference setting is present. Then creates a (browser specific) string
for either a preference flag or a compile flag.

`supportData` is a support_statement
`browserId` is a compat_block browser ID
*/
function writeFlagsNote(supportData, browserId) {
  let output = '';

  const firefoxPrefs = 'To change preferences in Firefox, visit about:config.';
  const chromePrefs = 'To change preferences in Chrome, visit chrome://flags.';

  if (typeof(supportData.version_added) === 'string') {
    output = 'From version ' + supportData.version_added;
  }

  if (typeof(supportData.version_removed) === 'string') {
    if (output) {
      output += ' until version '+ supportData.version_removed + ' (exclusive): ';
    } else {
      output = 'Until version ' + supportData.version_removed + ' (exclusive): ';
    }
  } else {
    output += ', ';
  }

  let flagText = `this feature is behind the <code>${supportData.flag.name}</code>`;

  // value_to_set is optional
  let valueToSet = '';
  if (supportData.flag.value_to_set) {
    valueToSet = ` (needs to be set to <code>${supportData.flag.value_to_set}</code>)`;
  }

  if (supportData.flag.type === 'preference') {
    let prefSettings = '';
    switch (browserId) {
      case 'firefox':
      case 'firefox_android':
      prefSettings = firefoxPrefs;
      break;
      case 'chrome':
      case 'chrome_android':
      prefSettings = chromePrefs;
      break;
    }
    output += `${flagText} preference${valueToSet}. ${prefSettings}`;
  }

  if (supportData.flag.type === 'compile_flag') {
    output += `${flagText} compile flag${valueToSet}.`;
  }

  return output;
}


/*
Main function responsible for the contents of a support cell in the table.

`supportData` is a support_statement
`browserId` is a compat_block browser ID
`compatNotes` is collected Compatibility notes

*/
function writeSupportInfo(supportData, browserId, compatNotes) {
  let output = '';

  // browsers are optional in the data, display them as "?" in our table
  if (!supportData) {
    output = getVersionString(null);
    // we have support data, lets go
  } else {
    output += getVersionString(supportData.version_added);

    if (supportData.version_removed) {
      // We don't know when
      if (typeof(supportData.version_removed) === 'boolean' && supportData.version_removed) {
        output += '&nbsp;—?'
      } else { // We know when
        output += '&nbsp;— ' + supportData.version_removed;
      }
    }

    // Add prefix
    if (supportData.prefix) {
      output += `<span title="prefix" class="inlineIndicator prefixBox prefixBoxInline">
      <a title="The name of this feature is prefixed with '${supportData.prefix}' as this
      browser considers it experimental" href="/en-US/docs/Web/Guide/Prefixes">${supportData.prefix}
      </a></span>`;
    }

    // Add alternative name
    if (supportData.alternative_name) {
      output += ` (as <code>${supportData.alternative_name}</code>)`;
    }

    // Add note anchors
    // There are two types of notes (notes, and flag notes).
    // Collect them and order them, before adding them to the cell
    let noteAnchors = [];

    // Generate notes, if any
    if (compatNotes && supportData.notes) {
      if (Array.isArray(supportData.notes)) {
        for (let note of supportData.notes) {
          let noteIndex = compatNotes.indexOf(note);
          noteAnchors.push(`<sup><a href="#compatNote_${noteIndex+1}">${noteIndex+1}</a></sup>`);
        }
      } else {
        let noteIndex = compatNotes.indexOf(supportData.notes);
        noteAnchors.push(`<sup><a href="#compatNote_${noteIndex+1}">${noteIndex+1}</a></sup>`);
      }
    }

    // there is a flag and it needs a note, too
    if (compatNotes && supportData.flag) {
      let flagNote = writeFlagsNote(supportData, browserId);
      let noteIndex = compatNotes.indexOf(flagNote);
      noteAnchors.push(`<sup><a href="#compatNote_${noteIndex+1}">${noteIndex+1}</a></sup>`);
    }
    noteAnchors = noteAnchors.sort();
    output += noteAnchors.join(' ');

  }
  return output;
}

/*
Iterate into all "support" objects, and all browsers under them,
and collect all notes in an array, without duplicates.
*/
function collectCompatNotes() {

  function pushNotes(supportEntry, browserName) {
    // collect notes
    if (supportEntry.hasOwnProperty('notes')) {
      let notes = supportEntry['notes'];
      if (Array.isArray(notes)) {
        for (let note of notes) {
          if (notesArray.indexOf(note) === -1) {
            notesArray.push(note);
          }
        }
      } else {
        if (notesArray.indexOf(notes) === -1) {
          notesArray.push(notes);
        }
      }
    }
    // collect flags
    if (supportEntry.hasOwnProperty('flag')) {
      let flagNote = writeFlagsNote(supportEntry, browserName);
      if (notesArray.indexOf(flagNote) === -1) {
        notesArray.push(flagNote);
      }
    }
  }
  for (let row of features) {
    let support = Object.keys(row).map((k) => row[k])[0].support;
    for (let browserName of Object.keys(support)) {
      if (Array.isArray(support[browserName])) {
        for (let entry of support[browserName]) {
          pushNotes(entry, browserName);
        }
      } else {
        pushNotes(support[browserName], browserName);
      }
    }
  }
  return notesArray;
}

/*
For a single row, write all the cells that contain support data.
(That is, every cell in the row except the first, which contains
an identifier for the row,  like "Basic support".

*/
function writeSupportCells(supportData, compatNotes, browserNames) {
  let output = '';

  for (let browserNameKey of Object.keys(browserNames)) {
    let support = supportData[browserNameKey];
    let supportInfo = '';
    // if supportData is an array, there are multiple support statements
    if (Array.isArray(support)) {
      for (let entry of support) {
        supportInfo += `<p>${writeSupportInfo(entry, browserNameKey, compatNotes)}</p>`;
      }
    } else if (support) { // there is just one support statement
      supportInfo = writeSupportInfo(support, browserNameKey, compatNotes);
    } else { // this browser has no info, it's unknown
    supportInfo = writeSupportInfo(null);
  }
  output += `<td>${supportInfo}</td>`;
}
return output;
}

/*

*/
function writeTable(browserPlatformType, browserNames) {
  let compatNotes = collectCompatNotes();
  let output = writeTableHead(browserPlatformType, browserNames);
  output += '<tbody>';
  for (let row of features) {
    let feature = Object.keys(row).map((k) => row[k])[0];
    var desc = feature.description || `<code>${Object.keys(row)[0]}</code>`;
    output += `<tr><td>${desc}</td>`
    output += `${writeSupportCells(feature.support, compatNotes, browserNames)}</tr>`;
  }
  output += '</tbody></table></div>';
  return output;
}

/*
Write each compat note, with an `id` so it will be linked from the table.
*/
function writeNotes() {
  let output = '';
  let compatNotes = collectCompatNotes();
  for (let note of compatNotes) {
    let noteIndex = compatNotes.indexOf(note);
    output += `<p id=compatNote_${noteIndex+1}>${noteIndex+1}. ${note}</p>`;
  }
  return output;
}

/*
Get compat data using a query string like "webextensions.api.alarms"
*/
function getData(queryString, obj) {
  return queryString.split('.').reduce(function(prev, curr) {
    return prev ? prev[curr] : undefined
  }, obj);
}

/*
Get features that should be displayed according to the query and the depth setting
Flatten them into a features array
*/
function traverseFeatures(obj, depth, identifier) {
  depth--;
  if (depth >= 0) {
    for (i in obj) {
      if (!!obj[i] && typeof(obj[i])=="object" && i !== '__compat') {
        if (obj[i].__compat) {
          // [identifier + '.' + i]
          features.push({[i]: obj[i].__compat});
        }
        traverseFeatures(obj[i], depth, identifier + '.' + i);
      }
    }
  }
}

var compatData = getData(query, bcd);
var features = [];
var identifier = query.split(".").pop();

if (!compatData) {
  output = s_no_data_found;
} else if (compatData.__compat) {
  // get an optional main feature identifier and add it to the feature list
  features.push({[identifier]: compatData.__compat});
}

traverseFeatures(compatData, depth, identifier);

if (features.length > 0) {
  output = `<div class="htab">
  <a id="AutoCompatibilityTable" name="AutoCompatibilityTable"></a>
  <ul>
    <li class="selected">
      <a href="javascript:;">Desktop</a>
    </li>
    <li>
      <a href="javascript:;">Mobile</a>
    </li>
  </ul>
  </div>`;
  output += writeTable('desktop', desktopBrowsers);
  output += writeTable('mobile', mobileBrowsers);
  output += writeNotes();
} else {
  output = s_no_data_found;
}

console.log(output);
