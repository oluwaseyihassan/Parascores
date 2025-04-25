import { Dispatch, FC, SetStateAction } from "react";
import { useTheme } from "../context/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import { getFixtureById } from "../api/queries";
import { Fixture } from "../types/types";
import { RiFootballFill } from "react-icons/ri";
import Events from "./Events";

type Props = {
  fixtureId: number | undefined;
  setFixtureId: Dispatch<SetStateAction<number | undefined>>;
};

type ApiResponse = {
  data: {
    data: Fixture;
  };
  success: boolean;
};

const FixtureEvents: FC<Props> = ({ fixtureId, setFixtureId }) => {
  const { theme } = useTheme();

  const { data: fixtureEvents, isLoading } = useQuery<ApiResponse>({
    queryKey: ["fixtureEvents", fixtureId],
    queryFn: async () => {
      if (fixtureId === undefined) {
        throw new Error("fixtureId is undefined");
      }
      return getFixtureById(
        fixtureId,
        "participants;events.type;events.subType",
        ""
      );
    },
    enabled: !!fixtureId,
  });
  return (
    <div className="h-[80dvh] overflow-y-scroll scroll_bar ">
      <h2 className="text-accent text-center text-xl font-semibold">
        Match Info
      </h2>
      {isLoading && (
        <div className="flex justify-center items-center h-24 animate-spin text-4xl text-accent">
          <RiFootballFill />
        </div>
      )}
      {!isLoading && fixtureId && (
        <section>
          <section
            className={`${
              theme === "dark" ? "bg-dark/70" : "bg-light"
            } grid grid-cols-3 bg-accent p-2 rounded-lg mt-4`}
          >
            <div className="col-span-1 wrap-break-word text-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-9 h-9">
                  <img
                    src={`${
                      fixtureEvents?.data.data.participants?.filter(
                        (participant) => participant.meta.location === "home"
                      )[0].image_path
                    }`}
                    alt=""
                    className="w-full h-full"
                  />
                </div>
                <span className="text-xs max-w-full">
                  {
                    fixtureEvents?.data.data.participants?.filter(
                      (participant) => participant.meta.location === "home"
                    )[0].name
                  }
                </span>
              </div>
            </div>
            <div className="col-span-1"></div>
            <div className="col-span-1 wrap-break-word text-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-9 h-9">
                  <img
                    src={`${
                      fixtureEvents?.data.data.participants?.filter(
                        (participant) => participant.meta.location === "away"
                      )[0].image_path
                    }`}
                    alt=""
                    className="w-full h-full"
                  />
                </div>
                <span className="text-xs max-w-full">
                  {
                    fixtureEvents?.data.data.participants?.filter(
                      (participant) => participant.meta.location === "away"
                    )[0].short_code
                  }
                </span>
              </div>
            </div>
          </section>
          <section>
            <Events
              events={fixtureEvents?.data.data.events ?? null}
              style={``}
            />
          </section>
        </section>
      )}
    </div>
  );
};

export default FixtureEvents;
