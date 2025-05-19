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

type FavoritesContextType = {
  favoriteLeagues: FavoriteLeague[];
  toggleFavorite: (league: FavoriteLeague) => void;
  isLeagueFavorite: (leagueId: number) => boolean;
  favoriteTeams: FavoriteLeague[];
  toggleFavoriteTeams: (team: FavoriteLeague) => void;
  isTeamFavorite: (teamId: number) => boolean;
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

  // Update localStorage whenever state changes
  useEffect(() => {
    setItem("favouritesLeagues", favoriteLeagues);
  }, [favoriteLeagues, setItem]);

  useEffect(() => {
    setItem("favouritesTeams", favoriteTeams);
  }, [favoriteTeams, setItem]);

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

  return (
    <FavoritesContext.Provider
      value={{
        favoriteLeagues,
        toggleFavorite,
        isLeagueFavorite,
        favoriteTeams,
        toggleFavoriteTeams,
        isTeamFavorite,
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
