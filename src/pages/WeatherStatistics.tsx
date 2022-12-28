import { Tooltip, AreaChart, Area, ResponsiveContainer, XAxis } from "recharts";
import React, { useEffect, useState } from "react";
import { WeatherForcastApi } from "../utils/api/WeatherForcastApi";
import { IForcastData, IWeatherForcastResponse } from "../@types/api";
import moment from "moment";

import "./scss/WeatherStatistics.scss";

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
    error: "",
  });

  const getCoordinates = async () => {
    setState({
      ...state,
      fetchingCoords: true,
    });
    if (!navigator.geolocation) {
      setState({
        ...state,
        error: "Geolocation is not supported by this browser.",
      });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          ...state,
          fetchingCoords: false,
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
        });
        console.log("We can't access your current geolocation!", err);
      }
    );
  };

  useEffect(() => {
    getCoordinates();
  }, []);

  const getWeatherForcastData = async () => {
    setState({
      ...state,
      isLoading: false,
    });
    try {
      const params = {
        lat: 30.4618,
        lon: -102.4426,
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
        if (idx % 2 === 0) {
          daysForcast.push({
            startPeriodName: day,
            startValidTime: response.data.time.startValidTime[idx] ?? "",
            tempLabel: response.data.time.tempLabel[idx] ?? "",
            temperature: response.data.data.temperature[idx] ?? "",
            weather: response.data.data.weather[idx] ?? "",
            iconLink: response.data.data.iconLink[idx] ?? "",
            value: response.data.data.temperature[idx] ?? "",
          });
        }
        return;
      });

      console.log("daysForcast >>>", daysForcast);

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
    getWeatherForcastData();
  }, [state.coords]);

  return (
    <>
      <div className="weather-statistics">
        <div className="weather-searchbar-conatainer">
          <header>
            <h1 className="text-center">Weather Forcasting</h1>
          </header>
          <div className="weather-searchbar flex-column">
            <label htmlFor="weather-input">Enter your Address</label>
            <input type="text" id="weather-input" />
            <button type="button">Search</button>
          </div>
        </div>
        <div className="weather-historical-records">
          <div className="weather-data-container">
            <div className="card-left">
              <img src={state.data.data?.iconLink[0]} alt="" />

              <div className="temp-conainer">
                <h2 className="montserrat-medium text-secondary">
                  {state.data.currentobservation?.Temp}
                </h2>
                <p className="montserrat-regular">°C</p>
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
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="temperature" tickLine={false} />
                  <Tooltip />
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
            {state?.forcastData.map((day, idx) => {
              return (
                <div
                  className={`weather-card ${idx === 0 ? "latest-record" : ""}`}
                >
                  <h3 className="period-name montserrat-regular">
                    {day.startPeriodName}
                  </h3>
                  <img src={day.iconLink} alt="weather-logo" />
                  <p className="temp montserrat-regular">{day.temperature}°C</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default WeatherStatistics;
