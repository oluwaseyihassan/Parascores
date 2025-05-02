import React, { FC } from "react";
import { Statistics } from "../types/types";

type StatisticsCardProps = {
  stats: Statistics[] | null;
  homeId: number | null;
  awayId: number | null;
  groupedStats:
    | {
        name: string | null;
        home: number | null;
        away: number | null;
      }[]
    | null;
};

const StatisticsCard: FC<StatisticsCardProps> = ({ stats, groupedStats }) => {
  return (
    <div className="text-xs flex flex-col gap-1">
      {groupedStats?.map((stat) => (
        <div key={stat.name}>
        <div className="text-center">{stat.name}</div>
          <div className="flex items-center justify-between">
            <div>{stat.home}</div>
            <div>{stat.away}</div>
          </div>
          <div className={`w-full h-1 bg-accent rounded-full overflow-clip`}>
            <div
              className={`h-full bg-red-500`}
              style={{
                width: `${
                  (+(stat.home ?? 0) /
                    (+(stat.home ?? 0) + +(stat.away ?? 0))) *
                  100
                }%`,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCard;
