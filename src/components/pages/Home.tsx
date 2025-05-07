import Countries from "../Countries";
import FixtureEvents from "../FixtureEvents";
import Fixtures from "../Fixtures";
import TopLeagues from "../TopLeagues";
import { useTheme } from "../../context/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import { getLeagues } from "../../api/queries";
import { useState } from "react";
import { League, Pagination } from "../../types/types";

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
  console.log(leaguesError);

  return (
    <div className="grid col-span-1 lg:grid-cols-4 gap-4 mt-1">
      <div className={`hidden lg:block col-span-1 `}>
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
          } p-3 rounded-2xl mt-4 sticky top-16`}
        >
          <Countries />
        </div>
      </div>
      <div
        className={`${
          theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
        } col-span-2 p-3 rounded-lg sm:rounded-2xl max-w-screen`}
      >
        <Fixtures fixtureId={fixtureId} setFixtureId={setFixtureId} />
      </div>
      <div
        className={`${
          theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
        } hidden lg:block col-span-1 bg-dark-bg p-3 h-fit sticky top-16 rounded-2xl`}
      >
        <FixtureEvents fixtureId={fixtureId} setFixtureId={setFixtureId} />
      </div>
    </div>
  );
};

export default Home;
