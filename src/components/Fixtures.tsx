import { useQuery } from "@tanstack/react-query";
import { getLeaguesByDate } from "../api/queries";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { League, Pagination } from "../types/types";
import { Calendar } from "primereact/calendar";
import { useTheme } from "../context/ThemeContext";
import { formatDate, isSameDay } from "../utils/helperFunctions";
import LeagueFixtures from "./LeagueFixtures";
import { useParams, useSearchParams } from "react-router-dom";
import { RiFootballFill } from "react-icons/ri";

type ApiResponse = {
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

type FixturesProps = {
  fixtureId: number | undefined;
  setFixtureId: Dispatch<SetStateAction<number | undefined>>;
};

const Fixtures: FC<FixturesProps> = ({ fixtureId, setFixtureId }) => {
  const { theme } = useTheme();
  const [page, setPage] = useState<number>(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const dateParam = searchParams.get("date");
  const [date, setDate] = useState<Date>(
    dateParam ? new Date(dateParam) : new Date()
  );
  const [activeLeagueId, setActiveLeagueId] = useState<number | null>(null);

  const {
    data: fixtures,
    error,
    isError,
    isLoading,
  } = useQuery<ApiResponse["fixtures"], ApiResponse["error"]>({
    queryKey: ["fixtures", date, page],
    queryFn: () =>
      getLeaguesByDate(
        formatDate(date),
        page,
        50,
        "today.scores;today.participants;today.stage;today.round;today.state;today.aggregate;today.group;today.periods;inplay;country"
      ),
    refetchOnWindowFocus: false,
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

  return (
    <div>
      <section className="flex justify-between">
        <div>
          <div>All</div>
          <div>Favourites</div>
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
      {isError && (
        <div className="text-center py-3 text-2xl">
          {error?.response.data.message}
        </div>
      )}
      {isLoading && (
        <div className="flex justify-center items-center h-24 animate-spin text-4xl text-accent">
          <RiFootballFill />
        </div>
      )}
      <section>
        {fixtures?.success &&
          !isLoading &&
          !isError &&
          fixtures?.data.data.map((league) => (
            <div
              key={league.id}
              onClick={() => setActiveLeagueId(league.id)}
              className={`${
                theme === "dark" ? "divide-dark-bg" : "divide-light-bg"
              } divide-y-[1px]`}
            >
              <div
                className={`flex items-center gap-2 py-1 mt-4 rounded-t-lg text-sm pl-2 ${
                  theme === "dark" ? "bg-dark/70" : "bg-light"
                }`}
              >
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
                  <div>{league.country?.name}</div>
                  <div className="flex">
                    <div>{league.name} | </div>
                    <div>
                      {league.today
                        ?.filter((_, index) => index === 0)
                        .map((today) => (
                          <div key={today.id}>Round {today.round?.name}</div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              <LeagueFixtures
                league={league}
                activeLeague={activeLeagueId === league.id}
                setFixtureId={setFixtureId}
                fixtureId={fixtureId}
              />
            </div>
          ))}
      </section>
    </div>
  );
};

export default Fixtures;
