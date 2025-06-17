import { FaRegStar, FaStar } from "react-icons/fa";
import { imagePlaceholders } from "../utils/imagePlaceholders";
import { FC } from "react";
import { useFavorites } from "../context/FavoritesContext";

interface StarProps {
  leagueName?: string;
  teamName?: string;
  image_path?: string;
  homeTeamId?: number;
  awayTeamId?: number;
  leagueId?: number;
  teamId?: number;
  matchId?: number;
  type: string;
  homeTeamName?: string;
  awayTeamName?: string
}

const FavStar: FC<StarProps> = ({
  image_path,
  type,
  awayTeamId,
  homeTeamId,
  leagueId,
  matchId,
  teamId,
  leagueName,
  teamName,
  homeTeamName,
  awayTeamName
}) => {
  const {
    toggleFavorite,
    isLeagueFavorite,
    isTeamFavorite,
    isMatchFavorite,
    toggleFavoriteMatches,
    toggleFavoriteTeams,

  } = useFavorites();

  const condition = (): boolean => {
    switch (type.toLowerCase()) {
      case "league":
        return isLeagueFavorite(leagueId ?? 0);
      case "team":
        return isTeamFavorite(teamId ?? 0);
      case "match":
        return (
          isMatchFavorite(matchId ?? 0) ||
          isLeagueFavorite(leagueId ?? 0) ||
          isTeamFavorite(homeTeamId ?? 0) ||
          isTeamFavorite(awayTeamId ?? 0)
        );
      default:
        return false;
    }
  };

  const handleToggleFavorite = () => {
    if (type.toLowerCase() === "league") {
      const leagueItem = {
        id: leagueId ?? 0,
        name: leagueName || "N/A",
        logo: image_path || imagePlaceholders.league,
      };
      toggleFavorite(leagueItem);
    }
    if (type.toLowerCase() === "team") {
      const teamItem = {
        id: teamId ?? 0,
        name: teamName || "N/A",
        logo: image_path || imagePlaceholders.team,
      };
      toggleFavoriteTeams(teamItem);
    }
    if (type.toLowerCase() === "match") {
      const matchItem = {
        id: matchId ?? 0,
        leagueId: leagueId ?? 0,
        homeTeamId: homeTeamId ?? 0,
        awayTeamId: awayTeamId ?? 0,
      };
      if (isLeagueFavorite(leagueId ?? 0)) {
        return alert(`Match is favorite because of ${leagueName}`);
      } else if (isTeamFavorite(homeTeamId ?? 0)) {
        return alert(`Match is favorite because of ${homeTeamName}`);
      } else if (isTeamFavorite(awayTeamId ?? 0)) {
        return alert(`Match is favorite because of ${awayTeamName}`);
      } else {
        toggleFavoriteMatches(matchItem);
      }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleToggleFavorite();
  };

  return (
    <button
      className={`text-md cursor-pointer p-1 duration-100 hover:bg-fav/10 rounded-md focus:outline outline-fav `}
      aria-label={`${condition() ? "Remove from" : "Add to"} favorites`}
      title={`${condition() ? "Remove from" : "Add to"} favorites`}
      onClick={handleClick}
    >
      {condition() ? (
        <FaStar className="text-fav" />
      ) : (
        <FaRegStar className="text-gray-500" />
      )}
    </button>
  );
};

export default FavStar;
