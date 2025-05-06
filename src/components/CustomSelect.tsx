import { Dispatch, FC, SetStateAction, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { IoIosArrowDown } from "react-icons/io";
import useAnimationCleanup from "../hooks/useAnimationCleanup";

type CustomSelectProps = {
  options: {
    label: string;
    value: number;
  }[];
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
};

const CustomSelect: FC<CustomSelectProps> = ({
  options,
  selectedOption,
  setSelectedOption,
  setTopScorerFilterId,
  setTopScorerPage,
}) => {
  const { theme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const { isVisible } = useAnimationCleanup(isOpen, 300);

  const handleClick = (value: number) => {
    setIsOpen(false);
    setSelectedOption({
      label: options.find((option) => option.value === value)?.label ?? "",
      value: value,
    });
    if (setTopScorerFilterId) {
      setTopScorerFilterId(value);
    }
    if (setTopScorerPage) {
      setTopScorerPage(1);
    }
  };

  return (
    <div className="relative w-[150px]">
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
          } px-2 py-1 rounded-lg w-full absolute flex flex-col gap-2 top-[35px]`}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={`cursor-pointer ${
                selectedOption.value === option.value ? "font-bold" : ""
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
  );
};

export default CustomSelect;
