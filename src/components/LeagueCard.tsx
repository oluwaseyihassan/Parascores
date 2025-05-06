import { Dispatch, FC, SetStateAction, useMemo, useState } from "react";
import { LeagueType } from "../types/types";
import CustomSelect from "./CustomSelect";
import { useTheme } from "../context/ThemeContext";

type leagueCardProps = {
  league:
    | {
        data: {
          data: LeagueType["league"];
        };
        success: boolean;
        message: string;
      }
    | undefined;
  seasonId: number | undefined;
  setSeasonId: Dispatch<SetStateAction<number | undefined>>;
};

const LeagueCard: FC<leagueCardProps> = ({ league, setSeasonId }) => {
  const { theme } = useTheme();
  const options = useMemo(() => {
    if (!league?.data.data.seasons) return [];
    return league.data.data.seasons.map((season) => {
      return {
        value: season.id,
        label: season.name || "",
      };
    });
  }, [league]);
  const [selectedOption, setSelectedOption] = useState({
    value: league?.data.data.currentseason.id ?? 0,
    label: league?.data.data.currentseason.name ?? "",
  });
  return (
    <div
      className={`${
        theme === "dark" ? "bg-dark/70" : "bg-light"
      } flex items-center gap-2 p-2 rounded-lg`}
    >
      <div className="w-16 h-16">
        <img
          src={`${league?.data.data.image_path}`}
          alt=""
          className="w-full h-full"
        />
      </div>
      <div>
        <div>
          {league?.data.data.name} {league?.data.data.currentseason.name}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7">
            <img
              src={`${league?.data.data.country?.image_path}`}
              alt=""
              className="w-full"
            />
          </div>
          <div>{league?.data.data.country?.name}</div>
          {((league?.data.data.seasons.length ?? 0) > 0 ||
            league?.data.data.currentseason.id) && (
            <CustomSelect
              options={options}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              setSeasonId={setSeasonId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LeagueCard;
