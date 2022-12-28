import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import "./SearchInput.scss";

const SearchInput = () => {
  return (
    <div className="weather-searchbar search-input flex-column">
      {/* <label htmlFor="weather-input">Enter your Address</label> */}
      <div className="autocomplete-container">
        <Autocomplete
          disablePortal
          // open={true}
          className="address-autocomplete"
          id="combo-box-demo"
          options={locations}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Enter your Address" />
          )}
        />
      </div>

      <button type="button" className="search-button">
        Search
      </button>
    </div>
  );
};

const locations = [
  {
    label: "San Angelo TX",
    value: "(San Angelo TX)31.446,-100.452",
  },
  {
    label: "Albany TX",
    value: "(Albany TX)32.7234,-99.2963",
  },
  {
    label: "Brady TX",
    value: "(Brady TX)31.1348,-99.3365",
  },
  {
    label: "Coleman TX",
    value: "(Coleman TX)31.8272,-99.4268",
  },
  {
    label: "Brownwood TX",
    value: "(Brownwood TX)31.8272,-99.4268",
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
