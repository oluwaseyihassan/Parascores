import { FaRegStar, FaStar } from "react-icons/fa";
import { imagePlaceholders } from "../utils/imagePlaceholders";
import { Dispatch, FC, SetStateAction } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { Bounce, toast } from "react-toastify";

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
  awayTeamName?: string;
  setShowMessage?: Dispatch<SetStateAction<number | null>>;
  setMatchFavMessage?: Dispatch<
    SetStateAction<
      {
        message: string | null;
        logo: string | null;
      }[]
    >
  >;
  homeLogo?: string;
  awayLogo?: string;
  leagueLogo?: string;
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
  awayTeamName,
  setShowMessage,
  setMatchFavMessage,
  homeLogo,
  awayLogo,
  leagueLogo,
}) => {
  const {
    toggleFavorite,
    isLeagueFavorite,
    isTeamFavorite,
    isMatchFavorite,
    toggleFavoriteMatches,
    toggleFavoriteTeams,
  } = useFavorites();

  const toastFunc = (message: string) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

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
      if (condition()) {
        toastFunc(`${leagueName} is removed from favorites`);
      } else {
        toastFunc(`${leagueName} is added to favorites`);
      }
    }

    if (type.toLowerCase() === "team") {
      const teamItem = {
        id: teamId ?? 0,
        name: teamName || "N/A",
        logo: image_path || imagePlaceholders.team,
      };
      toggleFavoriteTeams(teamItem);
      if (condition()) {
        toastFunc(`${teamName} is removed from favorites`);
      } else {
        toastFunc(`${teamName} is added to favorites`);
      }
    }

    if (type.toLowerCase() === "match") {
      const matchItem = {
        id: matchId ?? 0,
        leagueId: leagueId ?? 0,
        homeTeamId: homeTeamId ?? 0,
        awayTeamId: awayTeamId ?? 0,
      };

      if (
        isLeagueFavorite(leagueId ?? 0) ||
        isTeamFavorite(homeTeamId ?? 0) ||
        isTeamFavorite(awayTeamId ?? 0)
      ) {
        if (setShowMessage && setMatchFavMessage) {
          setShowMessage(matchId ?? 0);
          const messages = [];

          if (isLeagueFavorite(leagueId ?? 0)) {
            messages.push({
              message: leagueName || "N/A",
              logo: leagueLogo || imagePlaceholders.league,
            });
          }

          if (isTeamFavorite(homeTeamId ?? 0)) {
            messages.push({
              message: homeTeamName || "N/A",
              logo: homeLogo || imagePlaceholders.team,
            });
          }

          if (isTeamFavorite(awayTeamId ?? 0)) {
            messages.push({
              message: awayTeamName || "N/A",
              logo: awayLogo || imagePlaceholders.team,
            });
          }

          setMatchFavMessage(messages);
        }
      } else {
        toggleFavoriteMatches(matchItem);
        if (condition()) {
          toastFunc(
            `${homeTeamName} vs ${awayTeamName} is removed from favorites`
          );
        } else {
          toastFunc(`${homeTeamName} vs ${awayTeamName} is added to favorites`);
        }
      }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleToggleFavorite();
  };

  return (
    <button
      className={`text-lg cursor-pointer p-1 duration-100 hover:bg-fav/10 rounded-md focus:outline outline-fav`}
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
