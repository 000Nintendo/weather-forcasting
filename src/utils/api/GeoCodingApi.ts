import axios from "axios";
import { IApiResponse, IGeoCodingGetAddressDataParams } from "../../@types/api";

export class GeoCodingApi {
  static getAddressData = async ({
    address,
    benchmark = 2020,
    format = "json",
  }: IGeoCodingGetAddressDataParams): Promise<IApiResponse<any>> => {
    try {
      const params = {
        address,         
        benchmark,
        format,
      };
      const res = await axios.get(
        `${process.env.REACT_APP_GEO_LOCATION_SERVICE_API_ENDPOINT}`,
        {
          params,
        }
      );
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
