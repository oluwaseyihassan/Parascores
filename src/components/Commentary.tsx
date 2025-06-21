import { useState } from "react";
import { Comments } from "../types/types";
import { useTheme } from "../context/ThemeContext";
import { imagePlaceholders } from "../utils/imagePlaceholders";

type Props = {
  comments: Comments[] | null;
};

const Commentary = ({ comments }: Props) => {
  const { theme } = useTheme();
  const [filterComments, setFilterComments] = useState<string>("All");
  const handleFilterChange = (filter: string) => {
    setFilterComments(filter);
  };
  const filteredComments = comments?.filter((comment) => {
    if (filterComments === "All") return true;
    return comment.is_important;
  });

  if (!comments || comments.length === 0) {
    return (
      <div
        className={`p-4 ${
          theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
        } rounded-lg text-center`}
      >
        <p>No comments available</p>
      </div>
    );
  }

  return (
    <div
      className={` p-4 ${
        theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
      } rounded-lg`}
    >
      <div className="space-x-2">
        <button
          className={`${filterComments === "All" ? "" : ""} min-w-[100px]`}
          onClick={() => handleFilterChange("All")}
        >
          All
        </button>
        <button onClick={() => handleFilterChange("Goals")}>Key Events</button>
      </div>
      <div className={`space-y-2 mt-4`}>
        {filteredComments

          ?.sort(
            (a, b) =>
              (b.minute ?? 0) +
              (b.extra_minute ?? 0) -
              ((a.minute ?? 0) + (a.extra_minute ?? 0))
          )
          ?.map((comment) => (
            <div key={comment.id} className="flex space-x-4 items-center">
              <div className="min-w-[25px]">
                {(comment.minute ?? 0) + (comment.extra_minute ?? 0)}'{" "}
              </div>
              <div
                className={`${
                  theme === "dark" ? "bg-dark" : "bg-light"
                } p-2 rounded-lg w-full flex items-center justify-between space-x-2`}
              >
                <div>{comment.comment}</div>
                {comment.player && (
                  <div className="w-7 h-7 flex-shrink-0">
                    <img
                      src={`${
                        comment.player.image_path || imagePlaceholders.player
                      }`}
                      alt=""
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Commentary;
