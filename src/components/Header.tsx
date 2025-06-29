import { useTheme } from "../context/ThemeContext";
import { CiSun } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useSearchToggle } from "../context/SearchToggleContext";
import { useState } from "react";
import Settings from "./Settings";
import ClickAway from "./ClickAway";
// import Search from "./Search";

const Header = () => {
  const { theme } = useTheme();
  const { closeSearch } = useSearchToggle();
  const [toggleSettings, setToggleSettings] = useState(false);

  const handleSettingsToggle = () => {
    setToggleSettings((prev) => !prev);
  };
  return (
    <header
      className={`px-3 py-2 max-w-[1440px] mx-auto grid grid-cols-2 lg:grid-cols-10 gap-4 items-center relative`}
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
      <div className="justify-self-end lg:col-span-3">
        <button
          onClick={handleSettingsToggle}
          className="text-2xl cursor-pointer lg:col-span-3 justify-self-end"
        >
          <CiSun />
        </button>
        {toggleSettings && (
          <ClickAway onClickAway={() => setToggleSettings(false)}>
            <div
              className={`${
                theme === "dark" ? "bg-dark-bg sha" : "bg-light-bg"
              } px-3 py-4 absolute top-10 right-5 shadow-2xl rounded-lg min-w-[200px]`}
            >
              <Settings />
            </div>
          </ClickAway>
        )}
      </div>
    </header>
  );
};

export default Header;
