import { useTheme } from "../context/ThemeContext";
import { CiSun } from "react-icons/ci";
import { IoMoonOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useSearchToggle } from "../context/SearchToggleContext";


const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const {closeSearch} = useSearchToggle()
  return (
    <header
      className={`px-3 py-2 max-w-[1440px] mx-auto flex justify-between items-center `}
    >
      <h1 className="text-4xl text-accent font-bold">
        <Link to={`/`} onClick={closeSearch}>ParaScores</Link></h1>
      <button onClick={toggleTheme} className="text-2xl cursor-pointer">
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
