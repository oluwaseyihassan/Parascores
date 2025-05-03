import { FC } from "react";
import { Today, StandingType } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { getStandinsBySeasonId } from "../api/queries";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

type Props = {
  fixture: Today | null;
};

type ApiResponse = {
  data: {
    data: StandingType[];
  };
  success: boolean;
};

const Standing: FC<Props> = ({ fixture }) => {
  const { theme } = useTheme();
  const seasonId = fixture?.season_id;
  const { data } = useQuery<ApiResponse>({
    queryKey: ["standing", seasonId],
    queryFn: async () => {
      if (seasonId === undefined || seasonId === null) {
        throw new Error("seasonId is undefined or null");
      }
      return getStandinsBySeasonId(
        seasonId,
        "participant;group;stage;details.type;rule.type;form.fixture",
        ""
      );
    },
    enabled: !!seasonId,
  });
  console.log(data);
  return (
    <div
      className={`${
        theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
      } overflow-x-auto relative p-2 rounded-lg`}
    >
      <div className="grid grid-cols-6 font-bold text-accent">
        <div
          className={`${
            theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
          } col-span-3 flex sticky left-0 z-10 p-2 gap-2`}
        >
          <div className="w-[20px] h-[20px] flex justify-center items-center">
            #
          </div>
          <div className="w-[20px] h-[20px] flex justify-center items-center"></div>
          <div>Team</div>
        </div>
        <div className="col-span-3 flex justify-between min-w-fit w-full p-2">
          <div className="min-w-[40px] flex justify-center items-center">P</div>
          <div className="min-w-[40px] flex justify-center items-center">W</div>
          <div className="min-w-[40px] flex justify-center items-center">D</div>
          <div className="min-w-[40px] flex justify-center items-center">L</div>
          <div className="min-w-[40px] flex justify-center items-center">GF</div>
          <div className="min-w-[40px] flex justify-center items-center">GA</div>
          <div className="min-w-[40px] flex justify-center items-center">GD</div>
          <div className="min-w-[40px] flex justify-center items-center">Pts</div>
          <div className="min-w-[160px] flex justify-center items-center">Form</div>
        </div>
      </div>
      <div className={`${theme === "dark" ? "divide-accent" : "divide-light"}`}>
        {data?.data.data.map((standing) => (
          <div key={standing.id} className="grid grid-cols-6 text-sm">
            <div
              className={`${
                theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
              } col-span-3 sticky left-0 z-10 p-2 flex gap-2 items-center`}
            >
              <div className="w-[20px] h-[20px] flex justify-center items-center">
                {standing.position}
              </div>
              <div className="w-[20px] h-[20px] flex justify-center items-center">
                {standing.result === "up" ? (
                  <span className="text-green-500">↑</span>
                ) : standing.result === "down" ? (
                  <span className="text-red-500">↓</span>
                ) : standing.result === "equal" ? (
                  <span className="text-gray-400">→</span>
                ) : null}
              </div>
              <div>{standing.participant.name}</div>
            </div>
            <div className="col-span-3 flex justify-between  min-w-fit w-full p-2">
              <div className="min-w-[40px] flex justify-center items-center">
                {standing.details.find(
                  (det) => det.type.developer_name === "OVERALL_MATCHES"
                )?.value || "-"}
              </div>
              <div className="min-w-[40px] flex justify-center items-center">
                {standing.details.find(
                  (det) => det.type.developer_name === "OVERALL_WINS"
                )?.value || "-"}
              </div>
              <div className="min-w-[40px] flex justify-center items-center">
                {standing.details.find(
                  (det) => det.type.developer_name === "OVERALL_DRAWS"
                )?.value || "-"}
              </div>
              <div className="min-w-[40px] flex justify-center items-center">
                {standing.details.find(
                  (det) => det.type.developer_name === "OVERALL_LOST"
                )?.value || "-"}
              </div>
              <div className="min-w-[40px] flex justify-center items-center">
                {standing.details.find(
                  (det) => det.type.developer_name === "OVERALL_SCORED"
                )?.value || "-"}
              </div>
              <div className="min-w-[40px] flex justify-center items-center">
                {standing.details.find(
                  (det) => det.type.developer_name === "OVERALL_CONCEDED"
                )?.value || "-"}
              </div>
              <div className="min-w-[40px] flex justify-center items-center">
                {standing.details.find(
                  (det) => det.type.developer_name === "OVERALL_GOAL_DIFFERENCE"
                )?.value || "-"}
              </div>
              <div className="min-w-[40px] flex justify-center items-center">
                {standing.details.find(
                  (det) => det.type.developer_name === "TOTAL_POINTS"
                )?.value || "-"}
              </div>
              <div className="min-w-[160px] flex gap-2 justify-between text-white text-[10px]">
                {standing.form
                  .sort((a, b) => (b.sort_order ?? 0) - (a.sort_order ?? 0))
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
                      } w-[18px] h-[18px] flex justify-center items-center rounded-full relative `}
                      title={`${form.fixture.name} ${form.fixture.result_info}`}
                    >
                      {form.form}
                      <span className="absolute bottom-0 hidden tooltip">
                        {form.fixture.name}
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Standing;
