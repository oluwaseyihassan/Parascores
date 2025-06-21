import { FC, JSX, useState } from "react";
import { StandingType } from "../types/types";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { RiFootballFill, RiArrowDropUpLine } from "react-icons/ri";

type Props = {
  standing: {
    data: {
      data: StandingType[];
    };
    success: boolean;
    message?: string;
  };
  isLoading: boolean;
  isError?: boolean;
};

const Standing: FC<Props> = ({ standing, isLoading, isError }) => {
  const { theme } = useTheme();

  const [standingOption, setStandingOption] = useState<string>("All");
  const handleStandingOptionChange = (option: string) => {
    setStandingOption(option);
  };

  const OverallStandingType = [
    "OVERALL_MATCHES",
    "OVERALL_WINS",
    "OVERALL_DRAWS",
    "OVERALL_LOST",
    "TOTAL_POINTS",
    "OVERALL_SCORED",
    "OVERALL_CONCEDED",
    "OVERALL_GOAL_DIFFERENCE",
  ];
  const HomeStandingType = [
    "HOME_MATCHES",
    "HOME_WINS",
    "HOME_DRAWS",
    "HOME_LOST",
    "HOME_SCORED",
    "HOME_CONCEDED",
    "HOME_POINTS",
  ];
  const AwayStandingType = [
    "AWAY_MATCHES",
    "AWAY_WINS",
    "AWAY_DRAWS",
    "AWAY_LOST",
    "AWAY_SCORED",
    "AWAY_CONCEDED",
    "AWAY_POINTS",
  ];
  const StandingOptions = ["All", "Home", "Away"];
  const getStandingType = (option: string) => {
    switch (option) {
      case "All":
        return OverallStandingType;
      case "Home":
        return HomeStandingType;
      case "Away":
        return AwayStandingType;
      default:
        return OverallStandingType;
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24 animate-spin text-4xl text-accent">
        <RiFootballFill />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-gray-500 text-center">
        No Standings available for this league.
      </div>
    );
  }

  return (
    <div
      className={`${
        theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
      } overflow-x-auto relative p-2 rounded-lg mt-2 scroll_bar overflow-hidden`}
    >
      <div className="flex gap-2 mb-2 sticky left-0">
        {StandingOptions.map((option) => (
          <button
            key={option}
            className={`${theme === "dark" ? "bg-dark/70" : "bg-light"} ${
              standingOption === option ? "text-accent" : ""
            } text-[1.2rem] sm:text-[1.4rem] font-semibold  px-2 py-1 rounded-lg cursor-pointer`}
            onClick={() => handleStandingOptionChange(option)}
            disabled={standingOption === option}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-6 font-bold text-accent sm:text-[1.3rem]">
        <div
          className={`${
            theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
          } col-span-4 sm:col-span-3 flex sticky left-0 z-10 p-2 gap-2`}
        >
          <div className="w-[20px] h-[20px] flex justify-center items-center">
            #
          </div>
          <div className="w-[20px] h-[20px] flex justify-center items-center"></div>
          <div>Team</div>
        </div>
        <div
          className={`col-span-2 sm:col-span-3 flex justify-between min-w-fit w-full p-2 `}
        >
          <div className="min-w-[40px] flex justify-center items-center">P</div>
          <div className="min-w-[40px] flex justify-center items-center">W</div>
          <div className="min-w-[40px] flex justify-center items-center">D</div>
          <div className="min-w-[40px] flex justify-center items-center">L</div>
          <div className="min-w-[40px] flex justify-center items-center">
            Pts
          </div>
          <div className="min-w-[40px] flex justify-center items-center">
            GF
          </div>
          <div className="min-w-[40px] flex justify-center items-center">
            GA
          </div>
          {standingOption === "All" && (
            <div className="min-w-[40px] flex justify-center items-center">
              GD
            </div>
          )}
          <div className="min-w-[160px] flex justify-center items-center">
            Form
          </div>
        </div>
      </div>
      <div
        className={`${
          theme === "dark" ? "divide-dark" : "divide-light"
        } divide-y sm:text-[1.2rem] relative`}
      >
        {standing?.data.data
          .sort((a: StandingType, b: StandingType) => {
            const groupComparison = (a.group?.name || "").localeCompare(
              b.group?.name || ""
            );

            if (groupComparison === 0) {
              return a.position - b.position;
            }

            return groupComparison;
          })
          .reduce<JSX.Element[]>(
            (
              acc: JSX.Element[],
              curr: StandingType,
              index: number,
              array: StandingType[]
            ) => {
              if (
                index === 0 ||
                curr.group?.name !== array[index - 1].group?.name
              ) {
                if (curr.group?.name) {
                  acc.push(
                    <div
                      key={`group-header-${curr.group?.name || "default"}`}
                      className={`font-bold ${
                        theme === "dark" ? "bg-dark/90" : "bg-gray-200"
                      }  p-2 sticky left-0 z-20 w-full`}
                    >
                      {curr.group?.name || "Group"}
                    </div>
                  );
                }
              }

              acc.push(
                <div key={curr.id} className="grid grid-cols-6">
                  <div
                    className={`${
                      theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
                    } col-span-4 sm:col-span-3 sticky left-0 z-10 p-2 flex gap-2 items-center`}
                  >
                    <div className="w-[20px] h-[20px] flex justify-center items-center">
                      {curr.position}
                    </div>
                    <div className="w-[20px] h-[20px] flex justify-center items-center font-bold text-2xl">
                      {curr.result === "up" ? (
                        <RiArrowDropUpLine className="text-green-500" />
                      ) : curr.result === "down" ? (
                        <RiArrowDropUpLine className="text-red-500 rotate-180" />
                      ) : curr.result === "equal" ? (
                        <span className="text-gray-400">-</span>
                      ) : null}
                    </div>
                    <div className="h-5 w-5">
                      <img src={`${curr.participant.image_path}`} alt="" />
                    </div>
                    <div>{curr.participant.name}</div>
                  </div>
                  <div
                    className={`col-span-2 sm:col-span-3 flex justify-between items-center min-w-fit w-full p-2 `}
                  >
                    {getStandingType(standingOption).map((type: string) => {
                      const detail = curr.details.find(
                        (det) => det.type.developer_name === type
                      );
                      return (
                        <div
                          key={type}
                          className={`min-w-[40px] flex justify-center items-center ${
                            type === "TOTAL_POINTS" ? "font-bold" : ""
                          }`}
                        >
                          {detail?.value ?? "-"}
                        </div>
                      );
                    })}

                    <div className="min-w-[160px] flex gap-2 space-x-2 text-white ml-2">
                      {curr.form
                        .sort(
                          (a, b) => (b.sort_order ?? 0) - (a.sort_order ?? 0)
                        )
                        .slice(0, 5)
                        .map((form) => (
                          <Link
                            to={`/match/${form.fixture_id}`}
                            key={form.id}
                            className={`${
                              form.form?.toLocaleLowerCase() === "w"
                                ? "bg-accent"
                                : form.form?.toLocaleLowerCase() === "l"
                                ? "bg-red-500"
                                : "bg-gray-400"
                            } w-[18px] h-[18px] flex justify-center items-center rounded-full relative text-[0.8rem]`}
                            title={`${form.fixture.name} ${form.fixture.result_info}`}
                          >
                            {form.form}
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
              );

              return acc;
            },
            [] as JSX.Element[]
          )}
      </div>
    </div>
  );
};

export default Standing;
