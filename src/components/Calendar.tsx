import { FC, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  subDays,
} from "date-fns";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useTheme } from "../context/ThemeContext";
import { Today } from "../types/types";
import ClickAway from "./ClickAway";
import { FaRegCalendar } from "react-icons/fa";

type CalendarProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setFilterFixtures: (filter: string) => void;
  setSearchParams: (params: URLSearchParams) => void;
  searchParams: URLSearchParams;
  favoriteTeamsFixtures: Today[];
};

const Calendar: FC<CalendarProps> = ({
  selectedDate,
  setSelectedDate,
  searchParams,
  setFilterFixtures,
  setSearchParams,
  favoriteTeamsFixtures,
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const dateParam = searchParams.get("date");
    return dateParam ? new Date(dateParam) : new Date();
  });
  const today = new Date();

  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("date");
    setSearchParams(newParams);
    setFilterFixtures("all");
    setIsOpen(false);
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="p-1 hover:bg-gray-400/10 rounded-md text-gray-600 cursor-pointer focus:outline outline-accent"
      >
        <IoIosArrowBack />
      </button>
      <h2 className="text-lg font-semibold">
        {format(currentMonth, "MMMM yyyy")}
      </h2>
      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="p-1 hover:bg-gray-400/10 rounded-md text-gray-600  cursor-pointer focus:outline outline-accent"
      >
        <IoIosArrowForward />
      </button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const date = new Date();
    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          key={i}
          className="text-center text-sm font-medium text-gray-400"
          title={`${format(addDays(startOfWeek(date), i), "EEEE")}`}
        >
          {format(addDays(startOfWeek(date), i), "EEE")}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, today);
        const favorite = favoriteTeamsFixtures.find(
          (e) => e.starting_at?.split(" ")[0] === format(day, "yyyy-MM-dd")
        );

        days.push(
          <button
            key={day.toString()}
            className={`relative h-10 w-10 flex justify-center items-center text-center text-sm cursor-pointer rounded-full transition focus:outline outline-accent 
              ${
                isToday
                  ? "bg-accent text-white font-semibold hover:bg-accent/80"
                  : isCurrentMonth
                  ? theme === "dark"
                    ? "hover:bg-accent/20"
                    : "hover:bg-accent/20"
                  : theme === "dark"
                  ? "hover:bg-gray-800/50 text-gray-400 "
                  : "text-gray-400 hover:bg-gray-300/50 "
              } ${
              format(cloneDay, "yyyy-MM-dd") ===
                format(selectedDate, "yyyy-MM-dd") && !isToday
                ? "bg-accent/30 text-white font-semibold"
                : ""
            }`}
            onClick={() => {
              setSelectedDate(cloneDay);
              setCurrentMonth(cloneDay);
              const isToday = isSameDay(
                format(cloneDay, "yyyy-MM-dd"),
                format(new Date(), "yyyy-MM-dd")
              );
              setFilterFixtures("all");

              if (isToday) {
                const newParams = new URLSearchParams(searchParams);
                newParams.delete("date");
                setSearchParams(newParams);
              } else {
                const newParams = new URLSearchParams(searchParams);
                newParams.set("date", format(cloneDay, "yyyy-MM-dd"));
                setSearchParams(newParams);
              }
              setIsOpen(false);
            }}
          >
            {format(day, "d")}
            {favorite && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-fav rounded-full"></div>
            )}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1 mb-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <ClickAway onClickAway={() => setIsOpen(false)}>
      <div className="rounded-md px-1">
        <div
          className={`${
            theme === "dark" ? "outline-gray-400/30" : "outline-gray-300"
          } flex items-center justify-between cursor-pointer p-1 gap-2 rounded-lg outline-2`}
        >
          <button
            onClick={() => {
              setSelectedDate(subDays(selectedDate, 1));
              const newParams = new URLSearchParams(searchParams);
              newParams.set(
                "date",
                format(subDays(selectedDate, 1), "yyyy-MM-dd")
              );
              setSearchParams(newParams);
              setFilterFixtures("all");
              setIsOpen(false);
            }}
            className="text-accent cursor-pointer rounded-md text-lg p-1 hover:bg-accent/10"
          >
            <IoIosArrowBack />
          </button>
          <button
            className="flex gap-2 items-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FaRegCalendar className="text-lg sm:text-xl text-accent mx-auto" />
            <h1 className=" text-center cursor-pointer text-base sm:text-lg flex gap-1">
              <span>{format(selectedDate, "dd/MM")}</span>
              <span className="hidden sm:block">
                {format(selectedDate, "EEE")}
              </span>
            </h1>
          </button>
          <button
            onClick={() => {
              setSelectedDate(addDays(selectedDate, 1));
              const newParams = new URLSearchParams(searchParams);
              newParams.set(
                "date",
                format(addDays(selectedDate, 1), "yyyy-MM-dd")
              );
              setSearchParams(newParams);
              setFilterFixtures("all");
              setIsOpen(false);
            }}
            className="text-accent cursor-pointer rounded-md text-lg p-1 hover:bg-accent/10"
          >
            <IoIosArrowForward />
          </button>
        </div>
        {isOpen && (
          <div
            className={`${
              theme === "dark" ? "bg-dark" : "bg-light"
            } absolute right-0 p-2 rounded-lg z-50 -top-1 shadow-2xl`}
          >
            <button
              onClick={() => setIsOpen(false)}
              className=" flex justify-self-end text-gray-500 cursor-pointer text-2xl hover:bg-gray-400/10 rounded-md focus:outline outline-accent"
            >
              <RxCross2 />
            </button>
            {renderHeader()}
            {renderDays()}
            {renderCells()}
            <div className="flex items-center gap-2 mt-4">
              <div className="h-1 w-3 bg-fav rounded-sm" />
              <span className="text-[8px]">
                Match days for your favorite teams.
              </span>
            </div>
            <button
              onClick={goToToday}
              className="mt-4 text-white hover:underline hover:bg-accent/90 flex px-2 py-1 rounded-md justify-self-center cursor-pointer w-fit bg-accent"
            >
              Today
            </button>
          </div>
        )}
      </div>
    </ClickAway>
  );
};

export default Calendar;
