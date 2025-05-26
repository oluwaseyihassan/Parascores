import FixtureEvents from "../FixtureEvents";
import Fixtures from "../Fixtures";
import TopLeagues from "../TopLeagues";
import { useTheme } from "../../context/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import { getLeagues } from "../../api/queries";
import { useState } from "react";
import { League, Pagination } from "../../types/types";
import FavoriteLeagues from "../FavoriteLeagues";
import FavoriteTeams from "../FavoriteTeams";

type ApiResponse = {
  leagues: {
    data: {
      data: League[];
      pagination: Pagination;
    };
    success: boolean;
  };
};

const Home = () => {
  const { theme } = useTheme();
  const [page] = useState(1);
  const [fixtureId, setFixtureId] = useState<number>();
  const {
    data: leagues,
    isLoading: leaguesLoading,
    isError: leaguesError,
  } = useQuery<ApiResponse["leagues"]>({
    queryKey: ["leagues", page],
    queryFn: () => getLeagues(page, 50, "today;inplay"),
    refetchOnWindowFocus: false,
  });

  return (
    <div className="grid col-span-1 lg:grid-cols-10 gap-4 mt-1 ">
      <div className={`hidden lg:block col-span-2 `}>
        <div
          className={`${
            theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
          } p-3 rounded-2xl`}
        >
          <TopLeagues
            leagues={leagues}
            loading={leaguesLoading}
            error={leaguesError}
          />
        </div>
        <div
          className={`${
            theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
          } p-3 rounded-2xl mt-2`}
        >
          <FavoriteLeagues />
        </div>
        <div
          className={`${
            theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
          } p-3 rounded-2xl mt-2`}
        >
          <FavoriteTeams />
        </div>
      </div>
      <div
        className={`${
          theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
        } col-span-5 p-3 rounded-lg sm:rounded-2xl max-w-screen h-fit`}
      >
        <Fixtures fixtureId={fixtureId} setFixtureId={setFixtureId} />
      </div>
      <div
        className={`${
          theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
        } hidden lg:block col-span-3 bg-dark-bg p-3 h-fit sticky top-16 rounded-2xl`}
      >
        <FixtureEvents fixtureId={fixtureId} setFixtureId={setFixtureId} />
        <div className="flex items-center justify-center mt-1 gap-1">
          <span>Data provided by </span>
          <a
            className="font-bold"
            href="https://www.sportmonks.com/football-api/"
            target="_blank"
          >
            SportMonks
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
