import PlayerHeader from "./PlayerHeader";

export default function PlayerFocusHeaders({
  player,
  comparedPlayer,
  focusedPlayer,
}) {
  return (
    <>
      <div className="StatsMatchupPlayers hidden xl:flex font-semibold text-[#8fa3b0] bg-[#0a0e13] flex-1 h-full">
        <PlayerHeader player={player} isPrimary />
        <PlayerHeader player={comparedPlayer} />
      </div>
      <div className="StatsMatchupPlayers flex xl:hidden font-semibold text-[#8fa3b0] bg-[#0a0e13] flex-1 h-full">
        <PlayerHeader player={focusedPlayer} isPrimary />
      </div>
    </>
  );
}
