const match = require('../lib/match.js')

const sampleConfig = {
  // label: [pattern]
  'data:css 🎨': [
    'css/**'
  ],
  'data:api 🐇': [
    'api/**'
  ],
  infra: [
    '*.js'
  ]
}

describe('matchLabels', () => {
  test('returns an array of label strings for matching files', () => {
    const result = match(['css/properties/text-justify.json', 'api/Element.json'], sampleConfig)
    expect(result).toStrictEqual(['data:css 🎨', 'data:api 🐇'])
  })

  test('returns an empty array if no matches', () => {
    expect(match(['README.md'], sampleConfig)).toStrictEqual([])
  })

  test('returns an empty array for no config', () => {
    const example = ['css/properties/text-justify.json', 'api/Element.json']

    const empty = match(example, {})
    expect(empty).toStrictEqual([])

    const nullish = match(example, null)
    expect(nullish).toStrictEqual([])

    const undef = match(example)
    expect(undef).toStrictEqual([])
  })
})
