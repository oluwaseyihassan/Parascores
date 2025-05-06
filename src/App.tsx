import { useEffect } from "react";
import Header from "./components/Header";
import Home from "./components/pages/Home";
import { useTheme } from "./context/ThemeContext";
import { Routes, Route } from "react-router-dom";
import Fixture from "./components/pages/Fixture";
import League from "./components/pages/League";
function App() {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.style.backgroundColor =
      theme === "dark" ? "#020300 " : "#ebecef ";
    document.body.style.backgroundColor =
      theme === "dark" ? "#020300 " : "#ebecef ";
  }, [theme]);

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
      <section className="max-w-[1440px] mx-auto lg:p-2 sm:p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/match/:id" element={<Fixture />} />
          <Route path="/league/:league_name/:id" element={<League />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </section>
    </div>
  );
}

export default App;
