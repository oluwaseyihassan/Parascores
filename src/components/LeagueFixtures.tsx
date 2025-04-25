import { act, Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Fixture, League } from "../types/types";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFixtureById } from "../api/queries";
import Fixtures from "./Fixtures";
import Events from "./Events";

type props = {
  league: League;
  activeLeague: boolean;
  fixtureId: number | undefined;
  setFixtureId: Dispatch<SetStateAction<number | undefined>>;
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

  console.log(windowWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  useEffect(() => {
    if (league.today?.length !== 0) {
      setFixtureId(league.today ? league.today[0]?.id : undefined);
    }
  }, []);

  const matchState = (state: string | null) => {
    switch (state) {
      case "NS":
        return "Not Started";
      case "FT":
        return "Full Time";
      case "HT":
        return "Half Time";
      case "INPLAY_1ST_HALF":
        return "1st Half";
      case "INPLAY_2ND_HALF":
        return "2nd Half";
      case "INPLAY_EXTRA_TIME":
        return "Extra Time";
      case "INPLAY_PENALTIES":
        return "Penalties";
    }
  };

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-dark/70 divide-dark-bg"
          : "bg-light divide-light-bg"
      }  rounded-b-lg  divide-y-[1px]`}
    >
      {league.today
        ?.sort((a, b) => a.id - b.id)
        .map((today, index) => (
          <div key={today.id}>
            <button
              className="flex items-center gap-1 py-1 px-2 justify-between w-full cursor-pointer text-xs"
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
                } text-[10px] w-8 flex flex-col items-start justify-center`}
              >
                <div
                  className={`${
                    today.state?.developer_name?.split("_")[0] === "INPLAY"
                      ? "text-accent"
                      : ""
                  } `}
                  title={`${today.state?.name}`}
                >
                  {
                    today.state?.developer_name === "INPLAY_1ST_HALF"
                      ? `${
                          today.periods?.sort(
                            (a, b) => a.sort_order - b.seconds
                          )[0]?.minutes
                        } ${
                          today.periods?.sort(
                            (a, b) => a.sort_order - b.seconds
                          )[0]?.time_added
                            ? `+ ${
                                today.periods?.sort(
                                  (a, b) => a.sort_order - b.seconds
                                )[0]?.time_added
                              }`
                            : ""
                        }`
                      : today.state?.developer_name === "INPLAY_2ND_HALF"
                      ? today.periods?.sort(
                          (a, b) => a.sort_order - b.seconds
                        )[1]?.minutes
                      : today.state?.developer_name === "INPLAY_EXTRA_TIME"
                      ? today.periods?.sort(
                          (a, b) => a.sort_order - b.seconds
                        )[2]?.minutes
                      : today.state?.short_name
                    // : (today.state?.developer_name === "INPLAY_1ST_HALF"
                    //     ? today.periods?.sort(
                    //         (a, b) => a.sort_order - b.seconds
                    //       )[0]?.minutes
                    //     : today.periods?.sort(
                    //         (a, b) => a.sort_order - b.seconds
                    //       )[1]?.minutes) ?? ""
                  }
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
                      theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
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
                  <Events events={fixture?.data.data.events ?? null} style=""/>
                </div>
              )}
          </div>
        ))}
    </div>
  );
};

export default LeagueFixtures;
