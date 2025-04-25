import { FC } from "react";
import { Fixture } from "../types/types";

type Props = {
  events: Fixture["events"] | null;
  style: string;
};
const Events: FC<Props> = ({ events, style }) => {
  return (
    <div className={`${style} flex flex-col gap-2 text-[8px]`}>
        {events?.length === 0 && (
            <div className="flex justify-center items-center h-6">
                <p>No events</p>
            </div>
        )}
      {(events?.length ?? 0) > 0 &&
        events
          ?.sort(
            (a, b) =>
              (a.minute ?? 0) +
              (a.extra_minute ?? 0) -
              ((b.minute ?? 0) + (b.extra_minute ?? 0))
          )
          ?.map((event) => (
            <div key={event.id}>
              <div>{event.player_name}</div>
              <div>
                {event.type.name}
                {event.minute}
              </div>
            </div>
          ))}
    </div>
  );
};

export default Events;
