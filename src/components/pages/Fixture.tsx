import { useQuery } from "@tanstack/react-query";
import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import { getFixtureById } from "../../api/queries";
import FixtureCard from "../FixtureCard";
import Events from "../Events";
import { Today } from "../../types/types";
import { useTheme } from "../../context/ThemeContext";
import LineUp from "../LineUp";
import { RiFootballFill } from "react-icons/ri";
import Statistics from "../Statistics";

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
        "participants;events.type;events.subType;state;scores;periods;league;season;sidelined.sideline.player;sidelined.sideline.type;coaches;stage;round;group;aggregate;lineups.player;lineups.details.type;lineups.position;lineups.type;referees.referee;statistics.type;trends.type;venue;comments.player;metadata.type;weatherReport;formations",
        ""
      );
    },
    enabled: !!id,
    refetchInterval: 60000,
  });
  console.log(data);

  const tabs = [
    { name: "Details" },
    { name: "Lineups" },
    { name: "Statistics" },
    { name: "Commentary" },
    { name: "Standing" },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24 animate-spin text-4xl text-accent">
        <RiFootballFill />
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-4 p-4">
      {/* Large screens */}
      <Fragment>
        <section
          className={`${
            theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
          } col-span-1 rounded-lg p-3`}
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
            />
          </div>
          <div className="lg:block hidden">
            <Statistics fixture={data?.data.data ?? null} />
          </div>
        </section>
        <section
          className={`${
            theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
          } rounded-lg col-span-2 lg:block hidden h-fit`}
        >
          <LineUp fixture={data?.data.data ?? null} />
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
          <div className="h-full">
            {activeTab === 0 && (
              <div className="p-2">
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
                />
              </div>
            )}
            <div className="h-full">
              {activeTab === 1 && (
                <div className=" h-full">
                  <LineUp fixture={data?.data.data ?? null} />
                </div>
              )}
              {activeTab === 2 && (
                <div className={`${theme === "dark" ? "bg-dark-bg" : "bg-light-bg"} p-3 rounded-lg`}>
                  <Statistics fixture={data?.data.data ?? null} />
                </div>
              )}
              {activeTab === 3 && (
                <div className="p-2">
                  <h1>Commentary</h1>
                </div>
              )}
              {activeTab === 4 && (
                <div className="p-2">
                  <h1>Standing</h1>
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
