import { useTheme } from "../context/ThemeContext";
import { CiSun } from "react-icons/ci";
import { IoMoonOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useSearchToggle } from "../context/SearchToggleContext";
// import Search from "./Search";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { closeSearch } = useSearchToggle();
  return (
    <header
      className={`px-3 py-2 max-w-[1440px] mx-auto grid grid-cols-2 lg:grid-cols-10 gap-4 items-center`}
    >
      <h1 className="text-4xl text-accent font-bold lg:col-span-2">
        <Link to={`/`} onClick={closeSearch}>
          ParaScores
        </Link>
      </h1>
      <input
        type="search"
        name=""
        id=""
        className="col-span-5 w-[70%] justify-self-center lg:block hidden"
      />
      {/* <div className="absolute top-2 left-1/2 -translate-x-1/2">
        <Search />
      </div> */}
      <button
        onClick={toggleTheme}
        className="text-2xl cursor-pointer lg:col-span-3 justify-self-end"
      >
        {theme === "dark" ? (
          <CiSun title="light" />
        ) : (
          <IoMoonOutline title="dark" />
        )}
      </button>
    </header>
  );
};

export default Header;
