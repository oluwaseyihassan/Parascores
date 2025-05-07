import { FC } from "react";
import { Fixture, Periods } from "../types/types";
import { useTheme } from "../context/ThemeContext";
import EventHalf from "./EventHalf";

type Props = {
  events: Fixture["events"] | null;
  homeStyle: string;
  awayStyle: string;
  homeId: number;
  awayId: number;
  periods: Periods[] | null;
};
const Events: FC<Props> = ({
  events,
  homeStyle,
  awayStyle,
  homeId,
  awayId,
  periods,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={` flex flex-col gap-2 text-[10px] ${
        theme === "dark"
          ? "bg-dark/70 divide-dark-bg"
          : "bg-light divide-light-bg"
      } lg:mt-2 divide-y-[1px] rounded-lg`}
    >
      {events?.length === 0 && (
        <div className="flex justify-center items-center h-24">
          <p>No events</p>
        </div>
      )}

      {periods?.map((period) => (
        <div key={period.id} className="p-2">
          <h3 className={`  border border-solid border-gray-400/70 rounded-tr-lg rounded-tl-lg border-b-0 text-xl text-center py-2`}>{period.description}</h3>
          <EventHalf
            events={events}
            homeId={homeId}
            homeStyle={homeStyle}
            awayId={awayId}
            awayStyle={awayStyle}
            filterTime={period.description}
          />
        </div>
      ))}
    </div>
  );
};

export default Events;
