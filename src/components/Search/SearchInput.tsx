import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import "./SearchInput.scss";

interface ISearchInput {
  getWeatherForcastData: (address: string | null) => void;
}

let addressAutoComplete: any = null;
let addressInput: any = null;

const SearchInput: React.FC<ISearchInput> = ({ getWeatherForcastData }) => {
  const [address, setAddress] = useState<string | null>(null);

  console.log(address, "address");
  // const getWeatherData = () => {
  //   getWeatherForcastData(address);
  // };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `${process.env.REACT_APP_GEO_LOCATION_SERVICE_API_ENDPOINT}/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.id = "google-maps-script";

    document.body.appendChild(script);

    script.addEventListener("load", (event) => {
      const center = { lat: 50.064192, lng: -130.605469 };
      // Create a bounding box with sides ~10km away from the center point
      addressInput = document.getElementById("address-input");

      const options = {
        // bounds: defaultBounds,
        // componentRestrictions: { country: "us" },
        fields: [
          // "address_components",
          "geometry",
          "icon",
          "name",
          "formatted_address",
        ],
        strictBounds: false,
        types: ["establishment"],
      };

      addressAutoComplete = new window.google.maps.places.Autocomplete(
        addressInput,
        options
      );

      window.google.maps.event.addListener(
        addressAutoComplete,
        "place_changed",
        () => {
          const place = addressAutoComplete.getPlace();

          if (!place.geometry || !place.geometry.location) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            return;
          }

          setAddress(place?.formatted_address ?? "");
        }
      );
    });
  }, []);

  return (
    <div className="weather-searchbar search-input flex-column">
      {/* <label htmlFor="weather-input">Enter your Address</label> */}
      <input type="text" id="address-input" placeholder="Enter your address" />
      <p className="or-seperator">OR</p>
      <div className="autocomplete-container">
        <Autocomplete
          disablePortal
          // open={address.length > 1 ? true : false}
          className="address-autocomplete"
          value={address}
          freeSolo
          onInputChange={(e, value: string) => setAddress(value)}
          options={locations}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Select from popular locations" />
          )}
        />
      </div>

      <button
        type="button"
        className="search-button"
        onClick={() => {
          getWeatherForcastData(address);
        }}
      >
        Search
      </button>
    </div>
  );
};

const locations = [
  {
    label: "San Angelo TX",
    value: "San Angelo TX",
  },
  {
    label: "Albany TX",
    value: "Albany TX",
  },
  {
    label: "Brady TX",
    value: "Brady TX",
  },
  {
    label: "Coleman TX",
    value: "Coleman TX",
  },
  {
    label: "Brownwood TX",
    value: "Brownwood TX",
  },
  {
    label: "an Angelo TX",
    value: "San Angelo TX",
  },
  {
    label: "Abilene, TX",
    value: "Abilene, TX",
  },
  {
    label: "Albany, TX",
    value: "Albany, TX",
  },
  {
    label: "Anson, TX",
    value: "Anson, TX",
  },
  {
    label: "Ballinger, TX",
    value: "Ballinger, TX",
  },
  {
    label: "Brady, TX",
    value: "Brady, TX",
  },
  {
    label: "Brownwood, TX",
    value: "Brownwood, TX",
  },
  {
    label: "Christoval, TX",
    value: "Christoval, TX",
  },
  {
    label: "Clyde, TX",
    value: "Clyde, TX",
  },
  {
    label: "Coleman, TX",
    value: "Coleman, TX",
  },
  {
    label: "Eden, TX",
    value: "Eden, TX",
  },
  {
    label: "Eldorado, TX",
    value: "Eldorado, TX",
  },
  {
    label: "Junction, TX",
    value: "Junction, TX",
  },
  {
    label: "Mason, TX",
    value: "Mason, TX",
  },
  {
    label: "Menard, TX",
    value: "Menard, TX",
  },
  {
    label: "Mertzon, TX",
    value: "Mertzon, TX",
  },
  {
    label: "Ozona, TX",
    value: "Ozona, TX",
  },
];

export default SearchInput;
