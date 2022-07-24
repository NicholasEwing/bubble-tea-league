import Image from "next/image";
import Link from "next/link";
import React from "react";
import Match from "./Match";
import BracketCell from "./BracketCell";
import styles from "./PlayoffsBrackets.module.css";
import Team from "./Team";
import BracketColumn from "./BracketColumn";
import ColumnContainer from "./ColumnContainer";

export default function PlayoffsBrackets({
  seasonPlayoffsMatches,
  seasonPlayoffsMatchRounds,
  seasonTeams,
}) {
  // for each round, create a column

  // upper bracket - rounds 1 -> 3
  // lower bracket - rounds 1 -> 4
  // finals, 6th round

  // flow
  // - upper bracket Round 1
  // - upper bracket Round 2 / lower bracket Round 1
  // - upper bracket Round 3 / lower bracket Round 2
  // - lower bracket Round 3
  // - lower bracket Round 4
  // finals

  // placement from Regular Season
  // 1st place - bye
  // 2nd place - bye
  // 3rd - 6th - winner's bracket
  // 7th - 10th - loser's bracket

  // reach out to database for all playoffs matches

  // form data into shape below
  // console.log("season playoff matches", seasonPlayoffsMatches);

  let bracket = {};
  const upperBracketMatches = seasonPlayoffsMatches.filter(
    (m) => m.isUpperBracket
  );
  const lowerBracketMatches = seasonPlayoffsMatches.filter(
    (m) => !m.isUpperBracket
  );
  bracket.upperBracket = upperBracketMatches;
  bracket.lowerBracket = lowerBracketMatches;

  // we want to turn our playoffs matches info into this shape
  // upperBracket: [
  //   {
  //     title: "Upper Bracket Round 1",
  //     matches: [
  //       {..some match info},
  //       {...etc}
  //     ]
  //   },
  //   {
  //    title: "Upper Bracket Round 2",
  //    matches: [...]
  //   }
  // ],
  // lowerBracket: {
  //  ...and so on
  // }

  // use this outer reduce to group upperBracket / lowerBracket together
  bracket = Object.keys(bracket).reduce((acc, bracketName) => {
    // use this inner reduce to create an object for every bracket round
    const groupedRounds = bracket[bracketName].reduce((group, match) => {
      const groupNeedsBracketRoundObj =
        !group.filter((o) => o.bracketRound === match.bracketRound).length > 0;

      if (groupNeedsBracketRoundObj) {
        let roundName = "";
        if (match.isUpperBracket) {
          if (match.bracketRound < 3) roundName = `Round ${match.bracketRound}`;

          if (match.bracketRound === 3) roundName = "Semifinals";

          if (match.bracketRound === 4) roundName = "Finals";
        } else {
          if (match.bracketRound < 4) roundName = `Round ${match.bracketRound}`;

          if (match.bracketRound === 5) roundName = "Semifinals";
        }

        const title = match.isUpperBracket
          ? `Upper Bracket ${roundName}`
          : `Lower Bracket ${roundName}`;

        const matchRounds = seasonPlayoffsMatchRounds.filter(
          (spomr) => spomr.MatchId === match.id
        );

        group.push({
          bracketRound: match.bracketRound,
          title: title, // make the title when initially creating the object for this bracket round
          matches: [
            {
              ...match,
              matchRounds: matchRounds,
            },
          ],
        });
      } else {
        // add match to its appropriate bracket round object
        const bracketRoundObj = group.find(
          (o) => o.bracketRound === match.bracketRound
        );

        const matchRounds = seasonPlayoffsMatchRounds.filter(
          (spomr) => spomr.id === match.MatchId
        );

        bracketRoundObj.matches.push({ ...match, matchRounds: matchRounds });
      }
      return group;
    }, []);

    acc[bracketName] = groupedRounds;

    return acc;
  }, {});

  // Add empty objects for some spacing since
  // tying it to logic would be v tedious
  // and deadlines are a thing
  bracket.upperBracket.splice(3, 0, {}, {}, {});
  bracket.lowerBracket.splice(0, 0, {});
  bracket.lowerBracket.splice(6, 0, {});

  // create team pages and link teams accordingly

  // one team in Round object means it's a bye
  // bracket -> round -> match
  // const bracket = {
  //   upperBracket: [
  //     {
  //       title: "Upper Bracket Round 1",
  //       // scheduledTime: "6/18 - 7:00 PM PST",
  //       matches: [
  //         {
  //           teamOne: {
  //             teamId: 1,
  //             teamName: "Panic in Our Oceans",
  //             tricode: "PIO",
  //             wins: 1,
  //           },
  //           teamTwo: {
  //             teamId: 2,
  //             teamName: "The Student Council",
  //             tricode: "TSC",
  //             wins: 2,
  //           },
  //         },
  //         { teamOne: {}, teamTwo: {} },
  //       ],
  //     },
  //     {
  //       title: "Upper Bracket Round 2",
  //       scheduledTime: "6/18 - 7:00 PM PST",
  //       matches: [
  //         { teamOne: {}, teamTwo: {} },
  //         { teamOne: {}, teamTwo: {} },
  //       ],
  //     },
  //     {
  //       title: "Upper Bracket Semifinals",
  //       scheduledTime: "6/18 - 7:00 PM PST",
  //       matches: [{ teamOne: {}, teamTwo: {} }],
  //     },
  //     {},
  //     {},
  //     {},
  //     {
  //       title: "Finals",
  //       scheduledTime: "6/18 - 7:00 PM PST",
  //       matches: [{ redTeam: {}, blueTeam: {} }],
  //     },
  //   ],
  //   lowerBracket: [
  //     {},
  //     {
  //       title: "Lower Bracket Round 1",
  //       scheduledTime: "6/18 - 7:00 PM PST",
  //       matches: [
  //         { teamOne: {}, teamTwo: {} },
  //         { teamOne: {}, teamTwo: {} },
  //       ],
  //     },
  //     {
  //       title: "Lower Bracket Round 2",
  //       scheduledTime: "6/18 - 7:00 PM PST",
  //       matches: [
  //         { teamOne: {}, teamTwo: {} },
  //         { teamOne: {}, teamTwo: {} },
  //       ],
  //     },
  //     {
  //       title: "Lower Bracket Round 3",
  //       scheduledTime: "6/18 - 7:00 PM PST",
  //       matches: [
  //         { teamOne: {}, teamTwo: {} },
  //         { teamOne: {}, teamTwo: {} },
  //       ],
  //     },
  //     {
  //       title: "Lower Bracket Round 4",
  //       scheduledTime: "6/18 - 7:00 PM PST",
  //       matches: [{ teamOne: {}, teamTwo: {} }],
  //     },
  //     {
  //       title: "Lower Bracket Semifinals",
  //       scheduledTime: "6/18 - 7:00 PM PST",
  //       matches: [{ teamOne: {}, teamTwo: {} }],
  //     },
  //     {},
  //   ],
  // };

  return seasonTeams.length ? (
    <div className="stage max-w-full">
      <div className="StandingsBracketV2 pl-4 overflow-x-auto overflow-y-hidden relative select-none w-full sm:pl-6">
        <div className={styles.bracket}>
          <div className="UpperBracket row">
            <ColumnContainer>
              {bracket.upperBracket?.map((round, i) =>
                round.title ? (
                  <BracketColumn key={round.title}>
                    <BracketCell title={round.title}>
                      {round.matches.map((m, i) => (
                        <Match key={`${round.title}-${i + 1}`}>
                          <Team
                            isUpperBracket
                            matchId={m.id}
                            team={seasonTeams.find((t) => t.id === m.teamOne)}
                            matchWinnerTeamId={m.matchWinnerTeamId}
                            matchLoserTeamId={m.matchLoserTeamId}
                            matchRounds={m.matchRounds}
                          />
                          <Team
                            isUpperBracket
                            matchId={m.id}
                            team={seasonTeams.find((t) => t.id === m.teamTwo)}
                            matchWinnerTeamId={m.matchWinnerTeamId}
                            matchLoserTeamId={m.matchLoserTeamId}
                            matchRounds={m.matchRounds}
                          />
                        </Match>
                      ))}
                    </BracketCell>
                  </BracketColumn>
                ) : (
                  <BracketColumn key={`empty-${i + 1}`}>
                    <BracketCell />
                  </BracketColumn>
                )
              )}
            </ColumnContainer>
          </div>
          <div className="LowerBracket row">
            <ColumnContainer>
              {bracket.lowerBracket?.map((round, i) =>
                round.title ? (
                  <BracketColumn key={round.title}>
                    <BracketCell title={round.title}>
                      {round.matches.map((m, i) => (
                        <Match key={`${round.title}-${i + 1}`}>
                          <Team
                            matchId={m.id}
                            team={seasonTeams.find((t) => t.id === m.teamTwo)}
                            matchWinnerTeamId={m.matchWinnerTeamId}
                            matchLoserTeamId={m.matchLoserTeamId}
                            matchRounds={m.matchRounds}
                          />
                          <Team
                            matchId={m.id}
                            team={seasonTeams.find((t) => t.id === m.teamTwo)}
                            matchWinnerTeamId={m.matchWinnerTeamId}
                            matchLoserTeamId={m.matchLoserTeamId}
                            matchRounds={m.matchRounds}
                          />
                        </Match>
                      ))}
                    </BracketCell>
                  </BracketColumn>
                ) : (
                  <BracketColumn key={`empty-${i + 1}`}>
                    <BracketCell />
                  </BracketColumn>
                )
              )}
            </ColumnContainer>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <>
      <div className="title m-4 lg:m-9 lg:mb-4 font-medium text-xl">
        Brackets
      </div>
      <h1 className="flex justify-center text-white font-thin text-5xl m-8">
        No teams registered for this season yet.
      </h1>
    </>
  );
}
