const nock = require('nock')

const myProbotApp = require('..')
const { Probot } = require('probot')

// Fixtures
const pullRequestOpenedWebHook = require('./fixtures/pull_request.opened')
const pullRequestOpenedLargeWebHook = require('./fixtures/pull_request.opened.large')
const pullRequestSyncedWebHook = require('./fixtures/pull_request.synchronized')
const pullRequestFiles = require('./fixtures/pull_request.files')
const pullRequestComments = require('./fixtures/get_comments')

const noRepoConfig = require('./fixtures/get_contents.config.not_found.json')
const repoConfig = require('./fixtures/get_contents.config.json')

nock.disableNetConnect()

const gitHubApi = 'https://api.github.com'
describe('My Probot app', () => {
  let probot

  beforeEach(() => {
    probot = new Probot({
      Octokit: require('@octokit/rest') // use bare @octokit/rest, without any plugins, to fail faster
    })
    // Load our app into probot
    const app = probot.load(myProbotApp)

    // Return a test token
    app.app = {
      getInstallationAccessToken: () => 'test'
    }

    // The first invocation of probot needs this, but subsequent tests may reuse the token
    nock(gitHubApi)
      .post('/app/installations/1356911/access_tokens')
      .optionally()
      .reply(200, { token: 'test' })
  })

  test('assigns a label based on the file list when a PR is opened', async () => {
    nock(gitHubApi)
      .get('/repos/ddbeck/browser-compat-data/contents/.github/labels.yml')
      .reply(200, repoConfig)

    nock(gitHubApi)
      .get('/repos/ddbeck/browser-compat-data/pulls/2/files')
      .reply(200, pullRequestFiles)

    let labelBody
    nock(gitHubApi)
      .post('/repos/ddbeck/browser-compat-data/issues/2/labels', body => {
        labelBody = body
        return true
      })
      .reply(200)

    // Receive a webhook event
    await probot.receive({
      name: 'pull_request',
      payload: pullRequestOpenedWebHook
    })

    expect(labelBody).toMatchObject({
      labels: ['data:css 🎨']
    })

    // Assert that all of the mocks have been used
    expect(nock.pendingMocks()).toStrictEqual([])
  })

  test('assigns a label based on the file list when a PR is changed', async () => {
    nock(gitHubApi)
      .get('/repos/ddbeck/browser-compat-data/contents/.github/labels.yml')
      .reply(200, repoConfig)

    nock(gitHubApi)
      .get('/repos/ddbeck/browser-compat-data/pulls/2/files')
      .reply(200, pullRequestFiles)

    let labelBody
    nock(gitHubApi)
      .post('/repos/ddbeck/browser-compat-data/issues/2/labels', body => {
        labelBody = body
        return true
      })
      .reply(200)

    // Receive a webhook event
    await probot.receive({
      name: 'pull_request',
      payload: pullRequestSyncedWebHook
    })

    expect(labelBody).toMatchObject({
      labels: ['data:css 🎨']
    })

    // Assert that all of the mocks have been used
    expect(nock.pendingMocks()).toStrictEqual([])
  })

  test('assigns no labels if no files match', async () => {
    nock(gitHubApi)
      .get('/repos/ddbeck/browser-compat-data/contents/.github/labels.yml')
      .reply(200, repoConfig)

    // Get a version of the file list response that never matches
    const noMatchingFiles = JSON.parse(JSON.stringify(pullRequestFiles))
    noMatchingFiles[0].filename = 'NEVERMATCHME'

    nock(gitHubApi)
      .get('/repos/ddbeck/browser-compat-data/pulls/2/files')
      .reply(200, noMatchingFiles)

    await probot.receive({
      name: 'pull_request',
      payload: pullRequestOpenedWebHook
    })

    expect(nock.pendingMocks()).toStrictEqual([])
  })

  test('assigns no labels if repo has no config', async () => {
    nock(gitHubApi)
      .get('/repos/ddbeck/browser-compat-data/contents/.github/labels.yml')
      .reply(404, noRepoConfig)

    // Probot 9 tries to read from an org-wide config; doesn't seem to be a way to suppress this
    nock(gitHubApi)
      .get('/repos/ddbeck/.github/contents/.github/labels.yml')
      .reply(404, noRepoConfig)

    // We shouldn't hit the API any more, if there's no config

    await probot.receive({
      name: 'pull_request',
      payload: pullRequestOpenedWebHook
    })

    expect(nock.pendingMocks()).toStrictEqual([])
  })

  test('comments if PR contains more than 300 files', async () => {
    nock(gitHubApi)
      .get('/repos/ddbeck/browser-compat-data/contents/.github/labels.yml')
      .reply(200, repoConfig)

    nock(gitHubApi)
      .get('/repos/ddbeck/browser-compat-data/pulls/2/files')
      .reply(200, pullRequestFiles)

    let labelBody
    nock(gitHubApi)
      .post('/repos/ddbeck/browser-compat-data/issues/2/labels', body => {
        labelBody = body
        return true
      })
      .reply(200)

    nock(gitHubApi)
      .get('/repos/ddbeck/browser-compat-data/issues/2/comments')
      .reply(200, [])

    let commentBody
    nock(gitHubApi)
      .post('/repos/ddbeck/browser-compat-data/issues/2/comments', body => {
        commentBody = body
        return true
      })
      .reply(200)

    // Receive a webhook event
    await probot.receive({
      name: 'pull_request',
      payload: pullRequestOpenedLargeWebHook
    })

    expect(labelBody).toMatchObject({
      labels: ['data:css 🎨']
    })
    expect(commentBody).toHaveProperty('body')
    expect(commentBody.body).toMatch(/files/)

    // Assert that all of the mocks have been used
    expect(nock.pendingMocks()).toStrictEqual([])
  })

  test('comments only once per PR', async () => {
    nock(gitHubApi)
      .get('/repos/ddbeck/browser-compat-data/contents/.github/labels.yml')
      .reply(200, repoConfig)

    nock(gitHubApi)
      .get('/repos/ddbeck/browser-compat-data/pulls/2/files')
      .reply(200, pullRequestFiles)

    nock(gitHubApi)
      .get('/repos/ddbeck/browser-compat-data/issues/2/comments')
      .reply(200, pullRequestComments)

    let labelBody
    nock(gitHubApi)
      .post('/repos/ddbeck/browser-compat-data/issues/2/labels', body => {
        labelBody = body
        return true
      })
      .reply(200)

    // Receive a webhook event
    await probot.receive({
      name: 'pull_request',
      payload: pullRequestOpenedLargeWebHook
    })

    expect(labelBody).toMatchObject({
      labels: ['data:css 🎨']
    })

    // Assert that all of the mocks have been used
    expect(nock.pendingMocks()).toStrictEqual([])
  })
})
