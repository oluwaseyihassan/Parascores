import { useInfiniteQuery } from "@tanstack/react-query";
import { getLeaguesByDate } from "../api/queries";
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
import { Calendar } from "primereact/calendar";
import { useTheme } from "../context/ThemeContext";
import { formatDate, isSameDay } from "../utils/helperFunctions";
import LeagueFixtures from "./LeagueFixtures";
import { Link, useSearchParams } from "react-router-dom";
import { RiFootballFill } from "react-icons/ri";
import { useInView } from "react-intersection-observer";
import { FaStar } from "react-icons/fa";
import { imagePlaceholders } from "../utils/imagePlaceholders";

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
        formatDate(date),
        pageParam as number,
        50,
        "today.scores;today.participants;today.stage;today.round;today.state;today.aggregate;today.group;today.periods;inplay.scores;inplay.participants;inplay.stage;inplay.round;inplay.state;inplay.aggregate;inplay.group;inplay.periods;country"
      ),
    getNextPageParam: (lastPage) =>
      lastPage.data.pagination.has_more
        ? lastPage.data.pagination.current_page + 1
        : undefined,
    refetchInterval: 60000,
  });

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);

    const isToday = isSameDay(newDate, new Date());

    if (isToday) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("date");
      setSearchParams(newParams);
    } else {
      setSearchParams({ date: formatDate(newDate) });
    }
  };

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

  return (
    <div className="">
      <section className="flex justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterFixtures("all")}
            className={`px-4 py-1 h-fit rounded-md transition-colors cursor-pointer ${
              filterFixtures === "all"
                ? "bg-accent text-white"
                : theme === "dark"
                ? "bg-dark-bg hover:bg-dark-bg/80"
                : "bg-light-bg hover:bg-light-bg/80"
            }`}
            aria-pressed={filterFixtures === "all"}
          >
            All
          </button>

          <button
            onClick={() => setFilterFixtures("live")}
            className={`px-4 py-1 h-fit cursor-pointer rounded-md transition-colors flex items-center ${
              filterFixtures === "live"
                ? "bg-accent text-white"
                : theme === "dark"
                ? "bg-dark-bg hover:bg-dark-bg/80"
                : "bg-light-bg hover:bg-light-bg/80"
            }`}
            aria-pressed={filterFixtures === "live"}
          >
            Live
            {liveMatchesCount > 0 && (
              <span className="ml-1 bg-white text-accent rounded-full h-5 w-5 text-[0.8rem] flex justify-center items-center font-bold">
                {liveMatchesCount}
              </span>
            )}
          </button>

          <button
            className={`px-4 py-2 rounded-md transition-colors ${
              theme === "dark"
                ? "bg-dark-bg hover:bg-dark-bg/80"
                : "bg-light-bg hover:bg-light-bg/80"
            }`}
          >
            <FaStar className="inline mr-1" />
            Favorites
          </button>
        </div>

        <div className="bg-accent rounded-lg overflow-hidden w-[100px] h-fit p-2">
          <Calendar
            value={date}
            onChange={(e) => handleDateChange(e.value as Date)}
            showIcon
            dateFormat="dd/mm"
            readOnlyInput
            showButtonBar
            panelClassName={
              theme === "dark" ? "calendar-panel-dark" : "calendar-panel-light"
            }
            inputClassName="calendar-input"
            variant="filled"
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

      <section className="space-y-3">
        {!isLoading &&
          !isError &&
          leagues?.pages.map((page) => (
            <Fragment key={page.data.pagination.current_page}>
              {page.data.data
                .filter((league) =>
                  filterFixtures === "all"
                    ? (league.today?.length ?? 0) > 0
                    : (league.inplay?.length ?? 0) > 0
                )
                .map((league, index, filteredArray) => (
                  <div
                    key={league.id}
                    className={`rounded-lg overflow-hidden ${
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
                              to={`/league/${league.name.replace(/ +/g, "-")}/${
                                league.id
                              }`}
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
                      <button
                        className="text-md cursor-pointer hover:text-accent focus:outline-none"
                        aria-label="Add to favorites"
                      >
                        <FaStar className="text-gray-400" />
                      </button>
                    </div>

                    <LeagueFixtures
                      league={league}
                      activeLeague={activeLeagueId === league.id}
                      setFixtureId={setFixtureId}
                      fixtureId={fixtureId}
                      filterFixtures={filterFixtures}
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
