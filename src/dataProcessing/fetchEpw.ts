import epwUrls from "../assets/epwUrls.json";
// eslint-disable-next-line import/no-unresolved
import { parse } from "csv-parse/browser/esm/sync";

export interface WeatherData {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  uncertainty: string;
  dryBulbTemperature: number;
  dewPointTemperature: number;
  relativeHumidity: number;
  atmosphericStationPressure: number;
  extraterrestrialHorizontalRadiation: number;
  extraterrestrialDirectNormalRadiation: number;
  horizontalInfraredRadiationIntensity: number;
  globalHorizontalRadiation: number;
  directNormalRadiation: number;
  diffuseHorizontalRadiation: number;
  globalHorizontalIlluminance: number;
  directNormalIlluminance: number;
  diffuseHorizontalIlluminance: number;
  zenithLuminance: number;
  windDirection: number;
  windSpeed: number;
  totalSkyCover: number;
  opaqueSkyCover: number;
  visibility: number;
  ceilingHeight: number;
  presentWeatherObservation: number;
  presentWeatherCodes: number
  precipitableWater: number;
  aerosolOpticalDepth: number;
  snowDepth: number;
  daysSinceLastSnowfall: number;
  albedo: number;
  liquidPrecipitationDepth: number;
  liquidPrecipitationQuantity: number;
}

export interface EpwData {
  metaData: {
    location: string;
    designCondition: string;
    designConditions: string;
    typicalExtremePeriod: string;
    typicalExtremePeriods: string;
    groundTemperature: string;
    groundTemperatures: string;
    holiday: boolean;
    holidayDaylightSavings: boolean;
    comments1: string;
    comments2: string;
    dataPeriod: string;
    dataPeriods: string;
  };
  data: WeatherData[];
}

export const fetchEpwData = (epwId: keyof typeof epwUrls | undefined) => {
  if (!epwId) {
    throw new Error("no epw id given");
  }
  const url = epwUrls[epwId];

  return fetch(url, {}).then(response => {
    return response.text();
  }).then(text => {
    return parseEpwData(text)
  })
};


export const parseEpwData = (epwData: string) => {
  const epwRaw = parse(epwData, {
    from_line: 9,
    skip_empty_lines: true,
    cast: (value, context) => {
      if (context.column !== 'uncertainty') return Number(value);
      return value;
    },
    columns: [
      "year",
      "month",
      "day",
      "hour",
      "minute",
      "uncertainty",
      "dryBulbTemperature",
      "dewPointTemperature",
      "relativeHumidity",
      "atmosphericStationPressure",
      "extraterrestrialHorizontalRadiation",
      "extraterrestrialDirectNormalRadiation",
      "horizontalInfraredRadiationIntensity",
      "globalHorizontalRadiation",
      "directNormalRadiation",
      "diffuseHorizontalRadiation",
      "globalHorizontalIlluminance",
      "directNormalIlluminance",
      "diffuseHorizontalIlluminance",
      "zenithLuminance",
      "windDirection",
      "windSpeed",
      "totalSkyCover",
      "opaqueSkyCover",
      "visibility",
      "ceilingHeight",
      "presentWeatherObservation",
      "presentWeatherCodes",
      "precipitableWater",
      "aerosolOpticalDepth",
      "snowDepth",
      "daysSinceLastSnowfall",
      "albedo",
      "liquidPrecipitationDepth",
      "liquidPrecipitationQuantity",
    ],
  });

  return { data: epwRaw as WeatherData[] } as EpwData;
};
