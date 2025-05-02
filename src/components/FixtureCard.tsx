import React, { FC } from "react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { Events, Today } from "../types/types";

type props = {
  fixture: Today | null;
};

const FixtureCard: FC<props> = ({ fixture }) => {
  const { theme } = useTheme();

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
    if (!fixture) return null;

    const isLive = fixture.state?.developer_name?.split("_")[0] === "INPLAY";

    if (!isLive) {
      return matchState(fixture.state?.developer_name ?? "");
    }

    const currentPeriod = fixture.periods?.find((period) => period.ticking);

    if (!currentPeriod?.has_timer) {
      return matchState(fixture.state?.developer_name ?? "");
    }

    if (
      fixture.state?.developer_name === "INPLAY_1ST_HALF" &&
      currentPeriod.minutes > 45
    ) {
      return (
        <span>
          45<sup>+{currentPeriod.minutes - 45}</sup>'
        </span>
      );
    }

    if (
      fixture.state?.developer_name === "INPLAY_2ND_HALF" &&
      currentPeriod.minutes > 90
    ) {
      return (
        <span>
          90<sup>+{currentPeriod.minutes - 90}</sup>'
        </span>
      );
    }

    return <span>{currentPeriod?.minutes}<span className="animate-blink">'</span></span>;
  };
  return (
    <section
      className={`${
        theme === "dark" ? "bg-dark/70" : "bg-light"
      } grid grid-cols-3 bg-accent p-2 rounded-lg`}
    >
      <div className="col-span-1 wrap-break-word text-center">
        <Link
          to={`${
            fixture?.participants?.filter(
              (participant) => participant.meta.location === "home"
            )[0].id
          }`}
          className="flex flex-col items-center justify-center gap-2"
        >
          <div className="w-9 h-9">
            <img
              src={`${
                fixture?.participants?.filter(
                  (participant) => participant.meta.location === "home"
                )[0].image_path
              }`}
              alt=""
              className="w-full h-full"
            />
          </div>
          <span className="text-xs max-w-full">
            {
              fixture?.participants?.filter(
                (participant) => participant.meta.location === "home"
              )[0].name
            }
          </span>
        </Link>
      </div>
      <div
        className={`${
          fixture?.state?.developer_name?.split("_")[0] === "INPLAY" ||
          fixture?.state?.developer_name === "HT"
            ? "text-accent"
            : ""
        } col-span-1 flex flex-col items-center justify-center`}
      >
        <div
          className={`${
            fixture?.state?.developer_name?.split("_")[0] === "INPLAY" ||
            fixture?.state?.developer_name === "HT"
              ? "bg-accent text-light-bg"
              : ""
          } px-2 rounded-full`}
        >
          {fixture?.state?.developer_name === "NS" ? (
            fixture?.starting_at?.split(" ")[1].slice(0, 5)
          ) : (
            <div className="flex justify-center items-center gap-1 text-sm">
              <span>
                {
                  fixture?.scores?.filter(
                    (score) =>
                      score.description === "CURRENT" &&
                      score.score.participant === "home"
                  )[0]?.score.goals
                }
              </span>
              -
              <span>
                {
                  fixture?.scores?.filter(
                    (score) =>
                      score.description === "CURRENT" &&
                      score.score.participant === "away"
                  )[0]?.score.goals
                }
              </span>
            </div>
          )}
        </div>
        <div
          className={`${
            fixture?.state?.developer_name?.split("_")[0] === "INPLAY" ||
            fixture?.state?.developer_name === "HT"
              ? "text-accent"
              : ""
          }`}
        >
          {fixture && currentState(fixture)}
        </div>
      </div>
      <div className="col-span-1 wrap-break-word text-center">
        <Link
          to={`${
            fixture?.participants?.filter(
              (participant) => participant.meta.location === "away"
            )[0].id
          }`}
          className="flex flex-col items-center justify-center gap-2"
        >
          <div className="w-9 h-9">
            <img
              src={`${
                fixture?.participants?.filter(
                  (participant) => participant.meta.location === "away"
                )[0].image_path
              }`}
              alt=""
              className="w-full h-full"
            />
          </div>
          <span className="text-xs max-w-full">
            {
              fixture?.participants?.filter(
                (participant) => participant.meta.location === "away"
              )[0].name
            }
          </span>
        </Link>
      </div>
    </section>
  );
};

export default FixtureCard;
