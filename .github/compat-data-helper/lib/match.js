const minimatch = require('minimatch')

function anyPatternMatches (fileList, patterns) {
  for (const pattern of patterns) {
    if (minimatch.match(fileList, pattern, { matchBase: true }).length) {
      return true
    }
  }
  return false
}

function matchLabels (fileList, config) {
  const labels = new Set()

  for (const [label, patterns] of Object.entries(config || {})) {
    if (anyPatternMatches(fileList, patterns)) {
      labels.add(label)
    }
  }

  return Array.from(labels)
}

module.exports = matchLabels
