// import { integerPropType } from "@mui/utils";

export interface IApiResponse<T> {
  data?: T | any;
  error?: string;
  status?: number;
  message?: string;
}

export interface IWeatherForcastRequestPayload {
  lat: number;
  lon: number;
  FcstType: string;
}

export interface IWeatherLocationData {
  region: string;
  latitude: string;
  longitude: string;
  elevation: string;
  wfo: string;
  timezone: string;
  areaDescription: string;
  radar: string;
  zone: string;
  county: string;
  firezone: string;
  metar: string;
}
export interface IWeatherTimeData {
  layoutKey: string;
  startPeriodName: string[];
  startValidTime: string[];
  tempLabel: string[];
}

export interface IWeatherData {
  temperature: string[];
  pop: string[];
  weather: string[];
  iconLink: string[];
  hazard: string[];
  hazardUrl: string[];
  text: string[];
}

export interface IWeatherCurrentObservation {
  id: string;
  name: string;
  elev: string;
  latitude: string;
  longitude: string;
  Date: string;
  Temp: string;
  Dewp: string;
  Relh: string;
  Winds: string;
  Windd: string;
  Gust: string;
  Weather: string;
  Weatherimage: string;
  Visibility: string;
  Altimeter: string;
  SLP: string;
  timezone: string;
  state: string;
  WindChill: string;
}

export interface IWeatherForcastResponse {
  operationalMode: string;
  srsName: string;
  creationDate: string;
  creationDateLocal: string;
  productionCenter: string;
  credit: string;
  moreInformation: string;
  location: IWeatherLocationData;
  time: IWeatherTimeData;
  data: IWeatherData;
  currentobservation: IWeatherCurrentObservation;
}

export interface IForcastData {
  startPeriodName: string;
  startValidTime: string;
  tempLabel: string;
  temperature: string;
  weather: string;
  iconLink: string;
  value: string;
}

/**
 * Geocoding apis
 */

export interface IGeoCodingGetAddressDataParams {
  address: string;
}
