import { FC } from "react";
import { useTheme } from "../context/ThemeContext";
import { LineUp, Events } from "../types/types";
import { imagePlaceholders } from "../utils/imagePlaceholders";
import { RiFootballFill } from "react-icons/ri";
import { GiRunningShoe } from "react-icons/gi";
import { TbArrowsExchange } from "react-icons/tb";

type props = {
  side: "home" | "away";
  lineup: LineUp[] | null;
  teamId: number | null;
  formation: string | null;
  events?: Events[] | null;
};

const LineUpCard: FC<props> = ({ side, lineup, teamId, formation, events }) => {
  const { theme } = useTheme();

  const formationArray =
    ((formation?.length ?? 0 > 0) &&
      formation?.split("-").map((num) => parseInt(num))) ||
    [];

  const formationLength = formationArray.length;
  formationLength > 0 && formationArray.unshift(1);

  const startingPlayers =
    lineup?.filter(
      (player) => player.type_id === 11 && player.team_id === teamId
    ) || [];

  const checkIfPlayerScored = (playerId: number) => {
    if (!events || events.length === 0) return [];
    return events.filter(
      (event) =>
        event.player_id === playerId &&
        (event.type.developer_name === "GOAL" ||
          event.type.developer_name === "PENALTY")
    );
  };

  const checkIfPlayerAssisted = (playerId: number) => {
    if (!events || events.length === 0) return [];
    return events.filter(
      (event) =>
        event.related_player_id === playerId &&
        event.type.developer_name === "GOAL"
    );
  };

  const checkIfPlayerHasRedCard = (playerId: number) => {
    if (!events || events.length === 0) return false;
    return events.find(
      (event) =>
        event.player_id === playerId &&
        (event.type.developer_name === "REDCARD" ||
          event.type.developer_name === "YELLOWREDCARD")
    );
  };

  const checkIfPlayerWasSubstituted = (playerId: number) => {
    if (!events || events.length === 0) return [];
    return events.filter(
      (event) =>
        (event.player_id === playerId ||
          event.related_player_id === playerId) &&
        event.type.developer_name === "SUBSTITUTION"
    );
  };

  if (formationArray.length === 0) {
    return (
      <div className="lg:-rotate-270">
        {side === "home" ? "Formation Not Available" : ""}
      </div>
    );
  }

  return (
    <div
      className={`${
        theme === "dark" ? "bg-dark-bg" : "bg-[#3b8063]"
      } border border-gray-400 w-full h-[400px] xl:h-[400px] lg:h-[310px] min-[70rem]:h-[350px] lg:w-[500px] relative overflow-hidden text-white`}
    >
      <div
        className={` border-r border-gray-400 h-[20px] w-[20px] absolute left-0 ${
          side === "home"
            ? "top-0 rounded-br-full border-b"
            : "bottom-0 rounded-tr-full border-t"
        }`}
      ></div>
      <div
        className={`border-l border-gray-400 h-[20px] w-[20px] ${
          side === "home"
            ? "top-0 rounded-bl-full border-b"
            : "bottom-0 rounded-tl-full border-t"
        } absolute right-0 }`}
      ></div>
      <div
        className={`h-[40px] w-[120px] border border-gray-400 absolute left-[50%] translate-x-[-50%] ${
          side === "home" ? "border-t-0" : "border-b-0 bottom-0"
        } z-10 ${theme === "dark" ? "bg-dark-bg" : "bg-[#3b8063]"}`}
      ></div>
      <div
        className={`h-[20px] w-[60px] border border-gray-400 absolute left-[50%] translate-x-[-50%] ${
          side === "home" ? "border-t-0" : "border-b-0 bottom-0"
        } z-20`}
      ></div>
      <div
        className={`h-[60px] w-[60px] border border-gray-400 absolute left-[50%] translate-x-[-50%]  ${
          side === "home" ? "translate-y-[-5px]" : "bottom-0 translate-y-[5px]"
        } rounded-full`}
      ></div>
      <div
        className={`h-[100px] w-[100px] border border-gray-400 rounded-full absolute left-[50%] translate-x-[-50%] ${
          side === "home" ? "bottom-0 translate-y-[50%]" : " translate-y-[-50%]"
        }`}
      ></div>
      <div
        className={`flex justify-around ${
          side === "home" ? "flex-col" : "flex-col-reverse"
        } h-full  `}
        style={{}}
      >
        {formationArray.map((num, lineIndex) => {
          const lineNumber = lineIndex + 1;
          const playerInLine = startingPlayers.filter(
            (player) =>
              player.formation_field &&
              parseInt(player.formation_field[0]) === lineNumber
          );
          if (playerInLine.length === 0) return null;
          return (
            <div
              key={lineIndex}
              className={`flex justify-center gap-2 z-30`}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${num}, minmax(0, 1fr))`, // Changed to columns
                alignItems: "center",
                justifyItems: "center",
              }}
            >
              {playerInLine
                .sort((a, b) => {
                  const aPosition = a.formation_field?.[2]
                    ? parseInt(a.formation_field[2])
                    : 0;
                  const bPosition = b.formation_field?.[2]
                    ? parseInt(b.formation_field[2])
                    : 0;
                  return aPosition - bPosition;
                })
                .map((player) => (
                  <div key={player.id} className="z-30">
                    <div className="flex flex-col items-center justify-center lg:rotate-90 relative  w-[50px]">
                      <div className="h-9 w-9 bg-white flex justify-center items-end rounded-full overflow-hidden ">
                        <img
                          src={`${
                            player?.player?.image_path ||
                            imagePlaceholders.player
                          }`}
                          alt=""
                          className=" w-8"
                        />
                      </div>
                      {checkIfPlayerScored(player?.player_id).length > 0 &&
                        checkIfPlayerScored(player?.player_id).map(
                          (event, index) => (
                            <div
                              key={`goal-${player.player_id}-${index}`}
                              className="absolute text-accent bg-black rounded-full"
                              style={{
                                left: `-${index * 6}px`,
                                zIndex: index * 2,
                              }}
                              title={`${event.type.name} at ${event.minute}'`}
                            >
                              <RiFootballFill />
                            </div>
                          )
                        )}

                      {checkIfPlayerAssisted(player?.player_id).length > 0 &&
                        checkIfPlayerAssisted(player?.player_id).map(
                          (_, index) => (
                            <div
                              key={`assist-${player.player_id}-${index}`}
                              className="absolute text-white "
                              style={{
                                right: `${index * 5}px`,
                                zIndex: index * 2,
                              }}
                            >
                              <GiRunningShoe size={12} />
                            </div>
                          )
                        )}

                      {checkIfPlayerHasRedCard(player?.player_id) && (
                        <div
                          className="absolute bg-red-600 h-4 w-3"
                          style={{
                            top: "-5px",
                            right: "0px",
                            zIndex: 10,
                          }}
                        />
                      )}

                      {checkIfPlayerWasSubstituted(player?.player_id).length >
                        0 &&
                        checkIfPlayerWasSubstituted(player?.player_id).map(
                          (event) => (
                            <div
                              key={`sub-${player.player_id}`}
                              className="absolute text-xs text--700"
                              style={{
                                top: "-10px",
                                left: "0px",
                                zIndex: 10,
                              }}
                            >
                              <span className="">{event.minute}'</span>
                              <TbArrowsExchange className="" />
                            </div>
                          )
                        )}

                      {player?.details?.find(
                        (detail) => detail.type.developer_name === "RATING"
                      )?.data.value && (
                        <div
                          className={`${
                            (player?.details?.find(
                              (detail) =>
                                detail.type.developer_name === "RATING"
                            )?.data.value || 0) > 9
                              ? "bg-blue-500"
                              : (player?.details?.find(
                                  (detail) =>
                                    detail.type.developer_name === "RATING"
                                )?.data.value || 0) > 8
                              ? "bg-blue-400"
                              : (player?.details?.find(
                                  (detail) =>
                                    detail.type.developer_name === "RATING"
                                )?.data.value || 0) > 7
                              ? "bg-green-500"
                              : (player?.details?.find(
                                  (detail) =>
                                    detail.type.developer_name === "RATING"
                                )?.data.value || 0) > 6
                              ? "bg-yellow-600"
                              : "bg-red-500"
                          } -mt-1 font-bold text-xs text-center text-white px-1`}
                        >
                          {(
                            player?.details?.find(
                              (detail) =>
                                detail.type.developer_name === "RATING"
                            )?.data.value || 0
                          ).toFixed(1) || 0}
                        </div>
                      )}

                      <div className="text-[10px] text-center flex gap-[2px]">
                        <div className="text-gray-400">
                          {player.jersey_number}
                        </div>
                        <div>
                          {player.player?.lastname?.split(" ")[0] ||
                            player.player?.firstname?.split(" ")[0]}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {/* <div className="h-20 w-10 absolute bg-accent top-1/2 left-1/2 -translate-1/2"></div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LineUpCard;
