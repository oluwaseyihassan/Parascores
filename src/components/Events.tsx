import { FC } from "react";
import { Fixture } from "../types/types";
import { useTheme } from "../context/ThemeContext";
import { TbDeviceComputerCamera } from "react-icons/tb";
import { RiFootballFill } from "react-icons/ri";


type Props = {
  events: Fixture["events"] | null;
  homeStyle: string;
  awayStyle: string;
  homeId: number;
  awayId: number;
};
const Events: FC<Props> = ({
  events,
  homeStyle,
  awayStyle,
  homeId,
  awayId,
}) => {
  const { theme } = useTheme();
  const eventIcon = (type: string) => {
    switch (type) {
      case "GOAL":
        return (
          <RiFootballFill className="text-base" />
        );
      case "OWNGOAL":
        return (
          <RiFootballFill className="text-base text-red-400" />
        );
      case "PENALTY":
        return "⚽️🎯";
      case "MISSED_PENALTY":
        return "❌🎯";
      case "YELLOWCARD":
        return <div className="h-3 w-2 bg-yellow-500"></div>;
      case "REDCARD":
        return "🟥";
      case "YELLOWREDCARD":
        return "🟨🟥";
      case "SUBSTITUTION":
        return "🔄";
      case "VAR":
        return <TbDeviceComputerCamera className="text-base" />;
      case "PENALTY_SHOOTOUT_GOAL":
        return "⚽️🎯";
      case "PENALTY_SHOOTOUT_MISS":
        return "❌🎯";
      case "VAR_CARD":
        return "🟨/🟥";
      default:
        return type;
    }
  };
  return (
    <div
      className={` flex flex-col gap-2 text-[8px] ${
        theme === "dark"
          ? "bg-dark/70 divide-dark-bg"
          : "bg-light divide-light-bg"
      } mt-2 divide-y-[1px] rounded-lg`}
    >
      {events?.length === 0 && (
        <div className="flex justify-center items-center h-6">
          <p>No events</p>
        </div>
      )}
      {(events?.length ?? 0) > 0 &&
        events
        ?.sort((a, b) => a.sort_order - b.sort_order)
          .sort(
            (a, b) =>
              (a.minute ?? 0) +
              (a.extra_minute ?? 0) -
              ((b.minute ?? 0) + (b.extra_minute ?? 0))
          )
          ?.map((event) => (
            <div
              key={event.id}
              className={`${
                homeId === event.participant_id
                  ? homeStyle
                  : awayId === event.participant_id
                  ? awayStyle
                  : ""
              } flex items-center min-h-[30px] gap-2 px-2`}
            >
              <div>
                <div>{event.player_name}</div>
                {event.related_player_name && (
                  <div className="text-gray-400">
                    {event.related_player_name}
                  </div>
                )}
                {event.type.developer_name === "VAR" && (
                  <div className="text-gray-400">{event.addition}</div>
                )}
              </div>

              <div
                title={`${
                  event.subtype ? event.subtype.name : event.type.name
                }`}
                className="w-5 flex justify-center items-center"
              >
                {eventIcon(event.type.developer_name ?? "")}
              </div>

              <div className="font-semibold">{event.minute}{event.extra_minute && <span>+{event.extra_minute}</span>}'</div>
            </div>
          ))}
    </div>
  );
};

export default Events;
