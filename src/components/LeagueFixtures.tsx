import {  Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Fixture, League, Today } from "../types/types";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFixtureById } from "../api/queries";
import Events from "./Events";

type props = {
  league: League;
  activeLeague: boolean;
  fixtureId: number | undefined;
  setFixtureId: Dispatch<SetStateAction<number | undefined>>;
  filterFixtures: string;
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
}) => {
  const [activeFixtureId, setActiveFixtureId] = useState<number | null>(null);
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

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

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
    const currentPeriod = fixture.periods?.filter(
      (period) => period.ticking
    )[0];
    if (isLive) {
      return (
        currentPeriod?.has_timer &&
        (fixture.state?.developer_name === "INPLAY_1ST_HALF" &&
        currentPeriod.minutes > 45 ? (
          <span>
            45<sup>+{currentPeriod.minutes - 45}</sup>
          </span>
        ) : fixture.state?.developer_name === "INPLAY_2ND_HALF" &&
          currentPeriod.minutes > 90 ? (
          <span>
            90<sup>+{currentPeriod.minutes - 90}</sup>
          </span>
        ) : (
          <span>{currentPeriod?.minutes}</span>
        ))
      );
    } else {
      return matchState(fixture.state?.developer_name ?? "");
    }
  };

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-dark/70 divide-dark-bg"
          : "bg-light divide-light-bg"
      }  rounded-b-lg overflow-hidden  divide-y-[1px]`}
    >
      {(filterFixtures === "live" ? league.inplay : league.today)
        ?.sort((a, b) => a.id - b.id)
        .map((today) => (
          <div key={today.id}>
            <button
              className={`${
                theme === "dark"
                  ? "hover:bg-gray-600/10"
                  : "hover:bg-gray-400/10"
              } flex items-center gap-1 py-1 px-2 justify-between w-full cursor-pointer text-xs `}
              onClick={() => {
                setActiveFixtureId(
                  activeFixtureId === today.id ? null : today.id
                );
                setFixtureId(today.id);
              }}
            >
              <div
                className={`${
                  theme === "dark" ? "text-light-bg" : "text-dark-bg"
                } text-[8px] w-8 flex flex-col items-start justify-center`}
              >
                <div
                  className={`${
                    today.state?.developer_name?.split("_")[0] === "INPLAY" ||
                    today.state?.developer_name === "HT"
                      ? "text-accent"
                      : ""
                  } `}
                  title={`${today.state?.name}`}
                >
                  {currentState(today)}
                </div>
                {windowWidth < 640 &&
                  today.state?.developer_name !== "FT" &&
                  today.state?.developer_name !== "HT" && (
                    <span className="text-[10px]">
                      {today.state?.developer_name === "NS" &&
                        today.starting_at?.split(" ")[1].slice(0, 5)}
                    </span>
                  )}
              </div>
              <div className="flex flex-col sm:flex-row gap-0 sm:gap-2 sm:items-center w-full justify-center">
                <div className="sm:text-right text-left flex gap-1 items-center sm:w-1/2 w-full flex-row-reverse sm:flex-row justify-end text-[10px] sm:text-[12px]">
                  <span className="block sm:hidden">
                    {today.state?.developer_name !== "NS" &&
                      today.scores?.filter(
                        (score) =>
                          score.description === "CURRENT" &&
                          score.score.participant === "home"
                      )[0]?.score.goals}
                  </span>
                  <div
                    className={`${
                      today.participants?.filter(
                        (participant) => participant.meta.location === "home"
                      )[0].meta.winner === null
                        ? ""
                        : today.participants?.filter(
                            (participant) =>
                              participant.meta.location === "home"
                          )[0].meta.winner === false
                        ? "text-gray-400"
                        : ""
                    }`}
                  >
                    {today.participants &&
                      today.participants.filter(
                        (participant) => participant.meta.location === "home"
                      )[0]?.name}
                  </div>
                  <div className="h-5 w-5 flex justify-center items-center">
                    <img
                      src={`${
                        today.participants &&
                        today.participants.filter(
                          (participant) => participant.meta.location === "home"
                        )[0]?.image_path
                      }`}
                      alt=""
                      className="w-4"
                    />
                  </div>
                </div>
                {windowWidth >= 640 && (
                  <span
                    className={`${
                      (today.state?.developer_name?.split("_")[0] === "INPLAY" || today.state?.developer_name === "HT")
                        ? "bg-accent text-light-bg"
                        : theme === "dark"
                        ? "bg-dark-bg"
                        : "bg-light-bg"
                    } w-14 rounded-full text-[10px] py-[2px]`}
                  >
                    {today.state?.developer_name === "NS" ? (
                      today.starting_at?.split(" ")[1].slice(0, 5)
                    ) : (
                      <div className="flex justify-center items-center gap-1">
                        <span>
                          {
                            today.scores?.filter(
                              (score) =>
                                score.description === "CURRENT" &&
                                score.score.participant === "home"
                            )[0]?.score.goals
                          }
                        </span>
                        -
                        <span>
                          {
                            today.scores?.filter(
                              (score) =>
                                score.description === "CURRENT" &&
                                score.score.participant === "away"
                            )[0]?.score.goals
                          }
                        </span>
                      </div>
                    )}
                  </span>
                )}
                <div className="text-left flex gap-1 items-center w-full sm:w-1/2 justify-start text-[10px] sm:text-[12px]">
                  <div className="h-5 w-5 flex justify-center items-center">
                    <img
                      src={`${
                        today.participants &&
                        today.participants.filter(
                          (participant) => participant.meta.location === "away"
                        )[0].image_path
                      }`}
                      alt=""
                      className="w-4"
                    />
                  </div>
                  <div
                    className={`${
                      today.participants?.filter(
                        (participant) => participant.meta.location === "away"
                      )[0].meta.winner === null
                        ? ""
                        : today.participants?.filter(
                            (participant) =>
                              participant.meta.location === "away"
                          )[0].meta.winner === false
                        ? "text-gray-400"
                        : ""
                    }`}
                  >
                    {today.participants &&
                      today.participants.filter(
                        (participant) => participant.meta.location === "away"
                      )[0].name}
                  </div>
                  <span className="block sm:hidden">
                    {today.state?.developer_name !== "NS" &&
                      today.scores?.filter(
                        (score) =>
                          score.description === "CURRENT" &&
                          score.score.participant === "away"
                      )[0]?.score.goals}
                  </span>
                </div>
              </div>
              <Link to={``} className="sm:text-accent">
                {windowWidth <= 640 ? "det" : "Details"}
              </Link>
            </button>
            {windowWidth <= 1024 &&
              activeLeague &&
              activeFixtureId === today.id && (
                <div>
                  <Events
              events={fixture?.data.data.events ?? null}
              homeId={
                today?.participants?.filter(
                  (participant) => participant.meta.location === "home"
                )[0].id ?? 0
              }
              awayId={
                today?.participants?.filter(
                  (participant) => participant.meta.location === "away"
                )[0].id ?? 0
              }
              homeStyle="justify-end flex-row-reverse"
              awayStyle="justify-end text-right"
            />
                </div>
              )}
          </div>
        ))}
    </div>
  );
};

export default LeagueFixtures;
