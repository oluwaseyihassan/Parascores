import { Dispatch, FC, SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFixtureById } from "../api/queries";
import { Today } from "../types/types";
import { RiFootballFill } from "react-icons/ri";
import Events from "./Events";
import { Link } from "react-router-dom";
import FixtureCard from "./FixtureCard";

type Props = {
  fixtureId: number | undefined;
  setFixtureId: Dispatch<SetStateAction<number | undefined>>;
};

type ApiResponse = {
  data: {
    data: Today;
  };
  success: boolean;
};

const FixtureEvents: FC<Props> = ({ fixtureId }) => {
  const { data: fixtureEvents, isLoading } = useQuery<ApiResponse>({
    queryKey: ["fixtureEvents", fixtureId],
    queryFn: async () => {
      if (fixtureId === undefined) {
        throw new Error("fixtureId is undefined");
      }
      return getFixtureById(
        fixtureId,
        "participants;events.type;events.subType;events.period;state;scores;periods;league",
        ""
      );
    },
    enabled: !!fixtureId,
  });
  console.log(fixtureEvents);

  return (
    <div className="max-h-[90dvh] min-h-[200px]">
      <h2 className="text-accent text-center text-xl font-semibold">
        Match Info
      </h2>
      {isLoading && (
        <div className="flex justify-center h-full items-center mt-10">
          <RiFootballFill className="animate-spin text-4xl text-accent" />
        </div>
      )}
      {!isLoading && fixtureId && (
        <section>
          <FixtureCard fixture={fixtureEvents?.data.data || null} />
          <div className="flex justify-center">
            <Link
              to={`/match/${fixtureId}`}
              className={`text-white w-fit mt-2 px-4 bg-accent flex justify-center py-1 rounded-lg text-sm hover:bg-accent/80`}
            >
              GoTo Match
            </Link>
          </div>
          <section className="overflow-y-auto scroll_bar max-h-[70dvh] mt-4">
            <Events
              events={fixtureEvents?.data.data.events ?? null}
              homeId={
                fixtureEvents?.data.data.participants?.filter(
                  (participant) => participant.meta.location === "home"
                )[0].id ?? 0
              }
              awayId={
                fixtureEvents?.data.data.participants?.filter(
                  (participant) => participant.meta.location === "away"
                )[0].id ?? 0
              }
              homeStyle="justify-end flex-row-reverse"
              awayStyle="justify-end text-right"
              periods={fixtureEvents?.data.data.periods ?? null}
            />
          </section>
        </section>
      )}
    </div>
  );
};

export default FixtureEvents;
