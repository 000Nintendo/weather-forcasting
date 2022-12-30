import { Tooltip, AreaChart, Area, ResponsiveContainer, XAxis } from "recharts";
import React, { useEffect, useState } from "react";
import { WeatherForcastApi } from "../utils/api/WeatherForcastApi";
import { IForcastData, IWeatherForcastResponse } from "../@types/api";
import moment from "moment";
import SearchInput from "../components/Search/SearchInput";
import WeatherCard from "../components/Cards/WeatherCard";

import "./scss/WeatherStatistics.scss";
import { GeoCodingApi } from "../utils/api/GeoCodingApi";
import { CircularProgress } from "@mui/material";

const convertTemperatureFahrenheitToCelsius = (temp: string) => {
  const temperatureInCelcius = ((+temp - 32) * 5) / 9;
  return parseInt(temperatureInCelcius.toString()).toString();
};
const CustomTooltipForWeatherForcast: any = ({
  active,
  payload,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  label,
}: Record<any, any>) => {
  if (active && payload && payload.length) {
    const day = moment(
      payload[0]?.payload?.startValidTime,
      "YYYY-MM-DD HH:mm:ss-HH:mm"
    ).format("YYYY-MM-DD");
    const weather = payload[0]?.payload?.weather;

    return (
      <div className="custom-tooltip">
        <p>Date : &nbsp;{day}</p>
        <p>
          Temperature :
          {convertTemperatureFahrenheitToCelsius(
            payload[0]?.payload?.temperature
          )}
          °C
        </p>
        <p>Weather : &nbsp;{weather}</p>
      </div>
    );
  }
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
      const params = {
        lat,
        lon: lon,
        FcstType: "json",
      };

      const response = await WeatherForcastApi.getWeatherData(params);
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
    getWeatherForcastData("Los Angeles");
  }, []);

  return (
    <>
      <div className="weather-statistics">
        <div className="weather-searchbar-conatainer">
          <header>
            <h1 className="text-center">Weather Forcasting</h1>
          </header>
          <SearchInput getWeatherForcastData={getWeatherForcastData} />
        </div>

        <div className="weather-historical-records">
          {state.isLoading ? (
            <div className="loading-container">
              <CircularProgress />
            </div>
          ) : (
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
              <div className="chart-container">
                <div className="weather-forcast-chart">
                  <ResponsiveContainer width="100%" height={120}>
                    <AreaChart
                      height={200}
                      data={state.forcastData}
                      syncId="anyId"
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="colorUv"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8884d8"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8884d8"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="startValidTime"
                        tickLine={false}
                        tickSize={1}
                        tickFormatter={(date) =>
                          moment(date, "YYYY-MM-DD HH:mm:ss-HH:mm").format(
                            "HH a"
                          )
                        }
                      />
                      <Tooltip content={CustomTooltipForWeatherForcast} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#82ca9d"
                        fill="url(#colorUv)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
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
      </div>
    </>
  );
};

export default WeatherStatistics;
