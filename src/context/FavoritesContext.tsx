// src/context/FavoritesContext.tsx
import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type FavoriteLeague = {
  id: number;
  name?: string;
  logo?: string;
};
type FavoriteMatch = {
  id: number;
  leagueId: number;
  homeTeamId: number;
  awayTeamId: number;
};

type FavoritesContextType = {
  favoriteLeagues: FavoriteLeague[];
  toggleFavorite: (league: FavoriteLeague) => void;
  isLeagueFavorite: (leagueId: number) => boolean;
  favoriteTeams: FavoriteLeague[];
  toggleFavoriteTeams: (team: FavoriteLeague) => void;
  isTeamFavorite: (teamId: number) => boolean;
  favoriteMatches: FavoriteMatch[];
  toggleFavoriteMatches: (match: FavoriteMatch) => void;
  isMatchFavorite: (matchId: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { getItem, setItem } = useLocalStorage();
  const [favoriteLeagues, setFavoriteLeagues] = useState<FavoriteLeague[]>(
    () => {
      return getItem("favouritesLeagues") || [];
    }
  );
  const [favoriteTeams, setFavoriteTeams] = useState<FavoriteLeague[]>(() => {
    return getItem("favouritesTeams") || [];
  });
  const [favoriteMatches, setFavoriteMatches] = useState<FavoriteMatch[]>(
    () => {
      return getItem("favouritesMatches") || [];
    }
  );

  // Update localStorage whenever state changes
  useEffect(() => {
    setItem("favouritesLeagues", favoriteLeagues);
  }, [favoriteLeagues, setItem]);

  useEffect(() => {
    setItem("favouritesTeams", favoriteTeams);
  }, [favoriteTeams, setItem]);
  
  useEffect(() => {
    setItem("favouritesMatches", favoriteMatches);
  }, [favoriteMatches, setItem]);

  const toggleFavorite = (league: FavoriteLeague) => {
    setFavoriteLeagues((prevLeagues) => {
      const isAlreadyFavorite = prevLeagues.some(
        (item) => item.id === league.id
      );

      if (isAlreadyFavorite) {
        return prevLeagues.filter((item) => item.id !== league.id);
      } else {
        return [...prevLeagues, league];
      }
    });
  };

  const toggleFavoriteTeams = (team: FavoriteLeague) => {
    setFavoriteTeams((prevTeams) => {
      const isAlreadyFavorite = prevTeams.some((item) => item.id === team.id);

      if (isAlreadyFavorite) {
        return prevTeams.filter((item) => item.id !== team.id);
      } else {
        return [...prevTeams, team];
      }
    });
  };

  const isLeagueFavorite = (leagueId: number) => {
    return favoriteLeagues.some((league) => league.id === leagueId);
  };

  const isTeamFavorite = (teamId: number) => {
    return favoriteTeams.some((team) => team.id === teamId);
  };

  const toggleFavoriteMatches = (match: FavoriteMatch) => {
    setFavoriteMatches((prevMatches) => {
      const isAlreadyFavorite = prevMatches.some(
        (item) => item.id === match.id
      );

      if (isAlreadyFavorite) {
        return prevMatches.filter((item) => item.id !== match.id);
      } else {
        return [...prevMatches, match];
      }
    });
  };

  const isMatchFavorite = (matchId: number) => {
    return favoriteMatches.some((match) => match.id === matchId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteLeagues,
        toggleFavorite,
        isLeagueFavorite,
        favoriteTeams,
        toggleFavoriteTeams,
        isTeamFavorite,
        favoriteMatches,
        toggleFavoriteMatches,
        isMatchFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
