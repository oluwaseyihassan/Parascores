import { useEffect } from "react";
import Header from "./components/Header";
import Home from "./components/pages/Home";
import { useTheme } from "./context/ThemeContext";
import { Routes, Route } from "react-router-dom";
import Fixture from "./components/pages/Fixture";
import League from "./components/pages/League";
import { inject } from "@vercel/analytics";
import Team from "./components/pages/Team";
import BottomNavBar from "./components/BottomNavBar";
import Favorites from "./components/pages/Favorites";
import Search from "./components/Search";
import { useSearchToggle } from "./context/SearchToggleContext";

inject();
function App() {
  const { theme } = useTheme();
  const { isSearchOpen } = useSearchToggle();

  useEffect(() => {
    document.documentElement.style.backgroundColor =
      theme === "dark" ? "#020300 " : "#ebecef ";
    document.body.style.backgroundColor =
      theme === "dark" ? "#020300 " : "#ebecef ";

    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [theme, isSearchOpen]);

  return (
    <div
      className={`${
        theme === "dark" ? "bg-dark text-white" : "bg-light text-dark-bg"
      } min-h-screen h-full `}
    >
      <div
        className={`${
          theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
        } rounded-b-md sticky top-0 z-[1000] shadow-md`}
      >
        <Header />
      </div>

      <section className="max-w-[1440px] mx-auto lg:p-2 sm:p-4 p-2">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/match/:id" element={<Fixture />} />
          <Route path="/league/:league_name/:id" element={<League />} />
          <Route path="/team/:team_name/:id" element={<Team />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </section>
      {isSearchOpen && (
        <section className="h-full fixed w-full lg:hidden inset-0 top-16 z-[99]">
          <Search />
        </section>
      )}
      <footer
        className={` flex flex-col items-center gap-1 text-xs mb-20`}
      ></footer>

      <div className="fixed bottom-0 left-0 w-full z-[100] block lg:hidden">
        <div
          className={`${
            theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
          } rounded-t-md shadow-md px-3 min-h-[30px] h-fit py-2`}
        >
          {/* <BottomNavBar /> */}
          <BottomNavBar />
        </div>
      </div>
    </div>
  );
}

export default App;
