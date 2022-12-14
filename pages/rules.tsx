import React from "react";
import SectionContainer from "../components/admin/table/SectionContainer";
import TextHeadingContainer from "../components/admin/TextHeadingContainer";

export default function Rules() {
  return (
    <div className="relative overflow-hidden bg-[#0a0e13] py-16">
      <div className="hidden lg:absolute lg:inset-y-0 lg:block lg:h-full lg:w-full">
        <div
          className="relative mx-auto h-full max-w-prose text-lg opacity-50"
          aria-hidden="true"
        >
          <svg
            className="absolute top-12 left-full translate-x-32 transform text-btl-pink 2xl:translate-x-96"
            width={404}
            height={384}
            fill="currentColor"
            viewBox="0 0 404 384"
          >
            <defs>
              <pattern
                id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect x={0} y={0} width={4} height={4} />
              </pattern>
            </defs>
            <rect
              width={404}
              height={384}
              // eslint-disable-next-line
              fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)"
            />
          </svg>
          <svg
            className="absolute top-1/2 right-full -translate-y-1/2 -translate-x-32 transform text-btl-blue 2xl:-translate-x-96"
            width={404}
            height={384}
            fill="currentColor"
            viewBox="0 0 404 384"
          >
            <defs>
              <pattern
                id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect x={0} y={0} width={4} height={4} />
              </pattern>
            </defs>
            <rect
              width={404}
              height={384}
              // eslint-disable-next-line
              fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)"
            />
          </svg>
          <svg
            className="absolute bottom-12 left-full translate-x-32 transform text-btl-pink 2xl:translate-x-96"
            width={404}
            height={384}
            fill="currentColor"
            viewBox="0 0 404 384"
          >
            <defs>
              <pattern
                id="d3eb07ae-5182-43e6-857d-35c643af9034"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect x={0} y={0} width={4} height={4} />
              </pattern>
            </defs>
            <rect
              width={404}
              height={384}
              // eslint-disable-next-line
              fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)"
            />
          </svg>
        </div>
      </div>
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-prose text-lg text-white">
          <h1>
            <span className="block text-center text-lg font-semibold">
              - Rules -
            </span>
            <strong className="mt-2 block text-center text-3xl font-extrabold leading-8 tracking-tight sm:text-4xl">
              The BTL Ruleset
            </strong>
          </h1>
          <p className="mt-8 text-xl leading-8">
            Why this exists: To establish a common set of rules and guidelines
            to avoid conflicts. We promote discussion and conversation in
            grey-area rulings.
          </p>
        </div>
        <div className="prose prose-lg prose-indigo mx-auto mt-6 max-w-prose space-y-8 text-gray-300">
          <section>
            <h2>
              <strong className="text-white">
                Player Definitions and Responsibilities:
              </strong>
            </h2>
            <ul className="space-y-4">
              <li>
                <strong className="text-white">Council:</strong> The governing
                body consisting of the team captain or proxy from each team.
                Decisions will be made on a 2/3rds majority basis.
              </li>
              <li>
                <strong className="text-white">Team Captain:</strong>{" "}
                Scheduling, communicating with other team captains, ensuring
                team is on-time, dealing with substitutes. DON&apos;T RELY ON
                YOUR CAPTAIN TO DO EVERYTHING.
              </li>
              <li>
                <strong className="text-white">Banner:</strong> Player that bans
                champions - Should know the pick/ban rules.
              </li>
              <li>
                <strong className="text-white">Player:</strong> one of five core
                members of a chartered team.
              </li>
              <li>
                <strong className="text-white">Substitute (Free Agent):</strong>{" "}
                Player that subs for a team.
              </li>
              <li>
                <strong className="text-white">Spectator:</strong> Non-playing
                viewer that does not affect the game outcome.
              </li>
              <p>
                Note: Team names should not include anything racist/sexist/etc.
              </p>
            </ul>
          </section>
          <section>
            <h2>
              <strong className="text-white">Pick/Ban Guidelines:</strong>
            </h2>
            <p>
              Use{" "}
              <a
                className="text-btl-pink underline underline-offset-4"
                href="https://draftlol.dawe.gg/"
                target="_blank"
                rel="noreferrer"
              >
                https://draftlol.dawe.gg/
              </a>
              .
            </p>
            <p>Follow tournament style pick/bans.</p>
            <p>
              If a ban is unable to happen for a technical reason (e.g. client
              froze) then the draft is remade with the same pick/bans that
              previously occurred.
            </p>
            <p>
              If a ban is unable to happen for a non-technical reason (e.g.
              banner cannot find champion to ban) then the following applies:
            </p>
            <ul>
              <li>
                To not lose the pick/ban, the banning team member must
                immediately join the opposing team&apos;s Discord channel to
                explain reasoning AND give the intended pick/ban.
              </li>
              <li>
                If the next champion is banned or pick, the ban is lost. No
                remakes.
              </li>
            </ul>
            <p>
              In case of violation that results in a ban loss, first round bans
              will be taken in numerical order.
            </p>
            <p>
              ProDraft will random pick and no-ban at zero seconds. No grace
              period on the site.
            </p>
            <p>
              Trades must occur before the 20 second mark before load-in. If
              this is violated, we will force players to play with the champions
              they had at 20 seconds.
            </p>
            <p>
              If the client is preventing you from swapping before this mark,
              immediately inform the other team before 20 seconds.
            </p>
            <p>
              Players may swap lanes. Only substitutes must have roles declared
              before the game/series begins. Teams do not have to notify
              opponents about lane swaps that do not concern substitutes.
            </p>
            <p>
              New champions and reworked champions will be disabled for one
              competitive week upon their release.
            </p>
            <p>
              Champions disabled in LCS will be disabled in BTL until their bugs
              are patched out.
            </p>
          </section>
          <section>
            <h2>
              <strong className="text-white">Substitutes Guidelines:</strong>
            </h2>
            <p>
              Pull from the official sub pool first. Find the sub closest in
              skill to the player who will be absent. The council must approve
              any subs. The team subbing in a player will not have a vote. Must
              have 3 votes to approve sub.
            </p>
            <p>
              If an official sub cannot be found then a player from a
              third-party team or outside of the sub pool may sub. Before
              resorting to this rule, teams must demonstrate evidence showing
              their attempts to recruit all official subs (of appropriate skill
              level or below).
            </p>
            <p>Have a substitute ready at least 24 hours in advance:</p>
            <ul>
              <li>
                If the opposing team is informed of a sub within 24 to 12 hours
                before the game, one first round ban will be taken.
              </li>
              <li>12 to 6 hours - two first round bans.</li>
              <li>6 to 0 all first round bans.</li>
              <li>
                If a team does not have a sub at the scheduled start of the
                game, the team will automatically forfeit.
              </li>
            </ul>
            <p>
              Teams must inform opposing teams the role and summoner name of any
              subs. If the sub plays a different role than informed, the
              opposing team may pause the game and the sub&apos;s team will
              forfeit.
            </p>
            <p>
              Teams may sub a maximum of two members on their team in any given
              game. This maximum is down to one in playoff series.
            </p>
            <p>The core team does not have to reveal their roles.</p>
            <p>
              Emergencies will be handled on a case-by-case basis, with
              preference towards emergency sub. If a sub cannot be found by the
              scheduled game start time we will default to reschedule. To count
              as an emergency, players must attempt to make contact at their
              earliest possible opportunity. Council must rule that the
              situation constitutes an emergency. Emergency subs will follow the
              rules above and will warrant an extra ban granted to the
              victimized team.
            </p>
            <p>
              New potential additions to the official sub list must be run
              through a League organizer (Bryan/Elena/etc). New additions will
              not be considered part of the official sub list until a week after
              submission.
            </p>
          </section>
          <section>
            <h2>
              <strong className="text-white">All-Chat Guidelines:</strong>
            </h2>
            <p>
              We will penalize all-chatting in the window past 2 minutes in game
              and before 30 seconds until nexus explosion. You may all-chat
              during pauses for issues and must keep chatting issue-related.
              Things that are not okay to type include and are not limited to:
            </p>
            <blockquote className="text-white">
              &quot;Not even close bb&quot;
            </blockquote>
            <blockquote className="text-white">
              &quot;wow I suck&quot;
            </blockquote>
            <blockquote className="text-white">
              &quot;omg smite king&quot;
            </blockquote>
            <p>
              For more context feel free to reach out. TL;DR: Don&apos;t be a
              dumbf*** and don&apos;t BM. Adjudicators will determine what is
              and isn&apos;t permissible.
            </p>
          </section>
          <section>
            <h2>
              <strong className="text-white">Spectating Guidelines:</strong>
            </h2>
            <p>
              After the end of a game, both teams should not enter the
              spectators&apos; Discord lobby until at least 3 minutes have
              passed to avoid spoilers for the game.
            </p>
            <p>
              Spectators should not go into team Discord channels before,
              during, and after games unless given permission by the team in the
              chat. Exceptions may made by arbiters who must pass information or
              expedite the game process.
            </p>
            <p>
              Both teams must use designated rooms in the Bubble Tea Discord
              server.
            </p>
            <p>
              Streamers must be in lobby by schedule game start unless both
              teams have agreed to wait.
            </p>
            <p>
              Spectators may not talk to or message players in or between games
              about strategy/play/etc.
            </p>
          </section>
          <section>
            <h2>
              <strong className="text-white">Tardiness:</strong>
            </h2>
            <p>
              If a player is not in lobby by game time, the team will lose one
              ban every 5 minutes up until 15 minutes, at which point they will
              forfeit.
            </p>
            <p>
              If a player communicates they will be late by more than 15
              minutes, their team will forfeit.
            </p>
            <p>Rule will be enforced unless there has been prior notice.</p>
            <p>
              Prior notice about lateness must be given 6 hours beforehand and
              given to the opposing team captain. Opposing captains must
              approve.
            </p>
          </section>
          <section>
            <h2>
              <strong className="text-white">Scheduling:</strong>
            </h2>
            <p>
              Use this:{" "}
              <a
                className="text-btl-pink underline underline-offset-4"
                href="https://whenisgood.net/"
                target="_blank"
                rel="noreferrer"
              >
                https://whenisgood.net/
              </a>
              .
            </p>
            <p>
              Availability info must be submitted via whenisgood by Thursday
              Midnight (PST) for the coming week to their team captains.
              Captains/proxies must have scheduled games by Friday Midnight
              (PST).
            </p>
            <p>
              Games should be scheduled with a preference for Sunday and Monday
              nights.
            </p>
            <p>
              Scheduling rule violations will result in a strike. Three strikes
              will result in deferred status for playing in future season(s).
            </p>
            <p>
              <strong className="text-white">NOTE:</strong> Times on whenisgood
              are times that are ACTUALLY 100% GOOD.
            </p>
            <p>These rules apply to the regular season and playoffs.</p>
            <p>
              Once a game is scheduled, put the game date/time in the Schedule
              and Standings tab and <code className="text-white">@here</code>{" "}
              the BTL Discord channel.
            </p>
            <p>
              If a captain can show they have attempted to schedule with the
              opposing team (chat logs screen shots) then their team will be
              exempt from any schedule related strikes.
            </p>
            <p>
              Teams should pick a game day with the least amount of subs based
              on the whenisgood.
            </p>
          </section>
          <section>
            <h2>
              <strong className="text-white">Playoffs (Bo3):</strong>
            </h2>
            <p>
              Games in a Bo3 series will be separated by 10 minutes from nexus
              explosion to the start of pick/ban.
            </p>
            <p>
              All games must be played in one day back-to-back (unless there is
              absolutely no recourse).
            </p>
            <p>
              Team must give side selection by the 3 minute marker after nexus
              explosion to a spectator (preferably a council member). The
              spectator will immediately give the opposing team their next side
              at the three minute mark.
            </p>
            <p>
              Side select for 1st game goes to the higher seed in each
              team&apos;s first match. After that point, the team dropping later
              from the Winner&apos;s Bracket (or not at all) will get side
              selection for the 1st game.
            </p>
            <p>Side select for 2nd game goes to the loser of game 1.</p>
            <p>
              If both teams dropped at the same time (or not at all), seed will
              determine 1st game side select.
            </p>
            <p>
              Side selection for games past the first will go to the team who
              lost the previous game.
            </p>
            <p>
              Side selection must be given to the opposing team 24 hours before
              a series. A team will be defaulted to blue if side select
              isn&apos;t given in time.
            </p>
            <p>
              No BM in all-chat during games or in lobby between BoX games.
              Teams violating this may have bans docked from the next game they
              play against the victimized team.
            </p>
          </section>
          <section>
            <h2>
              <strong className="text-white">Prizing:</strong>
            </h2>
            <ul>
              <li>
                The 1st place team will receive 2,000 RP per player and a
                special Discord flair.
              </li>
              <li>The 2nd place team will receive 1,000 RP per player.</li>
            </ul>
          </section>
          <section>
            <h2>
              <strong className="text-white">Tiebreakers:</strong>
            </h2>
            <p>
              <strong className="text-white">Two-way Ties:</strong>
            </p>
            <p>
              Tiebreakers at the end of the regular season will be broken first
              by H2H record. All scenarios below will occur if the H2H is 1-1.
            </p>
            <p>
              If the two-way tie would be for 1st and 2nd place, a tiebreaker
              game will be played, with the team with faster cumulative victory
              times given side select.
            </p>
            <p>
              If the two-way tie would be for 2nd and 3rd place, a tiebreaker
              game will be played, with the team with faster cumulative victory
              times given side select.
            </p>
            <p>
              If any other two-way tie exists, the team with faster cumulative
              victory times will be declared the winner of the tie.
            </p>
            <p>
              <strong className="text-white">Three-way Ties:</strong>
            </p>
            <p>
              Tiebreakers at the end of the regular season will be broken first
              by aggregate H2H record.
            </p>
            <p>
              If only one team out of the three is 0-2 in aggregate H2H, they
              will be given the lowest seed. A two-way tiebreaker will declared
              among the 2 remaining teams.
            </p>
            <p>
              If only one team out of the three is 2-0 in aggregate H2H, they
              will be given the highest seed. A two-way tiebreaker will declared
              among the 2 remaining teams.
            </p>
            <p>
              If all teams are 1-1 in aggregate H2H, the team with the highest
              cumulative victory time will be given the lowest seed. A two-way
              tiebreaker will declared among the 2 remaining teams.
            </p>
            <p>
              WE WILL THINK VERY HARD IF THERE ARE BIGGER TIES THAN THIS (SAME
              BASIC GUIDELINES).
            </p>
          </section>
          <section>
            <h2>
              <strong className="text-white">
                Game Records/Record Keeping:
              </strong>
            </h2>
            <p>
              Blue Side is responsible for snipping the pick/ban, placing the
              snip into the BTL chat, and linking it into the &quot;Game
              Records&quot; tab in the BTL doc.
            </p>
            <code className="text-btl-blue">
              Note from Nicholas: I&apos;d like to eventually create an easy way
              to paste these links onto the BTL site so a Google Sheet
              isn&apos;t needed anymore. Give us some suggestions on how I can
              do this!
            </code>
            <p>
              Red Side is responsible for making the pro-draft and distributing
              the pro-draft links.
            </p>
            <p className="line-through">
              The winning team will be responsible for snipping the end game
              screen, placing the snip into the BTL chat, and linking it into
              the &apos;Game Records&apos; tab in the BTL doc. Remember to
              circle which team won before posting and make sure the game time
              is visible.
            </p>
            <code className="text-btl-blue">
              Note from Nicholas: Tournament codes will now be used. Riot Games
              will shoot over the game results and this site will automatically
              track / progress / records the season.
            </code>
            <p>
              Use the Discord link to link any snips/screen shots in the doc.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
