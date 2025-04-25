import Header from "./components/Header";
import Home from "./components/pages/Home";
import { useTheme } from "./context/ThemeContext";
import { Routes, Route } from "react-router-dom";
function App() {
  const { theme } = useTheme();

  return (
    <div
      className={`${
        theme === "dark" ? "bg-dark text-white" : "bg-light text-dark-bg"
      } min-h-screen h-full `}
    >
      <div
        className={`${
          theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
        } rounded-b-md sticky top-0 z-10 shadow-md`}
      >
        <Header />
      </div>
      <section className="max-w-[1440px] mx-auto p-2 sm:p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<div>About</div>} />
          <Route path="/contact" element={<div>Contact</div>} />
         <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </section>
    </div>
  );
}

export default App;
