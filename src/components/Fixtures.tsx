import { useInfiniteQuery, useQueries } from "@tanstack/react-query";
import { getLeaguesByDate, getTeamFixturesByDateRange } from "../api/queries";
import {
  Dispatch,
  FC,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { League, Pagination } from "../types/types";
import { useTheme } from "../context/ThemeContext";
import LeagueFixtures from "./LeagueFixtures";
import { Link, useSearchParams } from "react-router-dom";
import { RiFootballFill } from "react-icons/ri";
import { useInView } from "react-intersection-observer";
import { FaStar } from "react-icons/fa";
import { imagePlaceholders } from "../utils/imagePlaceholders";
import { useFavorites } from "../context/FavoritesContext";
import Calendar from "./Calendar";
import { addMonths, format, subMonths } from "date-fns";
import FavStar from "./FavStar";

type LeaguesApiResponse = {
  data: {
    data: League[];
    pagination: Pagination;
  };
  success: boolean;
  message: string;
};
type LeaguesPageType = LeaguesApiResponse;
type LeaguesInfiniteData = {
  pages: LeaguesPageType[];
  pageParams: number[];
};

type FixturesProps = {
  fixtureId: number | undefined;
  setFixtureId: Dispatch<SetStateAction<number | undefined>>;
};

const Fixtures: FC<FixturesProps> = ({ fixtureId, setFixtureId }) => {
  const {
    isLeagueFavorite,
    isTeamFavorite,
    isMatchFavorite,
    favoriteTeams,
    showFavMatchesOnHomePage,
  } = useFavorites();
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const dateParam = searchParams.get("date");
  const [filterFixtures, setFilterFixtures] = useState("all");
  const [date, setDate] = useState<Date>(
    dateParam ? new Date(dateParam) : new Date()
  );
  const [activeLeagueId] = useState<number | null>(null);

  const { ref, inView } = useInView();

  const {
    data: leagues,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<LeaguesPageType, Error, LeaguesInfiniteData>({
    queryKey: ["fixtures", date],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getLeaguesByDate(
        format(date, "yyyy-MM-dd"),
        pageParam as number,
        50,
        "today.scores;today.participants;today.stage;today.round;today.state;today.events.type;today.aggregate;today.group;today.periods;inplay.scores;inplay.participants;inplay.stage;inplay.round;inplay.state;inplay.aggregate;inplay.group;inplay.periods;country;today.league;inplay.league"
      ),
    getNextPageParam: (lastPage) =>
      lastPage.data.pagination.has_more
        ? lastPage.data.pagination.current_page + 1
        : undefined,
    refetchInterval: 20000,
  });

  const favoriteTeamQueries = useQueries({
    queries: (favoriteTeams || []).map((team) => ({
      queryKey: ["team-fixtures", team.id],
      queryFn: () => {
        const startDate = format(subMonths(new Date(), 6), "yyyy-MM-dd");
        const endDate = format(addMonths(new Date(), 6), "yyyy-MM-dd");
        return getTeamFixturesByDateRange(
          team.id,
          startDate,
          endDate,
          "",
          "populate"
        );
      },
      enabled: Boolean(team?.id),
    })),
  });

  const favoriteTeamFixtures = useMemo(() => {
    const fixtures: any[] = [];

    favoriteTeamQueries.forEach((query) => {
      if (query.data?.data?.data) {
        fixtures.push(...query.data.data.data);
      }
    });

    return fixtures;
  }, [favoriteTeamQueries]);

  useEffect(() => {
    if ((leagues?.pages?.[0]?.data.data.length ?? 0) > 0 && !fixtureId) {
      const firstLeague = leagues?.pages[0].data.data[0];
      const firstFixture =
        (filterFixtures === "live" && firstLeague?.inplay?.[0]) ||
        firstLeague?.today?.[0];

      if (firstFixture) {
        setFixtureId(firstFixture.id);
      }
    }
  }, [leagues, fixtureId, setFixtureId, filterFixtures]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const liveMatchesCount = useMemo(() => {
    if (!leagues?.pages || leagues.pages.length === 0) return 0;

    let count = 0;
    leagues.pages.forEach((page) => {
      page.data.data.forEach((league) => {
        if (league.inplay) {
          count += league.inplay.length;
        }
      });
    });

    return count;
  }, [leagues]);

  const fixturesFilterLogic = (league: League): boolean => {
    if (filterFixtures === "all") {
      return (
        (league.today?.length ?? 0) > 0 || (league.inplay?.length ?? 0) > 0
      );
    }
    if (filterFixtures === "fav") {
      return (
        isLeagueFavorite(league.id) ||
        (league.today?.some(
          (today) =>
            isTeamFavorite(
              today.participants?.find((p) => p.meta.location === "home")?.id ??
                0
            ) ||
            isTeamFavorite(
              today.participants?.find((p) => p.meta.location === "away")?.id ??
                0
            ) ||
            isMatchFavorite(today.id)
        ) ??
          false)
      );
    }
    if (filterFixtures === "live") {
      return (league.inplay?.length ?? 0) > 0;
    }
    return false;
  };
  const favFixturesFilterLogic = (league: League): boolean => {
    return (
      isLeagueFavorite(league.id) ||
      (league.today?.some(
        (today) =>
          isTeamFavorite(
            today.participants?.find((p) => p.meta.location === "home")?.id ?? 0
          ) ||
          isTeamFavorite(
            today.participants?.find((p) => p.meta.location === "away")?.id ?? 0
          ) ||
          isMatchFavorite(today.id)
      ) ??
        false)
    );
  };

  return (
    <div className="mt-2">
      <section className="flex justify-between mb-4 relative gap-2">
        <div className="flex gap-2 flex-wrap h-fit">
          <button
            onClick={() => setFilterFixtures("all")}
            className={`px-4 py-1 h-fit rounded-md cursor-pointer ${
              filterFixtures === "all"
                ? "bg-accent text-white"
                : theme === "dark"
                ? "bg-dark/40 hover:bg-dark/60"
                : "bg-light hover:bg-light/80"
            }`}
            aria-pressed={filterFixtures === "all"}
          >
            All
          </button>

          <button
            onClick={() => setFilterFixtures("live")}
            className={`px-4 py-1 h-fit cursor-pointer rounded-md flex items-center ${
              filterFixtures === "live"
                ? "bg-live text-white"
                : theme === "dark"
                ? "bg-dark/40 hover:bg-dark/60"
                : "bg-light hover:bg-light/80"
            }`}
          >
            Live
            {
              <span
                className={`ml-1 ${
                  filterFixtures === "live" ? "text-white" : ""
                } text-live rounded-full min-h-6 min-w-6 text-[0.8rem] flex justify-center items-center font-bold`}
              >
                {liveMatchesCount}
              </span>
            }
          </button>

          <button
            className={`px-2 py-1  cursor-pointer  rounded-md flex items-center ${
              filterFixtures === "fav"
                ? "bg-fav text-dark"
                : theme === "dark"
                ? "bg-dark/40 hover:bg-dark/60"
                : "bg-light hover:bg-light/80"
            }`}
            onClick={() => setFilterFixtures("fav")}
          >
            <FaStar className="inline" />
            <span className="hidden sm:block">Favorites</span>
          </button>
        </div>
        <div className="flex justify-end">
          <Calendar
            selectedDate={date}
            setSelectedDate={setDate}
            setFilterFixtures={setFilterFixtures}
            setSearchParams={setSearchParams}
            searchParams={searchParams}
            favoriteTeamsFixtures={favoriteTeamFixtures}
          />
        </div>
      </section>

      {isError && (
        <div className="text-center py-8 text-red-500">
          <p>Something went wrong. Please try again later.</p>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin text-4xl text-accent">
            <RiFootballFill />
          </div>
        </div>
      )}
      {filterFixtures === "live" && liveMatchesCount === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          No live matches found.
        </div>
      )}

      {filterFixtures === "fav" &&
        (!leagues?.pages ||
          leagues.pages.flatMap((page) =>
            page.data.data.filter((league) => favFixturesFilterLogic(league))
          ).length === 0) &&
        !isLoading && (
          <div className="text-center py-8 text-gray-500">
            No favorite team fixtures found.
          </div>
        )}

      {showFavMatchesOnHomePage && filterFixtures === "all" && (
        <section className="space-y-3">
          {!isLoading &&
            !isError &&
            filterFixtures === "all" &&
            leagues?.pages.map((page) => (
              <Fragment key={page.data.pagination.current_page}>
                {page.data.data.filter((league) =>
                  favFixturesFilterLogic(league)
                ).length > 0 && (
                  <h3 className="text-center text-2xl font-bold text-accent">
                    Favorite Fixtures
                  </h3>
                )}
                {page.data.data
                  .filter(
                    (league) =>
                      isLeagueFavorite(league.id) ||
                      (league.today?.some(
                        (today) =>
                          isTeamFavorite(
                            today.participants?.find(
                              (p) => p.meta.location === "home"
                            )?.id ?? 0
                          ) ||
                          isTeamFavorite(
                            today.participants?.find(
                              (p) => p.meta.location === "away"
                            )?.id ?? 0
                          ) ||
                          isMatchFavorite(today.id)
                      ) ??
                        false)
                  )
                  .map((league, index, filteredArray) => (
                    <div
                      key={league.id}
                      className={`rounded-lg ${
                        theme === "dark" ? "divide-dark-bg" : "divide-light-bg"
                      } divide-y-[1px]`}
                      ref={
                        index === filteredArray.length - 1 &&
                        page === leagues.pages[leagues.pages.length - 1]
                          ? ref
                          : null
                      }
                    >
                      <div
                        className={`flex items-center gap-2 py-1 rounded-t-lg px-3 justify-between ${
                          theme === "dark" ? "bg-dark/70" : "bg-light"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 flex justify-center items-center rounded-full overflow-hidden">
                            <img
                              src={
                                league.country?.image_path ||
                                imagePlaceholders.team
                              }
                              alt=""
                              className="w-5 h-5 object-cover"
                            />
                          </div>
                          <div className="flex flex-col text-[0.8rem]">
                            <Link
                              to={`/country/${league.country}/${
                                league.country?.id || ""
                              }`}
                              className=" text-gray-400 hover:text-accent w-fit"
                            >
                              {league.country?.name || "International"}
                            </Link>
                            <div className="flex items-center">
                              <Link
                                to={`/league/${league.name?.replace(
                                  / +/g,
                                  "-"
                                )}/${league.id}`}
                                className="font-medium hover:text-accent hover:underline "
                              >
                                {league.name}
                              </Link>
                              {league.today?.[0]?.round?.name && (
                                <div className="ml-2  opacity-70">
                                  Round {league.today[0].round.name}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <FavStar
                          leagueId={league.id ?? 0}
                          image_path={
                            league.image_path ?? imagePlaceholders.team
                          }
                          type="League"
                          leagueName={league.name}
                        />
                      </div>

                      <LeagueFixtures
                        league={league}
                        activeLeague={activeLeagueId === league.id}
                        setFixtureId={setFixtureId}
                        fixtureId={fixtureId}
                        filterFixtures="fav"
                        isLeagueFavorite={isLeagueFavorite}
                        isTeamFavorite={isTeamFavorite}
                      />
                    </div>
                  ))}
              </Fragment>
            ))}
        </section>
      )}
      <section className="space-y-3 mt-4">
        {!isLoading &&
          !isError &&
          leagues?.pages.map((page) => (
            <Fragment key={page.data.pagination.current_page}>
              {/* {filterFixtures === "live" &&
                page.data.data.filter((league) => fixturesFilterLogic(league))
                  .length > 0 && <h3 className="">Live Fixtures</h3>} */}
              {filterFixtures === "all" &&
                page.data.data.filter((league) => fixturesFilterLogic(league))
                  .length > 0 && (
                  <h3 className="text-center text-2xl font-bold text-accent">
                    All Fixtures
                  </h3>
                )}

              {page.data.data
                .filter((league) => fixturesFilterLogic(league))
                .map((league, index, filteredArray) => (
                  <div
                    key={league.id}
                    className={`rounded-lg ${
                      theme === "dark" ? "divide-dark-bg" : "divide-light-bg"
                    } divide-y-[1px]`}
                    ref={
                      index === filteredArray.length - 1 &&
                      page === leagues.pages[leagues.pages.length - 1]
                        ? ref
                        : null
                    }
                  >
                    <div
                      className={`flex items-center gap-2 py-1 rounded-t-lg px-3 justify-between ${
                        theme === "dark" ? "bg-dark/70" : "bg-light"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 flex justify-center items-center rounded-full overflow-hidden">
                          <img
                            src={
                              league.country?.image_path ||
                              imagePlaceholders.team
                            }
                            alt=""
                            className="w-5 h-5 object-cover"
                          />
                        </div>
                        <div className="flex flex-col text-[0.8rem]">
                          <Link
                            to={`/country/${league.country}/${
                              league.country?.id || ""
                            }`}
                            className=" text-gray-400 hover:text-accent w-fit"
                          >
                            {league.country?.name || "International"}
                          </Link>
                          <div className="flex items-center">
                            <Link
                              to={`/league/${league.name?.replace(
                                / +/g,
                                "-"
                              )}/${league.id}`}
                              className="font-medium hover:text-accent hover:underline "
                            >
                              {league.name}
                            </Link>
                            {league.today?.[0]?.round?.name && (
                              <div className="ml-2  opacity-70">
                                Round {league.today[0].round.name}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <FavStar
                        leagueId={league.id ?? 0}
                        image_path={league.image_path ?? imagePlaceholders.team}
                        type="League"
                        leagueName={league.name}
                      />
                    </div>

                    <LeagueFixtures
                      league={league}
                      activeLeague={activeLeagueId === league.id}
                      setFixtureId={setFixtureId}
                      fixtureId={fixtureId}
                      filterFixtures={filterFixtures}
                      isLeagueFavorite={isLeagueFavorite}
                      isTeamFavorite={isTeamFavorite}
                    />
                  </div>
                ))}
            </Fragment>
          ))}
      </section>

      {isFetchingNextPage && (
        <div className="flex justify-center items-center h-4 mt-4">
          <div className="animate-spin text-3xl text-accent">
            <RiFootballFill />
          </div>
        </div>
      )}

      {/* Invisible element for intersection observer */}
      {/* <div ref={ref} className="" /> */}
    </div>
  );
};

export default Fixtures;
