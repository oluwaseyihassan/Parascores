import { useTheme } from "../../context/ThemeContext";
import FavoriteLeagues from "../FavoriteLeagues";
import FavoriteTeams from "../FavoriteTeams";

const Favorites = () => {
  const { theme } = useTheme();
  return (
    <div>
      <div className={`${theme === "dark" ? "bg-dark-bg" : "bg-light-bg"} p-3 rounded-2xl`}>
        <FavoriteLeagues />
      </div>
      <div className={`${theme === "dark" ? "bg-dark-bg" : "bg-light-bg"} p-3 rounded-2xl mt-2`}>
        <FavoriteTeams />
      </div>
    </div>
  );
};

export default Favorites;
