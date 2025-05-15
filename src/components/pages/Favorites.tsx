import { useQueries } from "@tanstack/react-query";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { getLeagueById } from "../../api/queries";

const Favorites = () => {
  const { getItem } = useLocalStorage();
  const leagueIds: number[] = getItem("favouritesLeagues")?.map(
    (league: { id: number }) => league.id
  );
  console.log(leagueIds);

  const queries = useQueries({
    queries: leagueIds.map((id) => ({
      queryKey: ["league", id],
      queryFn: () => getLeagueById(id, "", ""),
      enabled: !!id,
    })),
  });
  console.log(queries.map((query) => query.data));
  return <div>Favorites</div>;
};

export default Favorites;
