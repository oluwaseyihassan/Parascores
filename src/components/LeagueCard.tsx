import { Dispatch, FC, SetStateAction, useMemo, useState } from "react";
import { LeagueType } from "../types/types";
import CustomSelect from "./CustomSelect";
import { useTheme } from "../context/ThemeContext";
import { imagePlaceholders } from "../utils/imagePlaceholders";
import FavStar from "./FavStar";

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
      } flex items-center gap-2 p-2 rounded-lg sm:text-[1.4rem]`}
    >
      <div className="w-16 h-16">
        <img
          src={`${league?.data.data.image_path || imagePlaceholders.league}`} 
          alt=""
          className="w-full h-full"
        />
      </div>
      <div className="flex items-center justify-between w-full flex-wrap">
        <div>
          <div className="flex gap-2">
            <span>{league?.data.data.name}</span>
            <FavStar
              leagueId={league?.data.data.id ?? 0}
              leagueName={league?.data.data.name || ""}
              image_path={
                league?.data.data.image_path || imagePlaceholders.league
              }
              type="league"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className=" h-7 rounded-full overflow-hidden w-7">
              <img
                src={`${league?.data.data.country?.image_path || imagePlaceholders.league}`}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div>{league?.data.data.country?.name}</div>
          </div>
        </div>
        {((league?.data.data.seasons.length ?? 0) > 0 ||
          league?.data.data.currentseason.id) && (
          <div className="w-[150px]">
            <CustomSelect
              options={options}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              setSeasonId={setSeasonId}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LeagueCard;
