import React from "react";
import { IForcastData } from "../../@types/api";

interface IWeatherCard {
  weatherData: IForcastData;
}

const WeatherCard: React.FC<IWeatherCard> = ({ weatherData }) => {
  return (
    <div className={`weather-card `}>
      <h3 className="period-name montserrat-regular">
        {weatherData.startPeriodName}
      </h3>
      <img src={weatherData.iconLink} alt="weather-logo" />
      <p className="temp montserrat-regular">{weatherData.temperature}°C</p>
      <p className="weather montserrat-regular text-secondary">
        {weatherData.weather}
      </p>
    </div>
  );
};

export default WeatherCard;
