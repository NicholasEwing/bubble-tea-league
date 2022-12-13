import { Match, Team } from "@prisma/client";
import VodItem from "./VodItem";

interface RecentVodsProps {
  teams: Team[];
  pastSchedule: Match[];
}

export default function RecentVods({ teams, pastSchedule }: RecentVodsProps) {
  return (
    <div className="HomeVods w-full text-white">
      <div className="title pt-9 pl-4 font-medium uppercase tracking-widest text-[#8fa3b0]">
        RECENT MATCH VODS
      </div>
      <div className="vods-list grid gap-x-4 py-4 pl-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:flex-row">
        {pastSchedule.map((dateObj) => {
          return Object.values(dateObj)
            .flat()
            .map((match: any) => (
              <VodItem
                key={`VOD-${match.id}`}
                MatchId={match.id}
                teamOne={teams.find((t) => t.id === match.teamOneId)}
                teamTwo={teams.find((t) => t.id === match.teamTwoId)}
                bestOf={match.isPlayoffsMatch ? "Bo3" : "Bo1"}
                season={match.seasonId}
                matchRounds={match.matchRounds}
                scheduledTime={match.scheduledTime}
                vodLink={match.vodLink}
                matchWinnerTeamId={undefined}
                matchLoserTeamId={undefined}
              />
            ));
        })}
      </div>
    </div>
  );
}
