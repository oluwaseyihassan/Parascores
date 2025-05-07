import { FC } from "react";
import { VenueType } from "../types/types";
import { FaMapLocationDot } from "react-icons/fa6";

type Props = {
  venue: VenueType | null;
};
const Venue: FC<Props> = ({ venue }) => {
  const hasCoordinates = venue?.latitude && venue?.longitude;
  const venueDetails = [
    { label: "Venue", value: venue?.name },
    { label: "Capacity", value: venue?.capacity },
    { label: "Surface", value: venue?.surface },
    { label: "City", value: venue?.city_name },
    { label: "Address", value: venue?.address },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      <div className="col-span-1">
        <img src={`${venue?.image_path}`} alt="" />
      </div>
      <div className="flex flex-col justify-around col-span-1">
        {venueDetails.map((detail, index) => (
          <div key={index} className="flex flex-col">
            <span className="font-bold">{detail.label}:</span>
            {detail.label === "Address" && hasCoordinates ? (
              <span className="text-gray-400">
                <a
                  href={`https://www.google.com/maps?q=${venue.latitude},${venue.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-accent hover:underline py-2"
                >
                  <FaMapLocationDot />
                  <span>View on Google Maps</span>
                </a>
              </span>
            ) : null}
            <span className="text-gray-400">{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Venue;
