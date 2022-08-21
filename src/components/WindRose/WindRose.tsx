import { WeatherData } from "../../dataProcessing/fetchEpw";
import React from "react";
import { Loading } from "../Loading";
import { ErrorMessage } from "../ErrorMessage";

interface WindRoseProps {
  isLoading: boolean;
  error?: Error | unknown;
  data?: WeatherData[];
}

export const WindRose: React.FC<WindRoseProps> = (props) => {
  const { isLoading, error, data } = props;

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorMessage error={error} />;
  }
  if (!data) {
    return <div>No Data</div>;
  }

  const windData: {[key: string]: number[]} = {
    0.0: [],
    22.5: [],
    45: [],
    67.5: [],
    90.0: [],
    112.5: [],
    135.0: [],
    157.5: [],
    180.0: [],
    202.5: [],
    225: [],
    247.5: [],
    270.0: [],
    292.5: [],
    315.0: [],
    337.5: [],
    360: [],
  };


  const windKeys = [...Object.keys(windData)]

  data.forEach((weatherData) => {
    windKeys.every((key) => {
      //console.log("KEY", Number(key) + 12.25, weatherData.windDirection)
      if (weatherData.windDirection <= (Number(key) + 12.25) ) {
        windData[key].push(weatherData.windSpeed)
        return false;
      }
    })
  });
  //windData[0.0].concat(...windData[360])

  console.log("WINDATA", windData)
  return (
    <>
      <div data-testid="wind-rose">Wind Rose</div>
    </>
    );
};
