import { FC } from "react";
import { VenueType } from "../types/types";

type Props = {
  venue: VenueType | null;
};
const Venue: FC<Props> = ({ venue }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="col-span-1">
        <img src={`${venue?.image_path}`} alt="" />
      </div>
      <div className="flex flex-col justify-around col-span-1">
        <div>
          <span>Venue:</span>
          <div>{venue?.name}</div>
        </div>
        <div>
          <span>Capacity:</span>
          <div>{venue?.capacity}</div>
        </div>
        <div>
          <span>Surface:</span>
          <div>{venue?.surface}</div>
        </div>
        <div>
          <span>City:</span>
          <div>{venue?.city_name}</div>
        </div>
        <div>
          <span>Adress:</span>
          <div>{venue?.address}</div>
        </div>
      </div>
    </div>
  );
};

export default Venue;
