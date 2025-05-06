import { Dispatch, FC, SetStateAction, useState } from "react";
import { TopScorersType, Pagination } from "../types/types";
import { useTheme } from "../context/ThemeContext";
import CustomSelect from "./CustomSelect";
import { RiFootballFill } from "react-icons/ri";

type TopScorersProps = {
  topScorers: {
    data: {
      data: TopScorersType[];
      pagination: Pagination;
    };
    success: boolean;
    message: string;
  };
  setTopScorerFilterId: Dispatch<SetStateAction<number>>;
  isLoading?: boolean;
  setTopScorerPage: Dispatch<SetStateAction<number>>;
  topScorerPage: number;
};

const TopScorers: FC<TopScorersProps> = ({
  topScorers,
  setTopScorerFilterId,
  isLoading,
  setTopScorerPage,
}) => {
  const { theme } = useTheme();

  const options = [
    { value: 208, label: "Goals" },
    { value: 209, label: "Assist" },
    { value: 84, label: "Yellow Card" },
    { value: 83, label: "Red Card" },
  ];
  const [selectedOption, setSelectedOption] = useState({
    value: 208,
    label: "Goals",
  });
  return (
    <div
      className={`${
        theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
      } rounded-lg p-4 `}
    >
      <h2 className="text-center text-2xl">Top Players</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <RiFootballFill className="text-accent text-2xl animate-spin" />
        </div>
      ) : (
        <>
          <CustomSelect
            options={options}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            setTopScorerFilterId={setTopScorerFilterId}
            setTopScorerPage={setTopScorerPage}
          />

          <div
            className={`${
              theme === "dark"
                ? "bg-dark/70 divide-dark-bg"
                : "bg-light divide-light-bg"
            } py-1 rounded-lg mt-4  divide-y`}
          >
            <div className="flex items-center justify-between gap-2 mb-2 px-3 text-sm font-semibold py-1">
              <div className="flex items-center gap-3">
                <div className="w-7">#</div>
                <div>Player</div>
              </div>
              <div>
                {selectedOption.value === 208
                  ? "Goals"
                  : selectedOption.value === 209
                  ? "Assists"
                  : "Cards"}
              </div>
            </div>
            {topScorers?.data.data.map((player) => (
              <div
                key={player.player.id}
                className="flex items-center justify-between gap-2 mb-2 px-3"
              >
                <div className="flex gap-3 items-center">
                  <div className="w-7 text-sm">{player.position}.</div>
                  <div className="h-6 w-6 rounded-full overflow-hidden">
                    <img
                      src={`${player.player.image_path}`}
                      className="h-full w-full"
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col justify-center text-sm">
                    <span>{player.player.common_name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">
                        {player.player.position.name}
                      </span>
                      <div className="h-3 w-3" title={player.participant.name}>
                        <img
                          src={`${player.participant.image_path}`}
                          alt=""
                          className="h-full w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>{player.total}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center w-full">
            <div>
              {(topScorers?.data.pagination?.current_page ?? 0) > 1 && (
                <button
                  onClick={() => {
                    setTopScorerPage((prevPage) => prevPage - 1);
                  }}
                  className="mt-2  text-sm rounded-md px-2 py-1 bg-gray-600/20 transition-all duration-200 cursor-pointer"
                  disabled={topScorers?.data.pagination?.current_page === 1}
                >
                  Previous Page
                </button>
              )}
            </div>
            <div>
              {topScorers?.data.pagination?.has_more && (
                <button
                  onClick={() => {
                    if (topScorers?.data.pagination.has_more) {
                      setTopScorerPage((prevPage) => prevPage + 1);
                    }
                  }}
                  className="mt-2  text-sm rounded-md px-2 py-1 bg-gray-600/20 transition-all duration-200 cursor-pointer"
                  disabled={!topScorers?.data.pagination.has_more}
                >
                  Next Page
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TopScorers;
