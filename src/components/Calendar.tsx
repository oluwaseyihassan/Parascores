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
import { FaRegCalendarDays } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

type Event = {
  date: string;
  title: string;
};

type CalendarProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setFilterFixtures: (filter: string) => void;
  setSearchParams: (params: URLSearchParams) => void;
  searchParams: URLSearchParams;
};

const sampleEvents: Event[] = [
  { date: "2025-05-10", title: "Match Day" },
  { date: "2025-05-15", title: "Team Meeting" },
  { date: "2025-05-22", title: "Training Session" },
];

const Calendar: FC<CalendarProps> = ({
  selectedDate,
  setSelectedDate,
  searchParams,
  setFilterFixtures,
  setSearchParams,
}) => {
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
        className="p-2 text-gray-600 hover:text-black cursor-pointer"
      >
        &lt;
      </button>
      <h2 className="text-lg font-semibold text-gray-800">
        {format(currentMonth, "MMMM yyyy")}
      </h2>
      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="p-2 text-gray-600 hover:text-black cursor-pointer"
      >
        &gt;
      </button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const date = new Date();
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-sm font-medium text-gray-500">
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
        const event = sampleEvents.find(
          (e) => e.date === format(day, "yyyy-MM-dd")
        );

        days.push(
          <div
            key={day.toString()}
            className={`relative p-2 text-center text-sm cursor-pointer rounded-full transition 
              ${
                isToday
                  ? "bg-blue-300 text-blue-800 font-semibold hover:bg-blue-200"
                  : isCurrentMonth
                  ? "text-gray-800 hover:bg-gray-100"
                  : "text-gray-400 hover:bg-gray-100 "
              } ${
              format(cloneDay, "yyyy-MM-dd") ===
              format(selectedDate, "yyyy-MM-dd")
                ? "bg-blue-100 text-blue-700 font-semibold"
                : ""
            }`}
            onClick={() => {
              setSelectedDate(cloneDay);
              setCurrentMonth(cloneDay);
              console.log("Selected date:", format(cloneDay, "yyyy-MM-dd"));
              const isToday = isSameDay(
                format(cloneDay, "yyyy-MM-dd"),
                format(new Date(), "yyyy-MM-dd")
              );
              console.log(
                format(cloneDay, "yyyy-MM-dd"),
                format(new Date(), "yyyy-MM-dd"),
                isToday
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
            {event && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
            )}
          </div>
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
    <div className="bg-white shadow-lg rounded-md p-1">
      <div className="flex items-center justify-between cursor-pointer p-1 gap-2">
        <button
          onClick={() => {
            setSelectedDate(subDays(selectedDate, 1));
            const newParams = new URLSearchParams(searchParams);
            newParams.set(
              "date",
              format(subDays(selectedDate, 1), "yyyy-MM-dd")
            );
            setSearchParams(newParams);
          }}
          className="text-accent hover:text-gray-600 cursor-pointer"
        >
          <IoIosArrowBack />
        </button>
        <FaRegCalendarDays className="text-xl text-accent mx-auto" />
        <h1
          className=" font-bold text-center text-accent cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {format(selectedDate, "dd/MM")}
        </h1>
        <button
          onClick={() => {
            setSelectedDate(addDays(selectedDate, 1));
            const newParams = new URLSearchParams(searchParams);
            newParams.set(
              "date",
              format(addDays(selectedDate, 1), "yyyy-MM-dd")
            );
            setSearchParams(newParams);
          }}
          className="text-accent hover:text-gray-600 cursor-pointer"
        >
          <IoIosArrowForward />
        </button>
      </div>
      {isOpen && (
        <div className="absolute right-0 bg-light-bg p-2 rounded-lg z-50 top-0">
          <button
            onClick={() => setIsOpen(false)}
            className=" flex justify-self-end text-gray-500 cursor-pointer text-2xl"
          >
            <RxCross2 />
          </button>
          {renderHeader()}
          {renderDays()}
          {renderCells()}
          <button
            onClick={goToToday}
            className="mt-4 text-white hover:underline hover:bg-accent/90 flex px-2 py-1 rounded-md justify-self-center cursor-pointer w-fit bg-accent"
          >
            Today
          </button>
        </div>
      )}
    </div>
  );
};

export default Calendar;
