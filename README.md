# Bubble Tea League Stats Tracker

This website is used to make tracking stats for the Bubble Tea League (BTL) publicly available to the world with a pretty user interface.

Currently, all stats are tracked by hand by Danz which is a huge pain.

BTL is a community-organized League of Legends tournament league managed by a group of friends in their free time.

^ _(we'll describe this better later for ppl reading this)_

## Try it out!

[Click here to view the live site](https://www.bubble-tea-league.com)

## Contributors

This website is being developed and maintained by [Nicholas Ewing](https://github.com/NicholasEwing) and [Chase Hunt](https://github.com/ChaseH38).

## Technologies used

The BTL stats tracker is currently a static website, here's what we use to make it work:

- HTML5
- CSS3
- JavaScript
- [Amazon Web Services](https://aws.amazon.com/) & [Github Actions](https://github.com/features/actions)
- [Tailwind CSS](https://tailwindcss.com/), notably using [TailBlocks](https://tailblocks.cc/) to save time on design
- [Riot Games Tournament API](https://developer.riotgames.com/apis#tournament-stub-v4)

## How to Contribute

First, find an [issue](https://github.com/NicholasEwing/bubble-tea-league/issues) to work on.

If there's something you'd like to work on that doesn't have an issue, then [create a new one](https://github.com/NicholasEwing/bubble-tea-league/issues/new).

Next, make sure you've `git pull`'d on both the `master` and `development` branches. Then, create a new branch off of `development` to start working on your issue.

Example of updating branches:

```
git checkout master
git pull
git checkout development
git pull
```

Example of creating new branch off `development`:

```
git checkout development
git pull
git checkout -b my-new-branch
```

When you've finished work on your branch, open a pull request to merge it into `development`.

You'll need an approval from a [Code Owner](https://github.com/NicholasEwing/bubble-tea-league/blob/master/.github/CODEOWNERS) on your pull request before you can merge it into `development`.

Please ensure your pull request is [linked to the Github issue(s) you worked on](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue), this will automatically mark and close the issue(s) for us.

Currently, only [@NicholasEwing](https://github.com/NicholasEwing/) is set as a Code Owner to prevent any errors from being accidentally deployed.

Once your pull request has been merged into `development`, check the [Bubble Tea League test URL](http://test-bubble-tea-league.s3-website-us-east-1.amazonaws.com) to see if everything looks and works the way you expect.

Finally, once we've got changes on the `development` branch we want to go live to the world, we'll make a pull request from `development` -> `master`.

Any code changes pushed or merged into `master` will be automatically deployed to the [official BTL site](https://www.bubble-tea-league.com), so make sure it's tested and working on both desktop and mobile.

That's it!! :tada::tada:

If you have any questions, please leave comments in the appropriate issues / PRs.
