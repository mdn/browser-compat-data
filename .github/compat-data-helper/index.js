const match = require('./lib/match')

async function commentOnlyOnce (context, issueDetails, message) {
  const comments = await context.github.issues.listComments(issueDetails)
  const alreadyPosted = comments.data.map(c => c.body).includes(message)

  if (!alreadyPosted) {
    await context.github.issues.createComment({ ...issueDetails, body: message })
  }
}

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  app.on(['pull_request.opened', 'pull_request.synchronize'], async context => {
    const pr = context.repo({ pull_number: context.payload.number })
    const prAsIssue = context.repo({ issue_number: context.payload.number })
    const prString = `${pr.owner}/${pr.repo}#${pr.pull_number}`
    context.log(`PR ${prString}: ${context.payload.action}`)

    const config = await context.config('labels.yml')
    if (config === null) {
      context.log.warn(`PR ${prString}: No config found. Nothing will be labeled.`)
      return
    }

    const { changed_files: changedFiles } = context.payload.pull_request
    context.log(`PR ${prString}: ${changedFiles} files changed`)
    if (changedFiles >= 300) {
      context.log.warn(`PR ${prString}: Large file lists (≥300 files) aren't returned by GitHub; not all applicable labels may be applied`)
      await commentOnlyOnce(context, prAsIssue, '🤖 Note: This PR contains more 300 or more files. Some automatic labels may not have been applied.')
    }

    const fileList = await context.github.paginate(
      context.github.pullRequests.listFiles.endpoint.merge(pr),
      res => res.data
    )
    const filenames = fileList.map(f => f.filename)

    const labels = match(filenames, config)
    await context.github.issues.addLabels({ ...prAsIssue, labels: { labels } })
    context.log(`PR ${prString}: Added labels`, labels)
  })
}
