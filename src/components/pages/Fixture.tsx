import { useQueries, useQuery } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getFixtureById,
  getHeadToHead,
  getRoundsBySeasonId,
  getStandinsByRoundId,
  getStandinsBySeasonId,
} from "../../api/queries";
import FixtureCard from "../FixtureCard";
import Events from "../Events";
import { Round, Today } from "../../types/types";
import { useTheme } from "../../context/ThemeContext";
import LineUp from "../LineUp";
import { RiFootballFill } from "react-icons/ri";
import Statistics from "../Statistics";
import Standing from "../Standing";
import HeadToHead from "../HeadToHead";
import Venue from "../Venue";
import StandingTracker from "../StandingTracker";
import Commentary from "../Commentary";

type ApiResponse = {
  data: {
    data: Today;
  };
  success: boolean;
};

const Fixture = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["match", id],
    queryFn: async () => {
      if (id === undefined) {
        throw new Error("id is undefined");
      }
      return getFixtureById(
        +id,
        "participants;events.type;events.period;events.subType;state;scores;periods;league;season;sidelined.sideline.player;sidelined.sideline.type;coaches;stage;round;group;aggregate;lineups.player;lineups.details.type;lineups.position;lineups.type;referees.referee;statistics.type;trends.type;venue;comments.player;metadata.type;weatherReport;formations",
        ""
      );
    },
    enabled: !!id,
    refetchInterval: 60000,
  });

  const teamsId = {
    home:
      data?.data.data.participants?.find(
        (team) => team.meta.location === "home"
      )?.id ?? null,
    away:
      data?.data.data.participants?.find(
        (team) => team.meta.location === "away"
      )?.id ?? null,
  };

  const { data: h2h } = useQuery({
    queryKey: ["h2h", teamsId.home, teamsId.away],
    queryFn: async () => {
      if (teamsId.home === null || teamsId.away === null) {
        throw new Error("teamsId is null");
      }
      return getHeadToHead(
        teamsId.home,
        teamsId.away,
        "participants;league;scores;state;venue;events",
        ""
      );
    },
    enabled: !!teamsId.home && !!teamsId.away,
  });

  const seasonId = data?.data.data?.season_id;
  const {
    data: standing,
    isLoading: standingIsLoading,
    isError: standingError,
  } = useQuery({
    queryKey: ["standing", seasonId],
    queryFn: async () => {
      if (seasonId === undefined || seasonId === null) {
        throw new Error("seasonId is undefined or null");
      }
      return getStandinsBySeasonId(
        seasonId,
        "participant;group;stage;details.type;rule.type;form.fixture",
        ""
      );
    },
    enabled: !!seasonId,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { data: seasonRounds } = useQuery({
    queryKey: ["rounds", seasonId],
    queryFn: async () => {
      if (!seasonId) throw new Error("Season ID is required");
      return getRoundsBySeasonId(seasonId, "", "");
    },
    enabled: Boolean(seasonId),
  });

  const roundQueries = useQueries({
    queries: (seasonRounds?.data?.data || []).map((round: Round) => ({
      queryKey: ["round", round.id],
      queryFn: async () =>
        getStandinsByRoundId(round.id, "stage;participant", ""),
      enabled: Boolean(round?.id),
    })),
  });

  const roundsData = roundQueries
    .filter((query) => query.isSuccess && query.data)
    .map(
      (query) =>
        query.data as {
          data: { data: Round[] };
          success: boolean;
          message?: string;
        }
    );


  const tabs = [
    { name: "Details" },
    { name: "Lineups" },
    { name: "Statistics" },
    { name: "Commentary" },
    { name: "Standing" },
    { name: "Head to Head" },
    { name: "Venue" },
    { name: "Standing Tracker" },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24 animate-spin text-4xl text-accent">
        <RiFootballFill />
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-4 md:p-2">
      {/* Large screens */}
      <Fragment>
        <section className={` col-span-1 rounded-lg`}>
          <section
            className={`${
              theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
            } rounded-lg p-3`}
          >
            <div>
              <FixtureCard fixture={data?.data.data ?? null} />
            </div>
            <div className="lg:block hidden">
              <Events
                events={data?.data.data.events ?? null}
                homeId={
                  data?.data.data.participants?.find(
                    (participant) => participant.meta.location === "home"
                  )?.id ?? 0
                }
                awayId={
                  data?.data.data.participants?.find(
                    (participant) => participant.meta.location === "away"
                  )?.id ?? 0
                }
                homeStyle="justify-end flex-row-reverse"
                awayStyle="justify-end text-right"
                periods={data?.data.data.periods ?? null}
              />
            </div>
          </section>
          <div
            className={`${
              theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
            } rounded-lg lg:block hidden p-3 mt-4`}
          >
            <Statistics fixture={data?.data.data ?? null} />
          </div>
        </section>
        <section className={` col-span-2 lg:block hidden h-fit`}>
          <section
            className={`${
              theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
            } rounded-lg`}
          >
            <LineUp fixture={data?.data.data ?? null} />
          </section>
          <section className="mt-4">
            <Standing
              standing={standing}
              isLoading={standingIsLoading}
              isError={standingError}
            />
          </section>
          <section>
            <StandingTracker
              roundsData={roundsData}
              teamIds={[
                data?.data.data.participants?.find(
                  (participant) => participant.meta.location === "home"
                )?.id ?? 0,
                data?.data.data.participants?.find(
                  (participant) => participant.meta.location === "away"
                )?.id ?? 0,
              ]}
            />
          </section>
          <section
            className={`${
              theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
            } rounded-lg mt-4`}
          >
            <HeadToHead
              h2h={h2h}
              homeId={
                data?.data.data.participants?.find(
                  (participant) => participant.meta.location === "home"
                )?.id ?? 0
              }
              awayId={
                data?.data.data.participants?.find(
                  (participant) => participant.meta.location === "away"
                )?.id ?? 0
              }
            />
          </section>
        </section>
      </Fragment>
      <Fragment>
        {/* Small screens */}
        <section className="lg:hidden h-full">
          <div className="flex justify-between items-center p-2 overflow-x-auto scrollbar-hide text-sm">
            {tabs.map((tab, index) => (
              <div
                key={index}
                className={`${
                  activeTab === index ? "border-accent" : "border-transparent"
                } p-2 cursor-pointer flex-1 text-center border-b-2 min-w-[120px]`}
                onClick={() => setActiveTab(index)}
              >
                {tab.name}
              </div>
            ))}
          </div>
          <div className="h">
            {activeTab === 0 && (
              <div
                className={`${
                  theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
                } rounded-lg p-3`}
              >
                <Events
                  events={data?.data.data.events ?? null}
                  homeId={
                    data?.data.data.participants?.find(
                      (participant) => participant.meta.location === "home"
                    )?.id ?? 0
                  }
                  awayId={
                    data?.data.data.participants?.find(
                      (participant) => participant.meta.location === "away"
                    )?.id ?? 0
                  }
                  homeStyle="justify-end flex-row-reverse"
                  awayStyle="justify-end text-right"
                  periods={data?.data.data.periods ?? null}
                />
              </div>
            )}
            <div className="">
              {activeTab === 1 && (
                <div className="">
                  <LineUp fixture={data?.data.data ?? null} />
                </div>
              )}
              {activeTab === 2 && (
                <div
                  className={`${
                    theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
                  } p-3 rounded-lg`}
                >
                  <Statistics fixture={data?.data.data ?? null} />
                </div>
              )}
              {activeTab === 3 && (
                <div className="p-2">
                  <Commentary comments={data?.data.data.comments ?? null} />
                </div>
              )}
              {activeTab === 4 && (
                <div className="">
                  <Standing
                    standing={standing}
                    isLoading={standingIsLoading}
                    isError={standingError}
                  />
                </div>
              )}
              {activeTab === 5 && (
                <div className="">
                  <HeadToHead
                    h2h={h2h}
                    homeId={
                      data?.data.data.participants?.find(
                        (participant) => participant.meta.location === "home"
                      )?.id ?? 0
                    }
                    awayId={
                      data?.data.data.participants?.find(
                        (participant) => participant.meta.location === "away"
                      )?.id ?? 0
                    }
                  />
                </div>
              )}
              {activeTab === 6 && (
                <div className="p-2">
                  <Venue venue={data?.data.data.venue ?? null} />
                </div>
              )}
              {activeTab === 7 && (
                <div className={`${theme === "dark" ? "bg-dark" : "bg-light" } p-2`}>
                  <StandingTracker
                    roundsData={roundsData}
                    teamIds={[
                      data?.data.data.participants?.find(
                        (participant) => participant.meta.location === "home"
                      )?.id ?? 0,
                      data?.data.data.participants?.find(
                        (participant) => participant.meta.location === "away"
                      )?.id ?? 0,
                    ]}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </Fragment>
    </div>
  );
};

export default Fixture;