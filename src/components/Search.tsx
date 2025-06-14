import { useSearchToggle } from "../context/SearchToggleContext";
import { IoArrowBack } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { useTheme } from "../context/ThemeContext";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getLeaguesBySearch,
  getPlayersBySearch,
  getTeamsBySearch,
} from "../api/queries";
import useDebounce from "../hooks/useDebounce.ts";
import { League, Pagination, TeamType } from "../types/types.ts";
import { imagePlaceholders } from "../utils/imagePlaceholders.ts";
import { Link } from "react-router-dom";
import { RiFootballFill } from "react-icons/ri";
import FavStar from "./FavStar.tsx";

type LeaguesApiResponse = {
  data: {
    data: League[];
    pagination: Pagination;
  };
  success: boolean;
  message: string;
};

type PlayersApiResponse = {
  data: {
    data: {
      id: number;
      common_name: string | null;
      image_path: string | null;
      gender: string | null;
      firstname: string | null;
      lastname: string | null;
      display_name: string | null;
    }[];
    pagination: Pagination;
  };
  success: boolean;
  message: string;
};

type TeamsApiResponse = {
  data: {
    data: TeamType[];
    pagination: Pagination;
  };
  success: boolean;
  message: string;
};

const Search = () => {
  const { closeSearch } = useSearchToggle();
  const { theme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchType, setSearchType] = useState<string>("teams");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: leagues, isLoading: leaguesIsLoading } =
    useQuery<LeaguesApiResponse>({
      queryKey: ["searchLeagues", debouncedSearchTerm],
      queryFn: () => {
        const searchParam = debouncedSearchTerm || "";
        return getLeaguesBySearch(searchParam, 1, 10, "country", "");
      },
      enabled: debouncedSearchTerm.length > 1 && searchType === "leagues",
      refetchOnWindowFocus: false,
    });

  const { data: players, isLoading: playersIsLoading } =
    useQuery<PlayersApiResponse>({
      queryKey: ["searchPlayers", debouncedSearchTerm],
      queryFn: () => {
        const searchParam = debouncedSearchTerm || "";
        return getPlayersBySearch(searchParam, 1, 10, "", "");
      },
      enabled: debouncedSearchTerm.length > 1 && searchType === "players",
      refetchOnWindowFocus: false,
    });

  const { data: teams, isLoading: teamIsLoading } = useQuery<TeamsApiResponse>({
    queryKey: ["searchTeams", debouncedSearchTerm],
    queryFn: () => {
      const searchParam = debouncedSearchTerm || "";
      return getTeamsBySearch(searchParam, 1, 10, "country", "");
    },
    enabled: debouncedSearchTerm.length > 1 && searchType === "teams",
    refetchOnWindowFocus: false,
  });

  const searchTypes = ["teams", "leagues", "players"];

  return (
    <div
      className={`${
        theme === "dark" ? "bg-dark" : "bg-light"
      } flex flex-col h-screen`}
    >
      <div
        className={` px-4 py-3 flex items-center gap-3 sticky top-0 z-10 ${
          theme === "dark"
            ? "bg-dark-bg border-b border-gray-700"
            : "bg-light-bg border-b border-gray-200"
        } `}
      >
        <button
          onClick={closeSearch}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Go back"
        >
          <IoArrowBack className="text-xl" />
        </button>

        <div className="relative flex-grow">
          <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            ref={inputRef}
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            type="text"
            placeholder="Search teams, leagues, players..."
            className={`w-full py-2 pl-10 pr-4 rounded-md ${
              theme === "dark"
                ? "bg-dark placeholder-gray-500 text-white"
                : "bg-gray-100 placeholder-gray-500 text-gray-800"
            } outline-none focus:ring-2 focus:ring-accent`}
            autoFocus
          />
        </div>
      </div>
      <div>
        <div className="flex justify-center items-center gap-4 py-2">
          {searchTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSearchType(type)}
              className={`px-4 py-2 rounded-md cursor-pointer ${
                searchType === type
                  ? "bg-accent text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`${
          theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
        } overflow-y-auto p-4 max-h-[70vh] `}
      >
        {searchType === "teams" && teams ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Teams</h2>
            {teamIsLoading ? (
              <div className="flex justify-center items-center h-20">
                <RiFootballFill className="animate-spin text-4xl text-accent" />
              </div>
            ) : (
              teams.data?.data?.map((team) => (
                <Link
                  to={`/team/${team.name}/${team.id}`}
                  key={team.id}
                  className="mb-4 flex items-center justify-between"
                  onClick={(e) => {
                    closeSearch();
                    e.stopPropagation();
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-12">
                      <img
                        src={`${team.image_path || imagePlaceholders.team}`}
                        alt=""
                      />
                    </div>
                    <div>
                      <p>{team.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-2 h-6 w-6 rounded-full overflow-hidden">
                          <img
                            src={`${
                              team.country?.image_path || imagePlaceholders.team
                            }`}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-sm text-gray-500">
                          {team.country?.name || "Unknown Country"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <FavStar
                    teamId={team.id ?? 0}
                    teamName={team.name || ""}
                    image_path={team.image_path || imagePlaceholders.team}
                    type="team"
                  />
                </Link>
              ))
            )}
          </div>
        ) : searchType === "leagues" && leagues ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Leagues</h2>
            {leaguesIsLoading ? (
              <div className="flex justify-center items-center h-20">
                <RiFootballFill className="animate-spin text-4xl text-accent" />
              </div>
            ) : (
              leagues.data?.data?.map((league) => (
                <Link
                  to={`/league/${league.name?.replace(/ +/g, "-")}/${
                    league.id
                  }`}
                  key={league.id}
                  className="mb-4 flex items-center justify-between"
                  onClick={(e) => {
                    closeSearch();
                    e.stopPropagation();
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-12">
                      <img
                        src={`${league.image_path || imagePlaceholders.league}`}
                        alt=""
                      />
                    </div>
                    <p>{league.name}</p>
                  </div>
                  <FavStar
                    leagueId={league.id ?? 0}
                    leagueName={league.name || ""}
                    image_path={league.image_path || imagePlaceholders.league}
                    type="league"
                  />
                </Link>
              ))
            )}
          </div>
        ) : searchType === "players" && players ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Players</h2>
            {playersIsLoading ? (
              <div className="flex justify-center items-center h-20">
                <RiFootballFill className="animate-spin text-4xl text-accent" />
              </div>
            ) : (
              players.data?.data?.map((player) => (
                <div
                  key={player.id}
                  className="mb-2"
                  onClick={(e) => {
                    closeSearch();
                    e.stopPropagation();
                  }}
                >
                  <div className="flex items-center gap-2 h-12 w-12 rounded-full overflow-hidden">
                    <img
                      src={`${player.image_path || imagePlaceholders.player}`}
                      alt=""
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  </div>
                  <p>{player.display_name}</p>
                </div>
              ))
            )}
          </div>
        ) : (
          <p className="text-gray-500">
            {debouncedSearchTerm.length > 1
              ? "No results found."
              : debouncedSearchTerm.length === 0
              ? "Start typing to search..."
              : "Please enter at least 2 characters to search."}
          </p>
        )}
      </div>
    </div>
  );
};

export default Search;
