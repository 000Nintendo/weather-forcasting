import { Tooltip, AreaChart, Area, ResponsiveContainer, XAxis } from "recharts";
import React, { useEffect, useState } from "react";
import "./scss/WeatherStatistics.scss";
import { WeatherForcastApi } from "../utils/api/WeatherForcastApi";
import moment from "moment";

const WeatherForcastChart = () => {
  const [state, setState] = useState({
    data: {
      operationalMode: "",
      srsName: "",
      creationDate: "",
      creationDateLocal: "",
      productionCenter: "",
      credit: "",
      moreInformation: "",
      location: [],
      time: {
        layoutKey: "",
        startPeriodName: [],
        startValidTime: [],
        tempLabel: [],
      },
      data: {
        temperature: [],
        pop: [],
        weather: [],
        iconLink: [],
        hazard: [],
        hazardUrl: [],
        text: [],
      },
      currentobservation: {},
    },
    isLoading: false,
    error: "",
  });

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

      setState({
        ...state,
        data: response?.data,
        isLoading: false,
      });
    } catch (error) {
      console.log("something went wrong while fetching data");
      setState({
        ...state,
        isLoading: false,
      });
    }
  };

  let temperatureData: any = [];

  for (let data of state.data.data?.temperature) {
    let temperatureRecord: any = {};
    temperatureRecord["value"] = data;
    temperatureData.push(temperatureRecord);
  }

  useEffect(() => {
    getWeatherForcastData();
  }, []);
  return (
    <div className=" weather-forcast-chart">
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart
          width={500}
          height={200}
          data={temperatureData}
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
          <XAxis dataKey="temperature" />
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
  );
};

const WeatherStatistics = () => {
  const [state, setState] = useState({
    data: {
      operationalMode: "",
      srsName: "",
      creationDate: "",
      creationDateLocal: "",
      productionCenter: "",
      credit: "",
      moreInformation: "",
      location: [],
      time: {
        layoutKey: "",
        startPeriodName: [],
        startValidTime: [],
        tempLabel: [],
      },
      data: {
        temperature: [],
        pop: [],
        weather: [],
        iconLink: [],
        hazard: [],
        hazardUrl: [],
        text: [],
      },
      currentobservation: {},
    } as any,
    isLoading: false,
    error: "",
  });

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

      setState({
        ...state,
        data: response?.data,
        isLoading: false,
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
    getWeatherForcastData();
  }, []);
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
        <div className="chart-container">
          <WeatherForcastChart />
        </div>
        <div className="weather-data-container">
          <div className="card-left">
            <img src={state.data.data?.iconLink[0]} alt="" />
            <h2>{state.data.currentobservation?.Temp}</h2>
            <p>°C</p>
          </div>
          <div className="card-right">
            <p>{state.data.currentobservation?.name}</p>
            <p>
              {moment(
                state.data.currentobservation?.Date,
                "D MMM HH:mm a z"
              ).format("dddd")}
            </p>
            <p>{state.data.data.weather[0]}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default WeatherStatistics;
