# Governance

[`@mdn/browser-compat-data`](https://github.com/mdn/browser-compat-data) (also often referred to as "BCD") is an open source project that depends on contributions from the community. As long as they abide by the project’s Contribution Guidelines, anyone may contribute to the project at any time by submitting code, participating in discussions, making suggestions, or any other contribution they see fit. This document describes how various types of contributors work within the `@mdn/browser-compat-data` project and how decisions are made.

## Roles and Responsibilities

### Community members

_Everyone_ who is involved in any form with the project must abide by the project’s [Contribution Guidelines](CODE_OF_CONDUCT.md) and Commit Access Guidelines. Everyone is expected to be respectful of fellow community members and to work collaboratively respective of the Code of Conduct (CPG). Consequences for not adhering to these Guidelines are listed in their respective documents.

### Users

Users are community members who have a need for the project. They are typically consumers of the compat data (see [data consumers](README.md#projects-using-the-data)). Anyone can be a User; there are no special requirements and the data is licensed under [CC0](LICENSE). Common User contributions include evangelizing the project (e.g., display a link on a website and raise awareness through word-of-mouth), informing developers of strengths and weaknesses from a new user perspective, or providing moral support (a “thank you” goes a long way).

Users who continue to engage with the project and its community will often become more and more involved. Such Users may find themselves becoming [Contributors](#Contributors), as described in the next section.

### Contributors

Contributors are community members who contribute in concrete ways to the project, most often in the form of data updates, code and/or documentation. Anyone can become a Contributor, and contributions can take many forms. There is no expectation of commitment to the project, no specific skill requirements, and no selection process. We do expect contributors to follow Mozilla’s Contribution Guidelines.

Contributors:

- Have read-only access to source code and therefore can submit changes via pull requests.
- Have their contribution reviewed and merged by a [Peer](#Peers) or [Owner](#Owners). Owners and Peers work with Contributors to review their code and prepare it for merging.
- May also review pull requests. This can be helpful, but their approval or disapproval is not decisive for merging or not merging PRs.

As Contributors gain experience and familiarity with the project, their profile within, and commitment to, the community will increase. At some stage, they may find themselves being nominated for becoming a Peer by an existing Peer or Owner.

### Peers

Peers are community members who have shown that they are committed to the continued development of the project through ongoing engagement with the community. Peers are given push/write access to the project’s GitHub repos.

Peers:

- Are expected to work on public branches of their forks and submit pull requests to the main branch.
- Must submit pull requests for all their changes.
- May label and close issues.
- May merge other people's pull requests that relate to compat data updates.
- May merge other people's pull requests that relate to browser data updates (excluding the addition or removal of browsers).
- Have their non-data update work reviewed and merged by [Owners](#Owners). Non-data pull requests are PRs that change the schema, update project meta-docs, the linter, or other infrastructure changes.
- Should ask for additional review from other Peers or Owners on other people's PRs that are disruptive or controversial.

To become a Peer one must:

- Have shown a willingness and ability to participate in the project in a helpful and collaborative way with the MDN community.
- Typically, a potential Peer will need to show that they have an understanding of and alignment with the project, its objectives, and its strategy.
- Have contributed a significant amount of work to the project (e.g. in the form of PRs or PR reviews), thereby demonstrating their trustworthiness and commitment to the project.
- Read and agree to abide by the [Mozilla Commit Access Requirements](https://www.mozilla.org/en-US/about/governance/policies/commit/requirements/).
- File an issue in the [mdn/mdn](https://github.com/mdn/mdn) repository and record “I have read, and agree to abide by, the Mozilla Commit Access Requirements.”

New Peers can be nominated by any existing Peers. Once they have been nominated, there will be a vote by the Owners.

It is important to recognize that being a Peer is a privilege, not a right. That privilege must be earned and once earned it can be removed by the Owners. However, under normal circumstances the Peer status exists for as long as the Peer wishes to continue engaging with the project. Inactive Peers (no activity on the project for longer for a few months or more) might be marked as inactive or removed by the Owners and may re-enter when they choose to contribute again.

#### List of current peers

- Alexis Deveria (@Fyrd), Adobe, https://caniuse.com
- Jean-Yves Perrier (@teoli2003), Open Web Docs
- Joe Medley (@jpmedley), Google
- Luca Casonato (@lucacasonato), Deno
- Michael Smith (@sideshowbarker), W3C
- Richard Bloor (@rebloor)
- Will Bamberg (@wbamberg), Open Web Docs

A Peer who shows an above-average level of contribution to the project, particularly with respect to its strategic direction and long-term health, may be nominated to become an Owner, described below.

### Owners

The `@mdn/browser-compat-data` project is jointly governed by the [Mozilla MDN staff team](https://wiki.mozilla.org/Engagement/MDN_Durable_Team#Team_Members), the [MDN Product Advisory Board Members](https://developer.mozilla.org/en-US/docs/MDN/MDN_Product_Advisory_Board/Members), and the [Owner group](#list-of-current-owners). They are collectively responsible for high-level guidance of the project.

The [Owner group](#list-of-current-owners) has final authority over this project including:

- Technical direction of the project, especially infrastructure PRs and linting and/or schema decisions.
- Project governance and process (including this policy and any updates).
- Contribution policy.
- GitHub repository hosting.
- Confirming Peers.

Being an Owner is not time-limited. There is no fixed size of the Owner group. The Owner group should be of such a size as to ensure adequate coverage of important areas of expertise balanced with the ability to make decisions efficiently.
An Owner may be removed from the Owner group by voluntary resignation, or by a standard Owner group motion, including for violations of Contribution and/or Commit Access Guidelines.

Changes to the Owner group should be posted in the agenda, and may be suggested as any other agenda item (see [Project Meetings](#project-meetings) below).

Owners fulfill all requirements of Peers, and also:

- Ensure the smooth running of the project.
- Review code contributions, approve changes to this document, manage the copyrights within the project outputs.
- Participate in the project discussions and meetings.
- Manage and merge non-data pull requests such as schema, linter, or infrastructure changes.
- May merge their own pull requests once they have collected the feedback they deem necessary. (No pull request should be merged without at least one peer or owner comment stating they’ve looked at the PR.)
- May merge pull requests that result in a semver major or semver minor version bump only after seeking approval within the group of owners.
- Release a new npm version of the project on a regular (weekly) basis.

To become an Owner one must fulfill at least the following conditions and commit to being a part of the community for the long-term.

- Have worked in a helpful and collaborative way with the MDN community.
- Have given good feedback on others’ submissions and displayed an overall understanding of the code quality standards for the project.
- Have the ability to drive the project forward, manage requirements from users, and taking on responsibility for the overall health of the project.

An individual is invited to become an Owner by existing Owners. A nomination will result in discussion and then a decision by the Owner group.

#### List of current Owners

- Daniel Beck (@ddbeck)
- Florian Scholz (@Elchi3), Open Web Docs
- Philip Jägenstedt (@foolip), Google
- Ruth John (@Rumyra), Mozilla
- Vinyl Da.i'gyu (@queengooborg)

## Additional paths to becoming a Peer or Owner

Some Owners or Peers are also [MDN Content Curators](https://developer.mozilla.org/en-US/docs/MDN/Contribute/Documentation_topics_and_curators) and have thus earned the privilege to be a `@mdn/browser-compat-data` Peer, so that their expertise in a given content area (CSS, HTML, etc.) can help improve the compat data for that same content area. Such Peers are marked in the relevant folders using GitHub’s Code Owner mechanism.

Peers might also be representatives of browser vendors and have expertise and/or access to browser-specific information within their company. Their company name is listed in the Peer list.

## Owner-delegate rule

Owners may, at their discretion, nominate an owner-delegate to carry out a task or make a decision ordinarily carried out by an Owner. Delegation should be limited in duration or scope, or both; delegation may be withdrawn by any Owner at any time. For example, an Owner may nominate an owner-delegate to approve an infrastructure PR or to publish npm packages for a set time or number of releases.

## Decision Making

Decision making generally follows a [Consensus-seeking decision-making](https://en.wikipedia.org/wiki/Consensus-seeking_decision-making) model.

When an agenda item has appeared to reach a consensus, the moderator will ask “Does anyone object?” as a final call for dissent from the consensus.

If an agenda item cannot reach a consensus, an owner can call for either a closing vote or a vote to table the issue to the next meeting. The call for a vote must be approved by a majority of the owners or else the discussion will continue. Simple majority wins.

## Licensing

Please note that this project is made available using the
[CC0 license](LICENSE),
so anyone contributing should only submit data if they know they have the right to submit it under CC0. If you're not sure about that, just ask.

## Project Meetings

There are no recurrent project meetings; they are scheduled when required at a time that works for the owners, and using tools that enable participation by the community. The meeting is run by a designated moderator approved by the owners group.
Meetings will typically be held when there are particularly important items to review, such as modifications of governance, contribution policy, owner membership, or release process.

Any community member or Peer can ask that something be added to the next meeting’s agenda by logging a GitHub Issue. Peers can add the item to the agenda by adding the [meeting-agenda](https://github.com/mdn/browser-compat-data/labels/meeting-agenda) label to the issue and Contributors can ask Peers to add the label for them.

The intention of the agenda is not to approve or review all patches. That should happen continuously on GitHub and be handled by the larger group of Peers. The exception to this is when defining how the schema should look (or when proposing an update), or when a PR discussion has stalled due to disagreement or inaction, and progress needs to be unblocked.

Before each project meeting, the moderator will share the agenda with the owners. Owners can add any items they like to the agenda at the beginning of each meeting. The moderator and the owners cannot veto or remove items.

The Owners may invite persons or representatives from certain projects to participate in a non-voting capacity.

The moderator is responsible for summarizing the discussion of each agenda item and adding it to the [repository's wiki](https://github.com/mdn/browser-compat-data/wiki/Project-meetings) after the meeting.

## Privileges and responsibilities matrix

| Privilege / responsibility                             | Everyone / Users | Contributors | Peers | Owners |
| ------------------------------------------------------ | ---------------- | ------------ | ----- | ------ |
| Abide to Code of Conduct                               | •                | •            | •     | •      |
| Evangelize the project                                 | •                | •            | •     | •      |
| Make use of the data, fork it, repackage it, etc.      | •                | •            | •     | •      |
| Open pull requests or issues                           |                  | •            | •     | •      |
| Review pull requests or comment on issues              |                  | •            | •     | •      |
| Label issues and PRs                                   |                  |              | •     | •      |
| Merge compat data PRs                                  |                  |              | •     | •      |
| Merge browser data PRs                                 |                  |              | •     | •      |
| Merge schema, linter, infrastructure or policy changes |                  |              |       | •      |
| Release new npm package versions                       |                  |              |       | •      |
| Merge to branches directly (without pull requests)     |                  |              |       | •      |

## Peers and owners emeriti

The `@mdn/browser-compat-data` project would like to thank the following former Owners and Peers for their contributions and the countless hours invested.

- Chris David Mills (@chrisdavidmills), Mozilla
- Eric Shepherd (@a2sheppy) (BCD peer until August 2020)
- Estelle Weyl (@estelle) (Peer for CSS compat data)
- John Whitlock (@jwhitlock) (Technical design of the former compat data project)
- Kadir Topal (@atopal) (BCD co-owner until September 2020)
- Rachel Andrew (@rachelandrew) (Peer)
- Ryan Johnson (@escattone) (Peer)

## Credits

This work is a derivative of [ESLint Governance](https://github.com/eslint/eslint.github.io/blob/master/docs/maintainer-guide/governance.md), [YUI Contributor Model](https://github.com/yui/yui3/wiki/Contributor-Model), and the [JS Foundation TAC Charter](https://github.com/JSFoundation/TAC).
