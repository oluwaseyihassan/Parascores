import { FC, useMemo } from "react";
import { Today } from "../types/types";
import { useTheme } from "../context/ThemeContext";
import StatisticsCard from "./StatisticsCard";

type props = {
  fixture: Today | null;
};

const Statistics: FC<props> = ({ fixture }) => {
  const { theme } = useTheme();
  const groupedStats = useMemo(() => {
    if (!fixture?.statistics) return [];

    const statMap = new Map();
    fixture.statistics.forEach((stat) => {
      const name = stat.type.name;
      const value = stat.data.value;
      const location = stat.location;

      if (!statMap.has(name)) {
        statMap.set(name, { name, home: null, away: null });
      }

      const existingStat = statMap.get(name);
      if (location === "home") {
        existingStat.home = value;
      } else if (location === "away") {
        existingStat.away = value;
      }
    });

    return Array.from(statMap.values());
  }, [fixture?.statistics]);

  if (!fixture?.statistics || fixture.statistics.length === 0) {
    return (
      <div
        className={`px-2 py-3  `}
      >
        <div className="flex justify-center items-center">
          No Statistics Available
        </div>
      </div>
    );
  }

  return (
    <div
      className={` px-2 py-3 lg:mt-4 ${
        theme === "dark" ? "bg-dark/70 " : "bg-light"
      } rounded-lg`}
    >
      <h2 className="text-center">Statistics</h2>
      {fixture?.statistics?.length ?? 0 > 0 ? (
        <>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center  gap-2 text-xs">
              <div className="h-6 w-6">
                <img
                  src={`${
                    fixture?.participants?.find(
                      (participant) => participant.meta.location === "home"
                    )?.image_path
                  }`}
                  alt=""
                  className="h-full w-full"
                />
              </div>
              {
                fixture?.participants?.find(
                  (participant) => participant.meta.location === "home"
                )?.name
              }
            </div>
            <div className="flex items-center gap-2 text-xs">
              {
                fixture?.participants?.find(
                  (participant) => participant.meta.location === "away"
                )?.name
              }
              <div className="h-6 w-6">
                <img
                  src={`${
                    fixture?.participants?.find(
                      (participant) => participant.meta.location === "away"
                    )?.image_path
                  }`}
                  alt=""
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
          <StatisticsCard
            stats={fixture?.statistics ?? null}
            homeId={
              fixture?.participants?.find(
                (participant) => participant.meta.location === "home"
              )?.id ?? 0
            }
            awayId={
              fixture?.participants?.find(
                (participant) => participant.meta.location === "away"
              )?.id ?? 0
            }
            groupedStats={groupedStats}
          />
        </>
      ) : (
        <div className="flex justify-center items-center h-24">
          No Statistics Available
        </div>
      )}
    </div>
  );
};

export default Statistics;
