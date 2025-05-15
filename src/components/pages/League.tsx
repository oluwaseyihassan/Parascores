import { useParams } from "react-router-dom";
import Standing from "../Standing";
import { useQuery } from "@tanstack/react-query";
import {
  getStandinsBySeasonId,
  getLeagueById,
  getTopScorersById,
} from "../../api/queries";
import { LeagueType } from "../../types/types";
import TopScorers from "../TopScorers";
import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import LeagueCard from "../LeagueCard";
import { RiFootballFill } from "react-icons/ri";

type LeagueApiResponse = {
  data: {
    data: LeagueType["league"];
  };
  success: boolean;
  message: string;
};

const League = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const [seasonId, setSeasonId] = useState<number | undefined>(undefined);
  const [topScorersFilterId, setTopScorersFilterId] = useState<number>(208);
  const [topScorerPage, setTopScorerPage] = useState<number>(1);

  const { data: league, isLoading: leagueIsLoading } = useQuery<LeagueApiResponse>({
    queryKey: ["league", id],
    queryFn: async () => {
      if (!id) {
        throw new Error("League ID is required");
      }
      return getLeagueById(+id, "currentSeason;country;seasons", "");
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (league?.data?.data?.currentseason?.id && !seasonId) {
      setSeasonId(league.data.data.currentseason.id);
    }
  }, [league, seasonId]);

  const { 
    data: standing, 
    isLoading: standingIsLoading,
    error: standingError
  } = useQuery({
    queryKey: ["standing", seasonId],
    queryFn: async () => {
      if (!seasonId) {
        throw new Error("Season ID is required");
      }
      return getStandinsBySeasonId(
        seasonId,
        "participant;group;stage;details.type;rule.type;form.fixture;season",
        ""
      );
    },
    enabled: !!seasonId,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const { 
    data: topScorers, 
    isLoading: topScorersIsLoading,
    error: topScorersError
  } = useQuery({
    queryKey: ["topscorers", seasonId, topScorersFilterId, topScorerPage],
    queryFn: async () => {
      if (!seasonId) {
        throw new Error("Season ID is required");
      }
      return getTopScorersById(
        seasonId,
        topScorerPage,
        15,
        "player.nationality;player.position;participant;type;season.league",
        `seasontopscorerTypes:${topScorersFilterId}`
      );
    },
    enabled: !!seasonId,
    retry: 1,
    staleTime: 5 * 60 * 1000, 
  });

  


  if (leagueIsLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin text-accent text-4xl">
          <RiFootballFill />
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 p-2">
      <div className="lg:col-span-2 col-span-1">
        <div
          className={`${
            theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
          } p-3 rounded-lg mb-4`}
        >
          <LeagueCard 
            league={league} 
            seasonId={seasonId} 
            setSeasonId={setSeasonId} 
          />
        </div>
        <div
          className={`${
            theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
          } px-2 pt-2 rounded-lg`}
        >
          <h2 className="text-center text-2xl w-full">Standings</h2>

          {standingError ? (
            <div className="text-red-500 p-4 text-center">
              Unable to load standings
            </div>
          ) : (
            <Standing standing={standing} isLoading={standingIsLoading}/>
          )}
        </div>
      </div>
      <div className="col-span-1">
        {topScorersError ? (
          <div className={`${theme === "dark" ? "bg-dark-bg" : "bg-light-bg"} p-4 rounded-lg text-red-500 text-center`}>
            Unable to load top scorers
          </div>
        ) : (
          <TopScorers
            topScorers={topScorers}
            setTopScorerFilterId={setTopScorersFilterId}
            isLoading={topScorersIsLoading}
            topScorerPage={topScorerPage}
            setTopScorerPage={setTopScorerPage}
          />
        )}
      </div>
    </div>
  );
};

export default League;
