import { FC } from "react";
import { TeamType } from "../types/types";
import { imagePlaceholders } from "../utils/imagePlaceholders";
import { useTheme } from "../context/ThemeContext";
import FavStar from "./FavStar";

type props = {
  team: TeamType;
};

const TeamCard: FC<props> = ({ team }) => {
  const { theme } = useTheme();
  return (
    <div
      className={`flex gap-2 p-4 rounded-lg shadow-md ${
        theme === "dark" ? "bg-dark-bg text-white" : "bg-light-bg text-dark-bg"
      }`}
    >
      <div className="h-16">
        <img
          src={team.image_path || imagePlaceholders.team}
          alt=""
          className="h-full"
        />
      </div>
      <div className="flex flex-col justify-center gap-2">
        <div className="flex items-center gap-2">
          <div>{team.name}</div>
         <FavStar
           teamId={team.id}
           teamName={team.name}
           image_path={team.image_path || imagePlaceholders.team}
           type="team"
         />
        </div>
        <div className="flex items-center gap-2">
          <div className=" h-7 rounded-full overflow-hidden w-7">
            <img
              src={team.country?.image_path || imagePlaceholders.league}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-sm">{team.country?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
