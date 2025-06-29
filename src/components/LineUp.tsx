import { FC } from "react";
import { Today } from "../types/types";
import LineUpCard from "./LineUpCard";

type props = {
  fixture: Today | null;
};

const LineUp: FC<props> = ({ fixture }) => {
  return (
    <section className=" h-fit min-h-[100px]">
      <div className=" p-2 grid grid-cols-2 gap-4">
        <div className="flex items-center lg:justify-start justify-center gap-2 lg:col-span-1 col-span-2 justify-self-start lg:text-base text-sm mt-2 lg:mt-0 w-full ">
          <div className="h-7 w-7">
            <img
              src={`${
                fixture?.participants?.find(
                  (participant) => participant.meta.location === "home"
                )?.image_path
              }`}
              alt=""
              className="w-full h-full"
            />
          </div>
          {
            fixture?.participants?.find(
              (participant) => participant.meta.location === "home"
            )?.name
          }
          <div>
            {
              fixture?.metadata?.find(
                (meta) => meta.type.developer_name === "FORMATION"
              )?.values.home
            }
          </div>
        </div>
        <div className="hidden items-center justify-center gap-2 lg:col-span-1 justify-self-end lg:flex">
          <div>
            {
              fixture?.metadata?.find(
                (meta) => meta.type.developer_name === "FORMATION"
              )?.values.away
            }
          </div>
          {
            fixture?.participants?.find(
              (participant) => participant.meta.location === "away"
            )?.name
          }
          <div className="h-7 w-7">
            <img
              src={`${
                fixture?.participants?.find(
                  (participant) => participant.meta.location === "away"
                )?.image_path
              }`}
              alt=""
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
      {/* <div className="flex w-full p-2 h-full origin-bottom bg-accent items-center justify-center">
          <LineUpCard side={"home"} />
          <LineUpCard side={"away"} />
        </div> */}
      {fixture?.lineups?.length === 0 ? (
        <div className="flex justify-center items-center h-full text-gray-400">
          No lineups available
        </div>
      ) : (
        <div className="lg:rotate-270 justify-center items-center lg:mt-[-10%] flex flex-col">
          <LineUpCard
            side={"home"}
            lineup={fixture?.lineups ?? []}
            events={fixture?.events ?? null}
            teamId={
              fixture?.participants?.find(
                (participant) => participant.meta.location === "home"
              )?.id ?? null
            }
            formation={
              fixture?.metadata?.find(
                (meta) => meta.type.developer_name === "FORMATION"
              )?.values.home ?? null
            }
          />
          <LineUpCard
            side={"away"}
            lineup={fixture?.lineups ?? []}
            events={fixture?.events ?? null}
            teamId={
              fixture?.participants?.find(
                (participant) => participant.meta.location === "away"
              )?.id ?? null
            }
            formation={
              fixture?.metadata?.find(
                (meta) => meta.type.developer_name === "FORMATION"
              )?.values.away ?? null
            }
          />
          <div className="flex items-center gap-2 lg:hidden lg:text-base text-sm mt-2 lg:mt-0">
            <div className="h-7 w-7">
              <img
                src={`${
                  fixture?.participants?.find(
                    (participant) => participant.meta.location === "away"
                  )?.image_path
                }`}
                alt=""
                className="w-full h-full"
              />
            </div>
            {
              fixture?.participants?.find(
                (participant) => participant.meta.location === "away"
              )?.name
            }
            <div>
              {
                fixture?.metadata?.find(
                  (meta) => meta.type.developer_name === "FORMATION"
                )?.values.away
              }
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LineUp;
