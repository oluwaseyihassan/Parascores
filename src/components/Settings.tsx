import { useTheme } from "../context/ThemeContext";

const Settings = () => {
  const { themeValue, setThemeValue, setThemeFromUserInput } = useTheme();
  console.log(window.matchMedia("(prefers-color-scheme: light)").matches);

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = e.target.value;
    setThemeValue?.(newTheme);
    setThemeFromUserInput?.(newTheme);
  };
  return (
    <div className="">
      <div>
        <h4 className="mb-3">Theme</h4>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2 w-full hover:bg-gray-400/5 px-2 rounded-lg cursor-pointer">
            <input
              type="radio"
              name="system"
              id="system"
              onChange={handleThemeChange}
              value="system"
              checked={themeValue === "system"}
              className="cursor-pointer appearance-none h-4 w-4 border-2 border-accent rounded-full checked:bg-accent checked:border-accent "
            />
            <label className="w-full cursor-pointer py-2" htmlFor="system">
              System
            </label>
          </div>
          <div className="flex items-center space-x-2 w-full hover:bg-gray-400/5 px-2 rounded-lg cursor-pointer">
            <input
              type="radio"
              name="light"
              id="light"
              onChange={handleThemeChange}
              value="light"
              checked={themeValue === "light"}
              className="cursor-pointer appearance-none h-4 w-4 border-2 border-accent rounded-full checked:bg-accent checked:border-accent "
            />
            <label className="w-full cursor-pointer py-2" htmlFor="light">
              Light
            </label>
          </div>
          <div className="flex items-center space-x-2 w-full hover:bg-gray-400/5 px-2 rounded-lg cursor-pointer">
            <input
              type="radio"
              name="dark"
              id="dark"
              onChange={handleThemeChange}
              value="dark"
              checked={themeValue === "dark"}
              className="cursor-pointer appearance-none h-4 w-4 border-2 border-accent rounded-full checked:bg-accent checked:border-accent "
            />
            <label className="w-full cursor-pointer py-2" htmlFor="dark">
              Dark
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
