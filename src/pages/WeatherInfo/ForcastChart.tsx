import moment from "moment";
import React from "react";
import { ResponsiveContainer, AreaChart, XAxis, Tooltip, Area } from "recharts";
import { IForcastData } from "../../@types/api";
import { convertTemperatureFahrenheitToCelsius } from "../../utils/common";

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

interface IForcastChart {
  forcastData: IForcastData[];
}

const ForcastChart: React.FC<IForcastChart> = ({ forcastData }) => {
  return (
    <div className="chart-container">
      <div className="weather-forcast-chart">
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart
            height={200}
            data={forcastData}
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
                <stop offset="5%" stopColor="#10b3e8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#fff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="startValidTime"
              tickLine={false}
              tickSize={1}
              tickFormatter={(date) =>
                moment(date, "YYYY-MM-DD HH:mm:ss-HH:mm").format("HH a")
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
  );
};

export default ForcastChart;
