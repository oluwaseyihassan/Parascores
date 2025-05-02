import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
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
import { Link, useParams, useSearchParams } from "react-router-dom";
import { RiFootballFill } from "react-icons/ri";
import { useInView } from "react-intersection-observer";
import { FaRegStar, FaStar } from "react-icons/fa";

type ApiResponse = {
  pageParam: number[];
  infinteData: {
    fixtures: {
      data: {
        data: League[];
        pagination: Pagination;
      };
      message: string;
      success: boolean;
    };
    error: {
      response: {
        data: {
          message: string;
        };
      };
    };
  };
};
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
  const [page, setPage] = useState<number>(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const dateParam = searchParams.get("date");
  const [filterFixtures, setFilterFixtures] = useState("all");
  const [date, setDate] = useState<Date>(
    dateParam ? new Date(dateParam) : new Date()
  );
  const [activeLeagueId, setActiveLeagueId] = useState<number | null>(null);

  const { ref, inView } = useInView();

  const {
    data: leagues,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
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
  console.log(leagues, hasNextPage);

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
    const firstLeague = leagues?.pages[0]?.data.data[0];
    const firstFixtureId = firstLeague?.today?.[0].id;
    if (!fixtureId && firstFixtureId) {
      setFixtureId(firstFixtureId);
    }
  }, [leagues]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
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
    <div>
      <section className="flex justify-between">
        <div>
          <div
            onClick={() => {
              setFilterFixtures("all");
            }}
          >
            All
          </div>
          <div
            onClick={() => {
              setFilterFixtures("live");
            }}
          >
            Live {liveMatchesCount}
          </div>
          <div>Favourites</div>
          <div
            onClick={() => {
              if (hasNextPage) {
                fetchNextPage();
              }
            }}
          >
            loadmore
          </div>
        </div>
        <div className="bg-accent h-fit w-24 py-1 px-2 rounded-lg cursor-pointer">
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
      {isError && <div className="text-center py-3 text-2xl"></div>}
      {isLoading && (
        <div className="flex justify-center items-center h-24 animate-spin text-4xl text-accent">
          <RiFootballFill />
        </div>
      )}
      <section>
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
                .map((league) => (
                  <div
                    key={league.id}
                    onClick={() => setActiveLeagueId(league.id)}
                    className={`${
                      theme === "dark" ? "divide-dark-bg" : "divide-light-bg"
                    } divide-y-[1px]`}
                  >
                    <div
                      className={`flex items-center gap-2 py-1 mt-4 rounded-t-lg text-sm px-2 justify-between ${
                        theme === "dark" ? "bg-dark/70" : "bg-light"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 flex justify-center items-center rounded-full overflow-clip">
                          <img
                            src={`${
                              league.country?.image_path ??
                              "https://cdn.sportmonks.com/images/soccer/leagues/28/1116.png"
                            }`}
                            alt={`${league.country?.name}`}
                            className="w-4 h-4 object-cover"
                          />
                        </div>
                        <div className="flex flex-col text-[8px]">
                          <Link
                            to={`/${league.country?.id}`}
                            className="text-gray-400 hover:text-accent"
                          >
                            {league.country?.name}
                          </Link>
                          <div className="flex">
                            <Link
                              to={`/${league.id}`}
                              className="mr-1 hover:text-accent hover:underline"
                            >
                              {league.name}
                            </Link>
                            <div>
                              {league.today
                                ?.filter((_, index) => index === 0)
                                .map((today) => (
                                  <div key={today.id}>
                                    Round {today.round?.name}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="cursor-pointer  hover:text-accent/70">
                        <FaStar className="" />
                      </div>
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
        <div className="flex justify-center items-center h-24 animate-spin text-4xl text-accent">
          <RiFootballFill />
        </div>
      )}
      <div ref={ref}></div>
    </div>
  );
};

export default Fixtures;
