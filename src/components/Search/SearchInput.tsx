import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import "./SearchInput.scss";

interface ISearchInput {
  getWeatherForcastData: (address: string | null) => void;
}

const SearchInput: React.FC<ISearchInput> = ({ getWeatherForcastData }) => {
  const [address, setAddress] = useState<string | null>(null);

  console.log(address, "address");
  // const getWeatherData = () => {
  //   getWeatherForcastData(address);
  // };

  // const isValueExist = locations.some((city) => city.value.includes(address));
  return (
    <div className="weather-searchbar search-input flex-column">
      {/* <label htmlFor="weather-input">Enter your Address</label> */}
      <div className="autocomplete-container">
        <Autocomplete
          disablePortal
          // open={address.length > 1 ? true : false}
          className="address-autocomplete"
          id="combo-box-demo"
          value={address}
          freeSolo
          onInputChange={(e, value: string) => setAddress(value)}
          options={locations}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Enter your Address" />
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
