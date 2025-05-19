import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { imagePlaceholders } from "../utils/imagePlaceholders";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";
import { FaStar } from "react-icons/fa";

const FavoriteLeagues = () => {
  const { theme } = useTheme();
  const { favoriteLeagues, isLeagueFavorite, toggleFavorite } = useFavorites();
  console.log(favoriteLeagues);
  const [showAllLeagues, setShowAllLeagues] = useState(false);

  return (
    <div>
      <h2 className="text-xl text-center text-accent font-semibold mb-4">
        Favorite Leagues
      </h2>
      <div
        className={`${
          theme === "dark"
            ? "bg-dark/70 divide-dark-bg"
            : "bg-light divide-light-bg"
        } divide-y-[2px] rounded-sm text-[0.9rem]`}
      >
        {favoriteLeagues.length > 0 ? (
          favoriteLeagues.map((league) => (
            <div
              className={`flex items-center justify-between gap-2 py-1.5 px-2 ${
                theme === "dark"
                  ? " hover:bg-gray-600/10"
                  : "hover:bg-gray-400/10"
              }`}
              key={league.id}
            >
              <Link
                to={`/league/${league.name?.replace(/ +/g, "-")}/${league.id}`}
                className="flex items-center gap-2 w-full "
              >
                <div className="w-5 h-5 flex justify-center items-center">
                  <img
                    src={`${league.logo || imagePlaceholders.league}`}
                    alt=""
                  />
                </div>
                <span>{league.name || "Unknown League"}</span>
              </Link>
              <button
                className={`text-md cursor-pointer hover:text-accent p-1 transition-colors duration-100 hover:bg-accent/10 rounded-md focus:outline-none z-10`}
                style={{
                  color: isLeagueFavorite(league.id) ? "#009b72" : "gray",
                }}
                aria-label="Add to favorites"
                onClick={() => {
                  toggleFavorite({
                    id: league.id,
                    name: league.name,
                    logo: league.logo || imagePlaceholders.team,
                  });
                }}
                title="Remove from favorites"
              >
                <FaStar />
              </button>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center w-full h-full py-1">
            <p className="text-gray-500">No favorite leagues found.</p>
          </div>
        )}
        {favoriteLeagues.length > 5 && (
          <button
            className={`${
              theme === "dark"
                ? " hover:bg-gray-600/10"
                : "hover:bg-gray-400/10"
            } text-accent text-center py-1 rounded-md cursor-pointer transition-colors duration-100 focus:outline-none w-full`}
            onClick={() => setShowAllLeagues(!showAllLeagues)}
          >
            {showAllLeagues ? "Show less" : "Show all"}
          </button>
        )}
      </div>
    </div>
  );
};

export default FavoriteLeagues;
