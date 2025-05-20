import { useSearchToggle } from "../context/SearchToggleContext";
import FavoriteLeagues from "./FavoriteLeagues";
import { IoArrowBack } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { useTheme } from "../context/ThemeContext";
import { useRef } from "react";

const Search = () => {
  const { closeSearch } = useSearchToggle();
  const { theme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`${
        theme === "dark" ? "bg-dark" : "bg-light"
      } flex flex-col h-screen`}
    >
      <div
        className={` px-4 py-3 flex items-center gap-3 sticky top-0 z-10 border-b `}
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
            type="text"
            placeholder="Search teams, leagues, players..."
            className={`w-full py-2 pl-10 pr-4 rounded-full ${
              theme === "dark"
                ? "bg-dark placeholder-gray-500 text-white"
                : "bg-gray-100 placeholder-gray-500 text-gray-800"
            } outline-none focus:ring-2 focus:ring-accent`}
            autoFocus
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          <FavoriteLeagues />
          <FavoriteLeagues />
          <FavoriteLeagues />
          <FavoriteLeagues />
          <FavoriteLeagues />
          <FavoriteLeagues />
        </div>
      </div>
    </div>
  );
};

export default Search;
