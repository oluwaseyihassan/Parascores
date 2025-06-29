import { FC, useMemo, useState } from "react";
import { Today } from "../types/types";
import { useTheme } from "../context/ThemeContext";
import { formatDateToReadable } from "../utils/helperFunctions";
import { Link } from "react-router-dom";
import { imagePlaceholders } from "../utils/imagePlaceholders";

type h2hProps = {
  h2h: {
    data: {
      data: Today[];
    };
    success: boolean;
  };
  homeId: number | null;
  awayId: number | null;
};

const HeadToHead: FC<h2hProps> = ({ h2h, homeId, awayId }) => {
  const { theme } = useTheme();
  const headToHead = h2h?.data?.data || [];
  const [sliceH2h, setSliceH2h] = useState(10);

  const h2hStats = useMemo(() => {
    if (!headToHead || !homeId || !awayId) {
      return { home: 0, away: 0, draw: 0 };
    }

    let homeWins = 0;
    let awayWins = 0;
    let draws = 0;

    headToHead.forEach((match) => {
      const homeTeam = match.participants?.find((team) => team.id === homeId);
      const awayTeam = match.participants?.find((team) => team.id === awayId);

      if (!homeTeam || !awayTeam) return;

      if (!homeTeam.meta.winner && !awayTeam.meta.winner) {
        draws++;
      } else if (homeTeam.meta.winner === true) {
        homeWins++;
      } else if (awayTeam.meta.winner === true) {
        awayWins++;
      }
    });

    return { home: homeWins, away: awayWins, draw: draws };
  }, [headToHead, homeId, awayId]);

  if (!headToHead || headToHead.length === 0) {
    return (
      <div
        className={`p-4 ${
          theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
        } rounded-lg text-center`}
      >
        <p>No head-to-head matches available</p>
      </div>
    );
  }

  return (
    <div
      className={`${
        theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
      } p-4 rounded-lg`}
    >
      <h2 className="text-lg font-semibold mb-4 text-center">Head to Head</h2>
      <div className="text-center mb-4">{headToHead?.length} Matches</div>

      <div className="flex justify-between items-center gap-4">
        <div className="text-center flex-1">
          <div className="text-2xl font-bold">{h2hStats.home}</div>
          <div className="text-sm mt-1">Home Wins</div>
          {/* <div>{Math.round((h2hStats.home / headToHead.length) * 100)}%</div> */}
        </div>

        <div className="text-center flex-1">
          <div className="text-2xl font-bold">{h2hStats.draw}</div>
          <div className="text-sm mt-1">Draws</div>
          {/* <div>{Math.round((h2hStats.draw / headToHead.length) * 100)}%</div> */}
        </div>

        <div className="text-center flex-1">
          <div className="text-2xl font-bold">{h2hStats.away}</div>
          <div className="text-sm mt-1">Away Wins</div>
          {/* <div>{Math.round((h2hStats.away / headToHead.length) * 100)}%</div> */}
        </div>
      </div>

      <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="flex h-full">
          <div
            className="bg-blue-500 h-full"
            style={{ width: `${(h2hStats.home / headToHead?.length) * 100}%` }}
          />
          <div
            className="bg-gray-400 h-full"
            style={{ width: `${(h2hStats.draw / headToHead?.length) * 100}%` }}
          />
          <div
            className="bg-red-500 h-full"
            style={{ width: `${(h2hStats.away / headToHead?.length) * 100}%` }}
          />
        </div>
      </div>
      <div className="text-base flex flex-col gap-2 mt-4">
        {headToHead?.slice(0, sliceH2h).map((match) => {
          const homeTeam = match.participants?.find(
            (p) => p.meta.location === "home"
          );
          const awayTeam = match.participants?.find(
            (p) => p.meta.location === "away"
          );

          const homeScore = match.scores?.find(
            (score) =>
              score.description === "CURRENT" &&
              score.score.participant === "home"
          )?.score.goals;

          const awayScore = match.scores?.find(
            (score) =>
              score.description === "CURRENT" &&
              score.score.participant === "away"
          )?.score.goals;

          return (
            <div
              className={`${
                theme === "dark" ? "bg-dark/70" : "bg-light"
              } p-1 rounded-lg flex items-center gap-2 flex-col`}
              key={match.id}
            >
              <div className="justify-between px-2 flex items-center gap-x-2 w-full">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 flex justify-center items-center">
                    <img
                      src={`${
                        match.league.image_path || imagePlaceholders.team
                      }`}
                      alt=""
                    />
                  </div>
                  <span>{match.league.name}</span>
                </div>
                <div className="text-xs text-gray-400 text-center">
                  {formatDateToReadable(match.starting_at ?? "")}
                </div>
              </div>
              <Link
                to={`/match/${match.id}`}
                className="flex w-full justify-center"
              >
                <div className="flex items-center w-[45%] justify-end text-right">
                  <div
                    className={
                      homeTeam?.meta.winner === false ? "text-gray-400" : ""
                    }
                  >
                    {homeTeam?.name || ""}
                  </div>

                  <div className="h-5 w-5 flex justify-center items-center">
                    <img
                      src={homeTeam?.image_path || imagePlaceholders.team}
                      alt=""
                      className="w-4"
                    />
                  </div>
                </div>

                <div className="flex justify-center items-center gap-1 w-[10%] px-1">
                  <span>{homeScore}</span>-<span>{awayScore}</span>
                </div>

                <div className="flex items-center w-[45%]">
                  <div className="h-5 w-5 flex justify-center items-center">
                    <img
                      src={awayTeam?.image_path || imagePlaceholders.team}
                      alt=""
                      className="w-4"
                    />
                  </div>

                  <div
                    className={
                      awayTeam?.meta.winner === false ? "text-gray-400" : ""
                    }
                  >
                    {awayTeam?.name || ""}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
      {headToHead.length > sliceH2h && (
        <button
          onClick={() => setSliceH2h(headToHead.length)}
          className="mt-4 w-full bg-accent text-white py-2 rounded-lg hover:bg-accent/80 transition duration-200"
          disabled={sliceH2h === headToHead.length}
        >
          Show All {headToHead.length - sliceH2h} Matches
        </button>
      )}
      {headToHead.length > 10 && sliceH2h === headToHead.length && (
        <button
          onClick={() => setSliceH2h(10)}
          className="mt-4 w-full bg-accent text-white py-2 rounded-lg hover:bg-accent/80 transition duration-200"
        >
          Show Less
        </button>
      )}
    </div>
  );
};

export default HeadToHead;
