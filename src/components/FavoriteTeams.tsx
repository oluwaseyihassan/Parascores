import { useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { Link } from "react-router-dom";
import { imagePlaceholders } from "../utils/imagePlaceholders";
import { useTheme } from "../context/ThemeContext";
import FavStar from "./FavStar";

const FavoriteTeams = () => {
  const { theme } = useTheme();
  const { favoriteTeams } = useFavorites();
  const [showAllteams, setShowAllteams] = useState(false);

  return (
    <div>
      <h2 className="text-xl text-center text-accent font-semibold mb-4">
        Favorite teams
      </h2>
      <div
        className={`${
          theme === "dark"
            ? "bg-dark/70 divide-dark-bg"
            : "bg-light divide-light-bg"
        } divide-y-[2px] rounded-sm text-[0.9rem]`}
      >
        {favoriteTeams.length > 0 ? (
          favoriteTeams
            .slice(0, showAllteams ? favoriteTeams.length : 5)
            .map((team) => (
              <div
                className={`flex items-center justify-between gap-2 py-1.5 px-2 ${
                  theme === "dark"
                    ? " hover:bg-gray-600/10"
                    : "hover:bg-gray-400/10"
                }`}
                key={team.id}
              >
                <Link
                  to={`/team/${team.name?.replace(/ +/g, "-")}/${team.id}`}
                  className="flex items-center gap-2 w-full "
                >
                  <div className="w-5 h-5 flex justify-center items-center">
                    <img
                      src={`${team.logo || imagePlaceholders.team}`}
                      alt=""
                    />
                  </div>
                  <span>{team.name || "Unknown team"}</span>
                </Link>
                <FavStar
                  teamId={team.id}
                  teamName={team.name}
                  image_path={team.logo || imagePlaceholders.team}
                  type="team"
                />
              </div>
            ))
        ) : (
          <div className="flex items-center justify-center w-full h-full py-1">
            <p className="text-gray-500">No favorite teams found.</p>
          </div>
        )}
        {favoriteTeams.length > 5 && (
          <button
            className={`${
              theme === "dark"
                ? " hover:bg-gray-600/10"
                : "hover:bg-gray-400/10"
            } text-accent text-center py-1 rounded-md cursor-pointer transition-colors duration-100 focus:outline-none w-full`}
            onClick={() => setShowAllteams(!showAllteams)}
          >
            {showAllteams
              ? "Show less"
              : `Show all (${favoriteTeams.length - 5})`}
          </button>
        )}
      </div>
    </div>
  );
};

export default FavoriteTeams;
