import Image from "next/image";
import Link from "next/link";
import React from "react";
import Match from "./Match";
import BracketCell from "./BracketCell";
import styles from "./PlayoffsBrackets.module.css";
import Team from "./Team";
import BracketColumn from "./BracketColumn";
import ColumnContainer from "./ColumnContainer";

export default function PlayoffsBrackets() {
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

  // one team in Round object means it's a bye
  // bracket -> round -> match
  const bracket = {
    upperBracket: [
      {
        title: "Upper Bracket Round 1",
        scheduledTime: "6/18 - 7:00 PM PST",
        matches: [
          {
            teamOne: {
              teamId: 1,
              teamName: "Panic in Our Oceans",
              tricode: "PIO",
              wins: 0,
            },
            teamTwo: {
              teamId: 2,
              teamName: "The Student Council",
              tricode: "TSC",
              wins: 0,
            },
          },
          { teamOne: {}, teamTwo: {} },
        ],
      },
      {
        title: "Upper Bracket Round 2",
        scheduledTime: "6/18 - 7:00 PM PST",
        matches: [
          { teamOne: {}, teamTwo: {} },
          { teamOne: {}, teamTwo: {} },
        ],
      },
      {
        title: "Upper Bracket Semifinals",
        scheduledTime: "6/18 - 7:00 PM PST",
        matches: [{ teamOne: {}, teamTwo: {} }],
      },
      {},
      {},
      {},
      {
        title: "Finals",
        scheduledTime: "6/18 - 7:00 PM PST",
        matches: [{ redTeam: {}, blueTeam: {} }],
      },
    ],
    lowerBracket: [
      {},
      {
        title: "Lower Bracket Round 1",
        scheduledTime: "6/18 - 7:00 PM PST",
        matches: [
          { teamOne: {}, teamTwo: {} },
          { teamOne: {}, teamTwo: {} },
        ],
      },
      {
        title: "Lower Bracket Round 2",
        scheduledTime: "6/18 - 7:00 PM PST",
        matches: [
          { teamOne: {}, teamTwo: {} },
          { teamOne: {}, teamTwo: {} },
        ],
      },
      {
        title: "Lower Bracket Round 3",
        scheduledTime: "6/18 - 7:00 PM PST",
        matches: [
          { teamOne: {}, teamTwo: {} },
          { teamOne: {}, teamTwo: {} },
        ],
      },
      {
        title: "Lower Bracket Round 4",
        scheduledTime: "6/18 - 7:00 PM PST",
        matches: [{ teamOne: {}, teamTwo: {} }],
      },
      {
        title: "Lower Bracket Semifinals",
        scheduledTime: "6/18 - 7:00 PM PST",
        matches: [{ teamOne: {}, teamTwo: {} }],
      },
      {},
    ],
  };

  return (
    <div className="stage max-w-full">
      <div className="StandingsBracketV2 pl-4 overflow-x-auto overflow-y-hidden relative select-none w-full">
        <div className={styles.bracket}>
          <div className="UpperBracket row">
            <ColumnContainer>
              {bracket.upperBracket.map((round, i) =>
                round.title ? (
                  <BracketColumn key={round.title}>
                    <BracketCell title={round.title}>
                      {round.matches.map((m, i) => (
                        <Match key={`${round.title}-${i + 1}`}>
                          <Team {...m.teamOne} />
                          <Team {...m.teamTwo} />
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
              {bracket.lowerBracket.map((round, i) =>
                round.title ? (
                  <BracketColumn key={round.title}>
                    <BracketCell title={round.title}>
                      {round.matches.map((m, i) => (
                        <Match key={`${round.title}-${i + 1}`}>
                          <Team />
                          <Team />
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
  );
}
