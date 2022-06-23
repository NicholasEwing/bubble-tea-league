const sequelize = require("../../../../sequelize");
const { MatchRoundPlayerStats, MatchRoundTeamStats, MatchRound, Player } =
  sequelize.models;
import { Op } from "sequelize";
import matchRoundsHandler from "../index";
import { createMocks } from "node-mocks-http";
import { assertStatusResponse } from "../../../../lib/jest-api-helpers";
import player from "../../../../sequelize/models/player";

describe("/api/match-rounds", () => {
  it("GET /match-rounds (Get all match rounds)", async () => {
    const { req, res } = createMocks();
    await matchRoundsHandler(req, res);
    const matchRounds = res._getJSONData();

    assertStatusResponse(res, 200);
    expect(matchRounds).toBeArray();

    if (!matchRounds.length) return;

    expect(matchRounds).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          tournamentCode: expect.any(String),
          MatchId: expect.any(Number),
        }),
      ])
    );
  });

  it("POST /match-rounds (Create a fake match round)", async () => {
    // See "sample JSON response" to see what Riot will send us when a LoL match finishes
    // docs: https://developer.riotgames.com/docs/lol#riot-games-api_tournament-api
    // make fake object riot will send us based off some ACTUAL teams in the database

    // build post object
    const matchResults = {
      startTime: 1234567890000,
      winningTeam: [
        // team 4
        { summonerName: "Not Drunk" },
        { summonerName: "Emperix" },
        { summonerName: "Raskotrug" },
        { summonerName: "CutieAF" },
        { summonerName: "ChiaSnax" },
      ],
      losingTeam: [
        // team 2
        { summonerName: "M1tchyPoo" },
        { summonerName: "Satanaei" },
        { summonerName: "Plobethewarrior" },
        { summonerName: "AIchy" },
        { summonerName: "Wıred" },
      ],
      shortCode: "NA2728-TOURNAMENTCODE0001",
      metaData: '{"MatchId":1}',
      gameId: "4304210544",
      gameName: "a123bc45-ab1c-1a23-ab12-12345a67b89c",
      gameType: "Practice",
      gameMap: 11,
      gameMode: "CLASSIC",
      region: "NA1",
    };

    const body = {
      matchResults,
    };

    const { req, res } = createMocks({ method: "POST", body });
    await matchRoundsHandler(req, res);
    assertStatusResponse(res, 201);

    // get PUUIDs of all 10 players since summoner names can change
    const winningPlayers = matchResults.winningTeam.map(
      (obj) => obj.summonerName
    );
    const losingPlayers = matchResults.losingTeam.map(
      (obj) => obj.summonerName
    );
    const players = [...winningPlayers, ...losingPlayers];
    const playerIds = [
      ...(await Player.findAll({
        attributes: ["id"],
        where: {
          summonerName: {
            [Op.or]: players,
          },
        },
      })),
    ].map((p) => p.id);

    expect(playerIds).toBeArrayOfSize(10);

    // ensure that 10 MatchRoundPlayerStats were created in the db
    const playerStats = await MatchRoundPlayerStats.findAll({
      where: {
        PlayerId: {
          [Op.or]: playerIds,
        },
      },
    });

    expect(playerStats).toBeArrayOfSize(10);

    expect(playerStats).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          kills: expect.any(Number),
          assists: expect.any(Number),
          deaths: expect.any(Number),
          champLevel: expect.any(Number),
          goldEarned: expect.any(Number),
          visionScore: expect.any(Number),
          championName: expect.any(String),
          championTransform: expect.any(Number),
          item0: expect.any(Number),
          item1: expect.any(Number),
          item2: expect.any(Number),
          item3: expect.any(Number),
          item4: expect.any(Number),
          item5: expect.any(Number),
          item6: expect.any(Number),
          summoner1Id: expect.any(Number),
          summoner2Id: expect.any(Number),
          teamPosition: expect.any(String),
          totalMinionsKilled: expect.any(Number),
          statPerks: expect.any(String),
          primaryRunePath: expect.any(Number),
          primaryRunePerks: expect.any(String),
          secondaryRunePath: expect.any(Number),
          secondaryRunePerks: expect.any(String),
          summonerName: expect.any(String),
          MatchRoundId: expect.any(Number),
          PlayerId: expect.any(Number),
        }),
      ])
    );

    // ensure that 2 MatchRoundTeamStats were created in the db
    const teamIds = [2, 4];
    const teamStats = await MatchRoundTeamStats.findAll({
      where: {
        TeamId: {
          [Op.or]: teamIds,
        },
      },
    });

    expect(teamStats).toBeArrayOfSize(2);

    expect(teamStats).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          kills: expect.any(Number),
          goldEarned: expect.any(Number),
          towersDestroyed: expect.any(Number),
          heraldsKilled: expect.any(Number),
          dragonsKilled: expect.any(Number),
          inhibitorsKilled: expect.any(Number),
          MatchRoundId: expect.any(Number),
          TeamId: expect.any(Number),
        }),
      ])
    );

    // ensure that a MatchRound has a winningTeamId and a losingTeamId

    // make sure team 4 "won" and team 2 "lost" in our fake match v5 callback
    const matchRound = await MatchRound.findAll({
      where: {
        winningTeamId: 4,
      },
    });

    expect(matchRound).toBeArrayOfSize(1); // only 1 match round should have a winning / losing team
  });
});
