import axios from "axios";
import { IApiResponse, IGeoCodingGetAddressDataParams } from "../../@types/api";

export class GeoCodingApi {
  static getAddressData = async ({
    address,
  }: IGeoCodingGetAddressDataParams): Promise<IApiResponse<any>> => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_GEO_LOCATION_SERVICE_API_ENDPOINT}/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      if (res?.data?.error_message) {
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
