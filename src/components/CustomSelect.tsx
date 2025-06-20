import { Dispatch, FC, SetStateAction, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { IoIosArrowDown } from "react-icons/io";
import useAnimationCleanup from "../hooks/useAnimationCleanup";
import ClickAway from "./ClickAway";

type CustomSelectProps = {
  options:
    | {
        label: string;
        value: number;
      }[]
    | undefined;
  selectedOption: {
    label: string;
    value: number;
  };
  setSelectedOption: Dispatch<
    SetStateAction<{
      label: string;
      value: number;
    }>
  >;
  setTopScorerFilterId?: Dispatch<SetStateAction<number>>;
  setTopScorerPage?: Dispatch<SetStateAction<number>>;
  setSeasonId?: Dispatch<SetStateAction<number | undefined>>;
};

const CustomSelect: FC<CustomSelectProps> = ({
  options,
  selectedOption,
  setSelectedOption,
  setTopScorerFilterId,
  setTopScorerPage,
  setSeasonId,
}) => {
  const { theme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const { isVisible } = useAnimationCleanup(isOpen, 300);

  const handleClick = (value: number) => {
    setIsOpen(false);
    setSelectedOption({
      label: options?.find((option) => option.value === value)?.label ?? "",
      value: value,
    });
    if (setTopScorerFilterId) {
      setTopScorerFilterId(value);
    }
    if (setTopScorerPage) {
      setTopScorerPage(1);
    }
    if (setSeasonId) {
      setSeasonId(value);
    }
  };

  return (
    <ClickAway onClickAway={() => setIsOpen(false)}>
      <div className="relative w-full ">
        <button
          className={`${
            theme === "dark" ? "bg-dark/70" : "bg-light"
          } w-full px-3 rounded-full py-1 cursor-pointer flex justify-between items-center`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedOption.label}</span>
          <IoIosArrowDown
            className={`${isOpen ? "rotate-180" : ""} transition duration-500`}
          />
        </button>
        {isVisible && (
          <div
            className={`${theme === "dark" ? "bg-dark" : "bg-light"} ${
              isOpen
                ? "animate-dropdown opacity-100"
                : "animate-dropdown-reverse opacity-0 pointer-events-none"
            } py-1 rounded-lg w-full absolute flex flex-col top-[35px] overflow-y-scroll h-fit max-h-[500px] z-30 scroll_bar`}
          >
            {options
              ?.sort((a, b) => b.label.localeCompare(a.label))
              .map((option) => (
                <div
                  key={option.value}
                  className={`cursor-pointer px-3 py-1 ${
                    theme === "dark"
                      ? "hover:bg-dark-bg/80"
                      : "hover:bg-light-bg/80"
                  } ${
                    selectedOption.value === option.value
                      ? "font-bold bg-gray-600/20"
                      : ""
                  }`}
                  onClick={() => handleClick(+option.value)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleClick(+option.value);
                    }
                  }}
                >
                  {option.label}
                </div>
              ))}
          </div>
        )}
      </div>
    </ClickAway>
  );
};

export default CustomSelect;
