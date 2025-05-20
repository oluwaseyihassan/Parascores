import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Fixture, League, Today } from "../types/types";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFixtureById } from "../api/queries";
import Events from "./Events";
import { FaStar } from "react-icons/fa";
import { useFavorites } from "../context/FavoritesContext";
// import {useCountDown} from "../hooks/useCountDown";

type props = {
  league: League;
  activeLeague: boolean;
  fixtureId: number | undefined;
  setFixtureId: Dispatch<SetStateAction<number | undefined>>;
  filterFixtures: string;
  isLeagueFavorite: (id: number) => boolean;
  isTeamFavorite: (id: number) => boolean;
};

type ApiResponse = {
  data: {
    data: Fixture;
  };
  success: boolean;
};

const LeagueFixtures: FC<props> = ({
  league,
  activeLeague,
  fixtureId,
  setFixtureId,
  filterFixtures,
  isLeagueFavorite,
  isTeamFavorite,
}) => {
  const [activeFixtureId, setActiveFixtureId] = useState<number | null>(null);
  const { isMatchFavorite, toggleFavoriteMatches } = useFavorites();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { theme } = useTheme();
  const { data: fixture } = useQuery<ApiResponse>({
    queryKey: ["fixture", fixtureId],
    queryFn: async () => {
      if (fixtureId === undefined) {
        throw new Error("fixtureId is undefined");
      }
      return getFixtureById(fixtureId, "events.type;events.subType", "");
    },
    enabled: !!fixtureId,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const matchState = (state: string | null) => {
    switch (state) {
      case "POSTPONED":
        return "Post.";
      case "SUSPENDED":
        return "Susp.";
      case "CANCELLED":
        return "Canc.";
      case "ABANDONED":
        return "Aban.";
      case "DELAYED":
        return "Delay.";
      case "AWARDED":
        return "Awar.";
      case "INTERRUPTED":
        return "Inter.";
      case "AWAITING_UPDATES":
        return "Await.";
      case "DELETED":
        return "Del.";
      case "EXTRA_TIME_BREAK":
        return "Break";
      case "PEN_BREAK":
        return "Pen.";
      case "PENDING":
        return "Pend.";
      default:
        return state;
    }
  };

  const currentState = (fixture: Today) => {
    const isLive = fixture.state?.developer_name?.split("_")[0] === "INPLAY";
    const currentPeriod = fixture.periods?.find((period) => period.ticking);

    if (isLive && currentPeriod?.has_timer) {
      if (
        fixture.state?.developer_name === "INPLAY_1ST_HALF" &&
        currentPeriod.minutes > 45
      ) {
        return (
          <span className="">
            45<sup>+{currentPeriod.minutes - 45}</sup>
          </span>
        );
      } else if (
        fixture.state?.developer_name === "INPLAY_2ND_HALF" &&
        currentPeriod.minutes > 90
      ) {
        return (
          <span>
            90<sup>+{currentPeriod.minutes - 90}</sup>
          </span>
        );
      } else {
        return <span className="">{currentPeriod?.minutes}</span>;
      }
    } else {
      return matchState(fixture.state?.short_name ?? "");
    }
  };

  const filterLogic = () => {
    if (filterFixtures === "live") {
      return league.inplay || [];
    } else if (filterFixtures === "fav") {
      return (
        league.today?.filter(
          (today) =>
            isLeagueFavorite(today.league?.id ?? 0) ||
            isMatchFavorite(today.id) ||
            isTeamFavorite(
              today.participants?.find((p) => p.meta.location === "home")?.id ??
                0
            ) ||
            isTeamFavorite(
              today.participants?.find((p) => p.meta.location === "away")?.id ??
                0
            )
        ) || []
      );
    } else return league.today || [];
  };

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-dark/70 divide-dark-bg"
          : "bg-light divide-light-bg"
      } rounded-b-lg overflow-hidden divide-y-[1px]`}
    >
      {filterFixtures === "live" && league.inplay?.length === 0 && (
        <div className="flex items-center justify-center py-2 text-sm font-semibold">
          No Live games available
        </div>
      )}

      {filterLogic()
        ?.sort((a, b) => a.id - b.id)
        .map((today) => {
          const homeTeam = today.participants?.find(
            (p) => p.meta.location === "home"
          );
          const awayTeam = today.participants?.find(
            (p) => p.meta.location === "away"
          );

          const homeScore = today.scores?.find(
            (score) =>
              score.description === "CURRENT" &&
              score.score.participant === "home"
          )?.score.goals;

          const awayScore = today.scores?.find(
            (score) =>
              score.description === "CURRENT" &&
              score.score.participant === "away"
          )?.score.goals;

          const isLive =
            today.state?.developer_name?.split("_")[0] === "INPLAY" ||
            today.state?.developer_name === "HT";

          const startTime = today.starting_at?.split(" ")[1].slice(0, 5);

          return (
            <div key={today.id}>
              <div
                className={`${
                  theme === "dark"
                    ? "hover:bg-gray-600/10"
                    : "hover:bg-gray-400/10"
                } flex items-center gap-1 py-2 px-2 justify-between w-full cursor-pointer text-xs relative`}
                onClick={() => {
                  if (windowWidth <= 640) {
                    return;
                  }
                  setActiveFixtureId(
                    activeFixtureId === today.id ? null : today.id
                  );
                  setFixtureId(today.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setActiveFixtureId(
                      activeFixtureId === today.id ? null : today.id
                    );
                    setFixtureId(today.id);
                  }
                }}
                role="button"
                tabIndex={0}
                // disabled={windowWidth <= 640}
              >
                <div
                  className={`${
                    theme === "dark" ? "text-light-bg" : "text-dark-bg"
                  } text-[8px] w-10 flex flex-col items-center justify-center`}
                >
                  <div
                    className={isLive ? "text-live font-bold text-[10px]" : ""}
                    title={today.state?.name || ""}
                  >
                    {currentState(today)}
                  </div>

                  {windowWidth < 640 &&
                    today.state?.developer_name !== "FT" &&
                    today.state?.developer_name !== "HT" && (
                      <span className="text-[8px]">
                        {today.state?.developer_name === "NS" && startTime}
                      </span>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-0 sm:gap-2 sm:items-center w-full justify-center">
                  {/* Home team */}
                  <div className="sm:text-right text-left flex gap-1 items-center sm:w-1/2 w-full flex-row-reverse sm:flex-row justify-between sm:justify-end text-[10px] sm:text-[12px]">
                    <span
                      className={`${
                        homeTeam?.meta.winner === false ? "text-gray-400" : ""
                      } block sm:hidden ${isLive ? "text-live" : ""}`}
                    >
                      {today.state?.developer_name !== "NS" && homeScore}
                    </span>

                    <div
                      className={`${
                        homeTeam?.meta.winner === false ? "text-gray-400" : ""
                      } flex gap-1 items-center flex-row-reverse sm:flex-row`}
                    >
                      <div>{homeTeam?.name || ""}</div>

                      <div className="h-5 w-5 flex justify-center items-center">
                        <img
                          src={homeTeam?.image_path || ""}
                          alt=""
                          className="w-4"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  {windowWidth >= 640 && (
                    <span
                      className={`${
                        isLive
                          ? "bg-live text-light-bg"
                          : theme === "dark"
                          ? "bg-dark-bg"
                          : "bg-light-bg"
                      } w-14 rounded-full text-[10px] py-[2px]`}
                    >
                      {today.state?.developer_name === "NS" ? (
                        startTime
                      ) : (
                        <div className="flex justify-center items-center gap-1">
                          <span>{homeScore}</span>-<span>{awayScore}</span>
                        </div>
                      )}
                    </span>
                  )}

                  {/* Away team */}
                  <div className="text-left flex gap-1 items-center w-full sm:w-1/2 justify-between text-[10px] sm:text-[12px] ">
                    <div
                      className={`${
                        awayTeam?.meta.winner === false ? "text-gray-400" : ""
                      } flex gap-1 items-center`}
                    >
                      <div className="h-5 w-5 flex justify-center items-center">
                        <img
                          src={awayTeam?.image_path || ""}
                          alt=""
                          className="w-4"
                        />
                      </div>

                      <div>{awayTeam?.name || ""}</div>
                    </div>

                    <span
                      className={`${
                        awayTeam?.meta.winner === false ? "text-gray-400" : ""
                      } block sm:hidden ${isLive ? "text-live" : ""}`}
                    >
                      {today.state?.developer_name !== "NS" && awayScore}
                    </span>
                  </div>
                </div>

                {windowWidth <= 1024 && (
                  <Link
                    to={`/match/${today.id}`}
                    className="bg-transparent h-full w-full absolute "
                  ></Link>
                )}
                <button
                  className={`cursor-pointer ${
                    isLeagueFavorite(today.league?.id) ||
                    isTeamFavorite(homeTeam?.id ?? 0) ||
                    isTeamFavorite(awayTeam?.id ?? 0) ||
                    isMatchFavorite(today.id)
                      ? "text-accent"
                      : "text-gray-400"
                  } text-md z-10`}
                  onClick={() => {
                    if (isLeagueFavorite(today.league?.id)) {
                      return alert(
                        `Match is favorite because of ${today.league?.name}`
                      );
                    } else if (isTeamFavorite(homeTeam?.id ?? 0)) {
                      return alert(
                        `Match is favorite because of ${homeTeam?.name}`
                      );
                    } else if (isTeamFavorite(awayTeam?.id ?? 0)) {
                      return alert(
                        `Match is favorite because of ${awayTeam?.name}`
                      );
                    } else {
                      toggleFavoriteMatches({
                        id: today.id,
                        leagueId: today.league?.id,
                        homeTeamId: homeTeam?.id ?? 0,
                        awayTeamId: awayTeam?.id ?? 0,
                      });
                    }
                  }}
                >
                  <FaStar />
                </button>
              </div>

              {windowWidth <= 1024 &&
                activeLeague &&
                activeFixtureId === today.id && (
                  <div>
                    <Events
                      events={fixture?.data.data.events ?? null}
                      homeId={homeTeam?.id ?? 0}
                      awayId={awayTeam?.id ?? 0}
                      homeStyle="justify-end flex-row-reverse"
                      awayStyle="justify-end text-right"
                      periods={fixture?.data.data.periods ?? null}
                    />
                  </div>
                )}
            </div>
          );
        })}
    </div>
  );
};

export default LeagueFixtures;
