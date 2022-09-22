[Click here to try a live demo!](https://bubble-tea-league.vercel.app/)

**Some notable pages (with placeholder data):**
- [Match results page](https://bubble-tea-league-4temqtag2-nicholasewing.vercel.app/match-results/11) (some info missing due to limits of development key!)
- ~~Admin page~~ (currently hidden until I get a prod API key, I don't want to get my key banned from someone spamming the demo page!)

An example of the admin page (*forgive the choppy quality on my ancient Mac / compressed video quality!)*:

https://user-images.githubusercontent.com/24522500/191630952-9b962c4a-3e6f-49b0-9fdf-b566b537d052.mp4

Right now this app is not very functional since a Season of BTL hasn't kicked off. We'll have a season kicking off in Jan / Feb of 2023 which will show more functionality.

Later, I'll post a preview version of the site that allows you to test out the admin functionality _without_ running up my dev key API limits or charging me a ton of money over Planetscale. (: I'll need to add a lot of guard-rails to prevent people from abusing it maliciously!

## Progress:
- [X] Make polished front-end
- [X] Finalize back-end logic for tournament generation
- [X] Get MVP online to gather feedback from BTL admins
- [ ] Apply for Riot Games API production key (strict process, needs placeholder values)
- [ ] Integrate Typescript
- [ ] Clean up / refactor code where needed (it's a bit gross right now, such is the price of speed!)
- [ ] Integrate user feedback before / during Season 9
- [ ] Add and configure [Dependabot](https://github.com/dependabot) for easier maintainence
- [ ] Get this bad boy to a 90+ [Lighthouse score](https://web.dev/measure/) for educational purposes
 
## Purpose

This app handles the tournament administration and logic of the BTL via the Riot Games API.

**Technologies Used:**
* [Riot Games API](https://developer.riotgames.com/)
* [Next.js](https://nextjs.org/) (hosted on [Vercel](https://vercel.com/))
* MySQL (hosted on [Planetscale](https://planetscale.com/))
* [Tailwind CSS](https://tailwindcss.com/)
* [Next Auth](https://next-auth.js.org/) for user authentication
* [Prisma](https://www.prisma.io/)
* Amazon Web Services (currently only using an [S3 Bucket](https://aws.amazon.com/s3/) for user-uploaded image storage)

## Trello Board

https://trello.com/b/v4dFicAM/bubble-tea-leaguecom
