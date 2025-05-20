import { FaRegClock, FaClock, FaRegStar, FaStar } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useSearchToggle } from "../context/SearchToggleContext";

const BottomNavBar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const { openSearch, closeSearch, isSearchOpen } = useSearchToggle();

  const isActive = (path: string) => {
    if (!isSearchOpen && path === "/" && pathname === "/") return true;
    if (!isSearchOpen && path !== "/" && pathname.startsWith(path)) return true;

    return false;
  };

  return (
    <div className="flex justify-around items-center h-full">
      <Link
        to="/"
        className={`flex justify-center items-center cursor-pointer flex-1 h-full  ${
          isActive("/") ? "text-accent" : ""
        }`}
        onClick={() => {
          closeSearch();
        }}
      >
        <div
          className={`border-b border-solid w-1/2 flex flex-col items-center ${
            isActive("/") ? "border-accent" : "border-transparent"
          }`}
        >
          {isActive("/") ? <FaClock className="text-accent" /> : <FaRegClock />}
          <span className="text-xs mt-1">Matches</span>
        </div>
      </Link>

      <div
        className={`flex items-center justify-center cursor-pointer flex-1 h-full ${
          isSearchOpen ? "text-accent" : ""
        }`}
        onClick={() => {
          openSearch();
        }}
      >
        <div
          className={`border-b border-solid w-1/2 flex flex-col items-center ${
            isSearchOpen ? "border-accent" : "border-transparent"
          }`}
        >
          <IoMdSearch className={isSearchOpen ? "text-accent" : ""} />
          <span className="text-xs mt-1">Search</span>
        </div>
      </div>

      <Link
        to="/favorites"
        className={`flex items-center justify-center cursor-pointer flex-1 h-full ${
          isActive("/favorites") ? "text-accent" : ""
        }`}
        onClick={() => {
          closeSearch();
        }}
      >
        <div
          className={`border-b border-solid w-1/2 flex flex-col items-center ${
            isActive("/favorites") ? "border-accent" : "border-transparent"
          }`}
        >
          {isActive("/favorites") ? (
            <FaStar className="text-accent" />
          ) : (
            <FaRegStar />
          )}
          <span className="text-xs mt-1">Favorites</span>
        </div>
      </Link>

      <Link
        to="/profile"
        className={`flex items-center justify-center cursor-pointer flex-1 h-full ${
          isActive("/profile") ? "text-accent" : ""
        }`}
        onClick={() => {
          closeSearch();
        }}
      >
        <div
          className={`border-b border-solid w-1/2 flex flex-col items-center ${
            isActive("/profile") ? "border-accent" : "border-transparent"
          }`}
        >
          <FaUserCircle className={isActive("/profile") ? "text-accent" : ""} />
          <span className="text-xs mt-1">Profile</span>
        </div>
      </Link>
    </div>
  );
};

export default BottomNavBar;
