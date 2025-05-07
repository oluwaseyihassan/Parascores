import { FC } from "react";
import { Link } from "react-router-dom";
import { League, Pagination } from "../types/types";
import { useTheme } from "../context/ThemeContext";
import { RiFootballFill } from "react-icons/ri";
import { MdErrorOutline } from "react-icons/md";

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
  console.log(leagues);
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
        } divide-y-[2px] rounded-lg text-[14px]`}
      >
        {!loading &&
          topLeagues?.map((league) => (
            <Link
              to={`/league/${league.name.replace(/ +/g, "-")}/${league.id}`}
              key={league.id}
              className={`flex items-center gap-4 py-1.5 px-2`}
            >
              <div className="w-5 h-5 flex justify-center items-center">
                <img
                  src={`${
                    league.id === 2 && theme === "dark"
                      ? "https://img.sofascore.com/api/v1/unique-tournament/7/image/dark"
                      : league.image_path
                  }`}
                  alt={`${league.name}`}
                  className="w-5"
                />
              </div>
              <div className=" max-w-[80%] wrap-break-word">{league.name}</div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default TopLeagues;
