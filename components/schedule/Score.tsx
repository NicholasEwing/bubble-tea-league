interface ScoreProps {
  teamOneScore: number;
  teamTwoScore: number;
}

export default function Score({
  teamOneScore = 0,
  teamTwoScore = 0,
}: ScoreProps) {
  return (
    <div className="score w-[calc(((100%-312px)/12*2+24px)] absolute ml-24 flex flex-col items-center justify-center font-medium tracking-widest text-white lg:static lg:ml-0 lg:w-20 lg:flex-row">
      <span
        className={`scoreTeam1 ${
          teamOneScore > teamTwoScore
            ? "text-[#c79e57] lg:relative lg:before:absolute lg:before:top-0 lg:before:-left-5 lg:before:block lg:before:w-6 lg:before:px-2 lg:before:pt-[2px] lg:before:text-sm lg:before:text-[#b19955] lg:before:content-['◀']"
            : "text-[#8fa3b0]"
        } mb-1 lg:mb-0 lg:text-white`}
      >
        {teamOneScore}
      </span>
      <span className="hyphen hidden lg:inline lg:text-white">-</span>
      <span
        className={`scoreTeam2 ${
          teamTwoScore > teamOneScore
            ? "text-[#c79e57] lg:relative lg:after:absolute lg:after:top-0 lg:after:-right-5 lg:after:block lg:after:w-6 lg:after:px-2 lg:after:pt-[2px] lg:after:text-sm lg:after:text-[#b19955] lg:after:content-['▶']"
            : "text-[#8fa3b0]"
        } lg:text-white`}
      >
        {teamTwoScore}
      </span>
    </div>
  );
}
