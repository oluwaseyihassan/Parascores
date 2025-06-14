import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getTeamById } from "../../api/queries";
import { RiFootballFill } from "react-icons/ri";
import TeamCard from "../TeamCard";
import { TeamType } from "../../types/types";
import { useState } from "react";

type TeamApiResponse = {
  data: {
    data: TeamType;
  };
  success: boolean;
  message: string;
};

const Team = () => {
  const { id: teamId } = useParams();
  const [activeTab, setActiveTab] = useState(1);
  const { data: team, isLoading: teamIsLoading } = useQuery<TeamApiResponse>({
    queryKey: ["team", teamId],
    queryFn: () => {
      return getTeamById(
        Number(teamId),
        "country;rivals;players.player.position;latest;upcoming;seasons;activeSeasons;statistics;trophies;socials.channel;rankings",
        ""
      );
    },
    enabled: !!teamId,
    refetchOnWindowFocus: false,
  });
  if (teamIsLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <RiFootballFill className="animate-spin text-4xl text-accent" />
      </div>
    );
  }
  const teamTabs = [
    {
      id: 1,
      name: "Overview",
    },
    {
      id: 2,
      name: "Squad",
    },
    {
      id: 3,
      name: "Matches",
    },
    {
      id: 4,
      name: "Standings",
    },
    {
      id: 5,
      name: "Socials",
    },
    {
      id: 6,
      name: "Trophies",
    },
    {
      id: 7,
      name: "Statistics",
    },
    {
      id: 8,
      name: "Rivals",
    },
    {
      id: 9,
      name: "History",
    },
  ];
  return (
    <div className="">
      <section>{team?.data.data && <TeamCard team={team.data.data} />}</section>
      <section>
        <section className="flex gap-4 mt-4 w-full overflow-x-auto scrollbar-hide">
          {teamTabs.map((tab) => (
            <button
              key={tab.id}
              className={`${
                activeTab === tab.id
                  ? "border-accent text-accent"
                  : "border-transparent"
              } border-b-2 border-solid min-w-[120px] flex-1 p-2`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </section>
        <section className="flex flex-col gap-2 mt-4">
          {activeTab === 1 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-bold">Overview</h2>
            </div>
          )}
          {activeTab === 2 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-bold">Squad</h2>
              {/* Add squad details here */}
            </div>
          )}
          {activeTab === 3 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-bold">Matches</h2>
              {/* Add matches details here */}
            </div>
          )}
          {activeTab === 4 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-bold">Standings</h2>
              {/* Add standings details here */}
            </div>
          )}
          {activeTab === 5 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-bold">Socials</h2>
              {/* Add socials details here */}
            </div>
          )}
          {activeTab === 6 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-bold">Trophies</h2>
              {/* Add trophies details here */}
            </div>
          )}
          {activeTab === 7 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-bold">Statistics</h2>
              {/* Add statistics details here */}
            </div>
          )}
          {activeTab === 8 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-bold">Rivals</h2>
              {/* Add rivals details here */}
            </div>
          )}
          {activeTab === 9 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-bold">History</h2>
              {/* Add history details here */}
            </div>
          )}
        </section>
      </section>
    </div>
  );
};

export default Team;
