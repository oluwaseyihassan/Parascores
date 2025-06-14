import { FC } from "react";
import { Link } from "react-router-dom";
import { League, Pagination } from "../types/types";
import { useTheme } from "../context/ThemeContext";
import { RiFootballFill } from "react-icons/ri";
import { MdErrorOutline } from "react-icons/md";
import { imagePlaceholders } from "../utils/imagePlaceholders";
import FavStar from "./FavStar";

type topLeaguesProps = {
  leagues:
    | {
        data: {
          data: League[];
          pagination: Pagination;
        };
        success: boolean;
      }
    | undefined;
  loading: boolean;
  error?: boolean;
};

const TopLeagues: FC<topLeaguesProps> = ({ leagues, loading, error }) => {
  const { theme } = useTheme();
  const topLeagues = leagues?.data.data.filter(
    (league) => league.category === 1
  );
  return (
    <div>
      <h2 className="text-xl text-center text-accent font-semibold mb-4">
        Top Leagues
      </h2>
      {loading && (
        <div className="flex justify-center items-center h-24 animate-spin text-4xl text-accent">
          <RiFootballFill />
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center h-24 text-red-400">
          <MdErrorOutline className="text-4xl" />
          <p>Error loading leagues</p>
        </div>
      )}
      <div
        className={`${
          theme === "dark"
            ? "bg-dark/70 divide-dark-bg"
            : "bg-light divide-light-bg"
        } divide-y-[2px] rounded-sm text-[0.9rem]`}
      >
        {!loading &&
          topLeagues?.map((league) => (
            <div
              key={league.id}
              className={`flex items-center gap-4 py-1.5 px-2 ${
                theme === "dark"
                  ? " hover:bg-gray-600/10"
                  : "hover:bg-gray-400/10"
              }`}
            >
              <Link
                className="flex items-center gap-2 w-full"
                to={`/league/${league.name?.replace(/ +/g, "-")}/${league.id}`}
              >
                <div className="w-5 h-5 flex justify-center items-center">
                  <img
                    src={`${league.image_path || imagePlaceholders.team}`}
                    alt={`${league.name}`}
                    className="w-5"
                  />
                </div>
                <div className=" max-w-[80%] wrap-break-word">
                  {league.name}
                </div>
              </Link>
              <div className="z-10" onClick={(e) => e.stopPropagation()}>
                <FavStar
                  leagueId={league.id}
                  leagueName={league.name}
                  image_path={league.image_path || imagePlaceholders.league}
                  type="league"
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TopLeagues;
