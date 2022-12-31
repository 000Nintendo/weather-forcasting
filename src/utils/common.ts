export const convertTemperatureFahrenheitToCelsius = (temp: string) => {
  const temperatureInCelcius = ((+temp - 32) * 5) / 9;
  return parseInt(temperatureInCelcius.toString()).toString();
};
