import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import ForcastChart from "./ForcastChart";
import moment from "moment";
import { IWeatherForcastResponse, IForcastData } from "../../@types/api";
import WeatherCard from "../../components/Cards/WeatherCard";
import SearchInput from "../../components/Search/SearchInput";
import { GeoCodingApi } from "../../utils/api/GeoCodingApi";
import { WeatherForcastApi } from "../../utils/api/WeatherForcastApi";
import { ResponseCodes } from "../../utils/enums";

import "./scss/WeatherStatistics.scss";

const convertTemperatureFahrenheitToCelsius = (temp: string) => {
  const temperatureInCelcius = ((+temp - 32) * 5) / 9;
  return parseInt(temperatureInCelcius.toString()).toString();
};

const WeatherStatistics = () => {
  const [state, setState] = useState({
    data: {} as IWeatherForcastResponse,
    forcastData: [] as IForcastData[],
    isLoading: false,
    fetchingCoords: false,
    coords: {
      lat: 0,
      lon: 0,
    },
    tempUnit: "celcius",
    error: "",
    forcastRequestError: {
      errorCode: "",
      message: "",
    },
    defaultAddress: "Los Angeles",
  });

  const getCoordinates = async () => {
    setState({
      ...state,
      fetchingCoords: true,
      isLoading: true,
    });
    if (!navigator.geolocation) {
      setState({
        ...state,
        error: "Geolocation is not supported by this browser.",
        isLoading: false,
      });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          ...state,
          fetchingCoords: false,
          isLoading: false,
          coords: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
        });
      },
      (err) => {
        setState({
          ...state,
          fetchingCoords: false,
          isLoading: false,
        });
        console.log("We can't access your current geolocation!", err);
      }
    );
  };

  useEffect(() => {
    getCoordinates();
  }, []);

  const getWeatherDataFromCoords = async ({
    lat,
    lon,
  }: {
    lat: number;
    lon: number;
  }) => {
    setState({
      ...state,
      isLoading: true,
    });

    const params = {
      lat,
      lon: lon,
      FcstType: "json",
    };

    const response = await WeatherForcastApi.getWeatherData(params);

    if (!response?.data?.data && !response.data.success) {
      setState({
        ...state,
        forcastRequestError: {
          errorCode: ResponseCodes.FORCAST_NOT_FOUND_FOR_LOCATION,
          message: response.data.message,
        },
        isLoading: false,
      });
      return;
    }

    if (response?.error) {
      setState({
        ...state,
        isLoading: false,
      });
      return;
    }

    const daysForcast: IForcastData[] = [];

    const days = response.data.time.startPeriodName;

    days.forEach((day: string, idx: number) => {
      daysForcast.push({
        startPeriodName: day,
        startValidTime: response.data.time.startValidTime[idx] ?? "",
        tempLabel: response.data.time.tempLabel[idx] ?? "",
        temperature:
          convertTemperatureFahrenheitToCelsius(
            response.data.data.temperature[idx]
          ) ?? "",
        weather: response.data.data.weather[idx] ?? "",
        iconLink: response.data.data.iconLink[idx] ?? "",
        value: response.data.data.temperature[idx] ?? "",
      });
    });

    setState({
      ...state,
      data: response?.data,
      isLoading: false,
      forcastData: daysForcast,
      forcastRequestError: {
        errorCode: "",
        message: "",
      },
    });
  };

  const getWeatherForcastData = async (address: string | null) => {
    if (!address) return;

    try {
      setState({
        ...state,
        isLoading: true,
      });
      const latAndLongData = await GeoCodingApi.getAddressData({ address });
      if (latAndLongData?.error) {
        setState({
          ...state,
          isLoading: false,
        });
        return;
      }

      const lat = latAndLongData.data?.results[0].geometry.location.lat;
      const lon = latAndLongData.data?.results[0].geometry.location.lng;

      getWeatherDataFromCoords({
        lat,
        lon,
      });
    } catch (error) {
      console.log("something went wrong while fetching data");
      setState({
        ...state,
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    if (state.fetchingCoords) return;

    if (state.coords.lat || state.coords.lon) {
      getWeatherDataFromCoords({
        lat: state.coords.lat,
        lon: state.coords.lon,
      });
    } else {
      getWeatherForcastData(state.defaultAddress);
    }
  }, [state.fetchingCoords]);

  return (
    <>
      <div className="weather-statistics">
        <div className="weather-searchbar-conatainer">
          <header>
            <h1 className="text-center">Weather Forcasting</h1>
          </header>
          <SearchInput getWeatherForcastData={getWeatherForcastData} />
        </div>
        {state.isLoading ? (
          <div className="loading-container">
            <CircularProgress />
          </div>
        ) : null}

        {!state.isLoading &&
        state.forcastRequestError.errorCode ===
          ResponseCodes.FORCAST_NOT_FOUND_FOR_LOCATION ? (
          <div className="forcast-not-found-container">
            <img src="/assets/images/weather.png" alt=" " />
            <div className="error-text text-secondary montserrat-medium">
              <p>
                Weather data is not found for the location you searched for!
              </p>
            </div>

            <button
              className="reset-button text-primary"
              onClick={() => getWeatherForcastData(state.defaultAddress)}
            >
              Click to reset
            </button>
          </div>
        ) : (
          <div className="weather-historical-records">
            {state.isLoading ? null : (
              <>
                <div className="weather-data-container">
                  <div className="card-left">
                    <img src={state.data.data?.iconLink[0]} alt="" />

                    <div className="temp-conainer">
                      <h2 className="montserrat-medium text-secondary">
                        {state.data.currentobservation?.Temp
                          ? state.tempUnit === "celcius"
                            ? convertTemperatureFahrenheitToCelsius(
                                state.data.currentobservation?.Temp
                              )
                            : state.data.currentobservation?.Temp
                          : ""}
                      </h2>
                      <div className="temp-unit montserrat-regular">
                        <p
                          className={
                            state.tempUnit === "celcius" ? "font-bold" : ""
                          }
                          onClick={() =>
                            setState({ ...state, tempUnit: "celcius" })
                          }
                        >
                          °C
                        </p>
                        <p
                          className={
                            state.tempUnit === "fehrenheit" ? "font-bold" : ""
                          }
                          onClick={() => {
                            setState({ ...state, tempUnit: "fehrenheit" });
                          }}
                        >
                          °F
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card-right">
                    <p className="location-name text-secondary montserrat-bold ">
                      {state.data.currentobservation?.name}
                    </p>
                    <p className="montserrat-regular day text-primary">
                      {state.data.currentobservation?.Date
                        ? moment(
                            state.data.currentobservation?.Date,
                            "D MMM HH:mm a z"
                          ).format("dddd")
                        : null}
                    </p>
                    <p className="montserrat-regular condition text-primary">
                      {state.data.data?.weather[0]}
                    </p>
                  </div>
                </div>
                <div className="forcast-chart">
                  <ForcastChart forcastData={state.forcastData} />
                </div>
                <div className="weather-history">
                  {state?.forcastData.slice(0, 7).map((day, idx) => {
                    return <WeatherCard weatherData={day} key={idx} />;
                  })}
                </div>
                <div className="weather-history weather-cards-next-row">
                  {state?.forcastData.slice(7).map((day, idx) => {
                    return <WeatherCard weatherData={day} key={idx} />;
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default WeatherStatistics;
