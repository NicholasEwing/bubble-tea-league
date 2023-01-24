import { Match, MatchRoundPlayerStats, Team } from "@prisma/client";

type BestOf = "Bo1" | "Bo3";

type TeamSide = "blue" | "red";

type PlayerRow = [MatchRoundPlayerStats, MatchRoundPlayerStats];

interface TeamWithInfo extends Team {
  groupStageWins: Match[];
  groupStageLosses: Match[];
}

type ComparisonTab = "stats" | "items" | "abilities" | "runes";

export type { BestOf, TeamSide, PlayerRow, TeamWithInfo, ComparisonTab };
