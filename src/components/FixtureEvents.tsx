import { Dispatch, FC, SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFixtureById } from "../api/queries";
import {  Today } from "../types/types";
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
        "participants;events.type;events.subType;state;scores;periods",
        ""
      );
    },
    enabled: !!fixtureId,
  });
  console.log(fixtureEvents);



  
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
         <FixtureCard fixture={fixtureEvents?.data.data || null}/>
          <Link to={`/match/${fixtureId}`}>GoTo Match</Link>
          <section>
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
            />
          </section>
        </section>
      )}
    </div>
  );
};

export default FixtureEvents;
