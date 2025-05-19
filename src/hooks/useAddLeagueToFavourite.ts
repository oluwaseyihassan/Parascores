import { useMemo, useState } from "react"
import { useLocalStorage } from "./useLocalStorage";
const useAddLeagueToFavourite = () => {
      const [favoritesVersion, setFavoritesVersion] = useState(0);
      const {getItem,setItem, } = useLocalStorage()

const toggleFavoriteLeagues = (leagueId: number, leagueName: string, leagueLogo: string) => {
    const favouriteLeagues = getItem("favouritesLeagues") || [];

    const leagueIndex = favouriteLeagues.findIndex(
      (league: { id: number }) => league.id === leagueId
    );

    if (leagueIndex !== -1) {
      const newFavs = favouriteLeagues.filter(
        (league: { id: number }) => league.id !== leagueId
      );
      setItem("favouritesLeagues", newFavs);
    } else {
      const newLeague = {
        id: leagueId,
        name: leagueName,
        logo: leagueLogo,
      };
      setItem("favouritesLeagues", [...favouriteLeagues, newLeague]);
    }

    setFavoritesVersion((prev) => prev + 1);
  };

   const favoriteLeagues = useMemo(() => {
      const leagues = getItem("favouritesLeagues");
      if (leagues) {
        return leagues.map((league: { id: number }) => league.id);
      }
      return [];
    }, [favoritesVersion]); 
  
    const isLeagueFavorite = (leagueId: number): boolean => {
      return favoriteLeagues.includes(leagueId);
    };
  

  return {
    toggleFavoriteLeagues,
    isLeagueFavorite,
    favoriteLeagues
  }
}

export default useAddLeagueToFavourite