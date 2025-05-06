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
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

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

  const { data: league } = useQuery<LeagueApiResponse>({
    queryKey: ["league", id],
    queryFn: async () => {
      if (id === undefined || id === null) {
        throw new Error("id is undefined or null");
      }
      return getLeagueById(+id, "currentSeason", "");
    },
  });
  console.log(league);
  const seasonId = league?.data.data.currentseason.id;
  const [topScorersFilterId, setTopScorersFilterId] = useState<number>(208);
  const [topScorerPage, setTopScorerPage] = useState<number>(1);
  const { data: standing } = useQuery({
    queryKey: ["standing", seasonId],
    queryFn: async () => {
      if (seasonId === undefined || seasonId === null) {
        throw new Error("seasonId is undefined or null");
      }
      return getStandinsBySeasonId(
        +seasonId,
        "participant;group;stage;details.type;rule.type;form.fixture;season",
        ""
      );
    },
    enabled: !!seasonId,
  });

  const { data: topScorers, isLoading: topScorersIsLoading } = useQuery({
    queryKey: ["topscorers", seasonId, topScorersFilterId, topScorerPage],
    queryFn: async () => {
      if (seasonId === undefined || seasonId === null) {
        throw new Error("seasonId is undefined or null");
      }
      return getTopScorersById(
        +seasonId,
        topScorerPage,
        15,
        "player.nationality;player.position;participant;type;season.league",
        `seasontopscorerTypes:${topScorersFilterId}`
      );
    },
    enabled: !!seasonId,
  });

  console.log(topScorers);

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
      <div
        className={`${
          theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
        } px-2 pt-2 rounded-lg lg:col-span-2 col-span-1`}
      >
        <h2 className="text-center text-2xl w-full">Standing</h2>

        <Standing standing={standing} />
      </div>
      <div className="col-span-1">
        <TopScorers
          topScorers={topScorers}
          setTopScorerFilterId={setTopScorersFilterId}
          isLoading={topScorersIsLoading}
          topScorerPage={topScorerPage}
          setTopScorerPage={setTopScorerPage}
        />
      </div>
    </div>
  );
};

export default League;
