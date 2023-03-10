import {
  IApiResponse,
  IWeatherForcastRequestPayload,
  IWeatherForcastResponse,
} from "../../@types/api";
import axiosInstance from "./axios";

export class WeatherForcastApi {
  static getWeatherData = async ({
    lat,
    lon,
    FcstType = "json",
  }: IWeatherForcastRequestPayload): Promise<
    IApiResponse<IWeatherForcastResponse>
  > => {
    try {
      const params = {
        lat,
        lon,
        FcstType,
      };
      const res = await axiosInstance({
        method: "get",
        params,
      });
      if (res.status !== 200) {
        return {
          error: "Something went wrong!",
        };
      }
      return { data: res?.data };
    } catch (error: any) {
      return {
        error: "Something went wrong!",
      };
    }
  };
}
