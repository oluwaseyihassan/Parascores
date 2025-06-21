import { FC } from "react";
import { Fixture } from "../types/types";
import { TbDeviceComputerCamera } from "react-icons/tb";
import { RiFootballFill } from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";
import { GoArrowLeft } from "react-icons/go";

type Props = {
  events: Fixture["events"] | null;
  homeStyle: string;
  awayStyle: string;
  homeId: number;
  awayId: number;
  filterTime: string;
};

const EventHalf: FC<Props> = ({
  events,
  homeStyle,
  homeId,
  awayId,
  awayStyle,
  filterTime,
}) => {
  const { theme } = useTheme();
  const eventIcon = (type: string) => {
    switch (type) {
      case "GOAL":
        return <RiFootballFill className="text-base" />;
      case "OWNGOAL":
        return <RiFootballFill className="text-base text-red-400" />;
      case "PENALTY":
        return "🎯";
      case "MISSED_PENALTY":
        return "❌";
      case "YELLOWCARD":
        return "🟨";
      case "REDCARD":
        return "🟥";
      case "YELLOWREDCARD":
        return (
          <div className="relative">
            <span>🟨</span>
            <span className="absolute top-1 left-1">🟥</span>
          </div>
        );
      case "SUBSTITUTION":
        return (
          <div>
            <GoArrowLeft className="text-accent" />
            <GoArrowLeft className="rotate-180 -mt-1 text-red-600" />
          </div>
        );
      case "VAR":
        return <TbDeviceComputerCamera className="text-base" />;
      case "PENALTY_SHOOTOUT_GOAL":
        return "⚽️🎯";
      case "PENALTY_SHOOTOUT_MISS":
        return "❌🎯";
      case "VAR_CARD":
        return <span className="flex">🟨/🟥</span>;
      default:
        return type;
    }
  };
  return (
    <div
      className={`${
        theme === "dark" ? "divide-dark-bg" : "divide-light-bg"
      } divide-y px-2 `}
    >
      {(events?.length ?? 0) > 0 &&
        events
          ?.sort((a, b) => a.sort_order - b.sort_order)
          .sort(
            (a, b) =>
              (a.minute ?? 0) +
              (a.extra_minute ?? 0) -
              ((b.minute ?? 0) + (b.extra_minute ?? 0))
          )
          ?.filter((event) => event.period.description === filterTime)
          .map((event) => {
            return event ? (
              <div
                key={event.id}
                className={`${
                  homeId === event.participant_id
                    ? homeStyle
                    : awayId === event.participant_id
                    ? awayStyle
                    : ""
                } flex items-center min-h-[40px] gap-2 px-2`}
              >
                <div>
                  <div>{event.player_name || "Name not available"}</div>
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

                <div className={`${homeId === event.participant_id ? "text-right" : "text-left"} font-semibold min-w-[30px]`}>
                  {event.minute}
                  {event.extra_minute && <span>+{event.extra_minute}</span>}'
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-6">
                <p>No events</p>
              </div>
            );
          })}
    </div>
  );
};

export default EventHalf;
