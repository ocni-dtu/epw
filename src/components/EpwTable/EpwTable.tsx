import { ErrorMessage } from "../ErrorMessage";
import React from "react";
import { WeatherData } from "../../dataProcessing/fetchEpw";
// eslint-disable-next-line import/named
import { DataGrid, GridValueGetterParams } from "@mui/x-data-grid";
import { TableToolbar } from "./TableToolbar";
import { LinearProgress } from "@mui/material";

interface EpwTableProps {
  isLoading: boolean;
  error?: Error | unknown;
  data?: WeatherData[];
}

export const EpwTable: React.FC<EpwTableProps> = (props) => {
  const { isLoading, error, data } = props;

  if (error) {
    return <ErrorMessage error={error} />;
  }

  const columnWidth = 150;

  const columns = [
    { field: "date", headerName: "Date", width: columnWidth,
      valueGetter: (params: GridValueGetterParams<WeatherData, WeatherData>) => (`${String(params.row.month).padStart(2, '0')}/${String(params.row.day).padStart(2, '0')} ${String(params.row.hour).padStart(2, '0')}:00`)
    },
    { field: "year", headerName: "Year", width: columnWidth },
    { field: "month", headerName: "Month", width: columnWidth },
    { field: "day", headerName: "Day", width: columnWidth },
    { field: "hour", headerName: "Hour", width: columnWidth },
    { field: "dryBulbTemperature", headerName: "Temperature", width: columnWidth },
    { field: "relativeHumidity", headerName: "Relative Humidity", width: columnWidth },
    { field: "dewPointTemperature", headerName: "Dew Point Temperature", width: columnWidth },
    { field: "atmosphericStationPressure", headerName: "Atmospheric Station Pressure", width: columnWidth },
    {
      field: "extraterrestrialHorizontalRadiation",
      headerName: "Extraterrestrial Horizontal Radiation",
      width: columnWidth,
    },
    {
      field: "extraterrestrialDirectNormalRadiation",
      headerName: "Extraterrestrial Direct Normal Radiation",
      width: columnWidth,
    },
    {
      field: "horizontalInfraredRadiationIntensity",
      headerName: "Horizontal Infrared Radiation Intensity",
      width: columnWidth,
    },
    { field: "globalHorizontalRadiation", headerName: "Global Horizontal Radiation", width: columnWidth },
    { field: "directNormalRadiation", headerName: "Global Horizontal Radiation", width: columnWidth },
    { field: "diffuseHorizontalRadiation", headerName: "Diffuse Horizontal Radiation", width: columnWidth },
    { field: "globalHorizontalIlluminance", headerName: "Global Horizontal Illuminance", width: columnWidth },
    { field: "directNormalIlluminance", headerName: "Direct Normal Illuminance", width: columnWidth },
    { field: "diffuseHorizontalIlluminance", headerName: "Diffuse Horizontal Illuminance", width: columnWidth },
    { field: "zenithLuminance", headerName: "Zenith Luminance", width: columnWidth },
    { field: "windDirection", headerName: "Wind Direction", width: columnWidth },
    { field: "windSpeed", headerName: "Wind Speed", width: columnWidth },
    { field: "totalSkyCover", headerName: "Total Sky Cover", width: columnWidth },
    { field: "opaqueSkyCover", headerName: "Opaque Sky Cover", width: columnWidth },
    { field: "visibility", headerName: "Visibility", width: columnWidth },
    { field: "ceilingHeight", headerName: "Ceiling Height", width: columnWidth },
    { field: "presentWeatherObservation", headerName: "Present Weather Observation", width: columnWidth },
    { field: "presentWeatherCodes", headerName: "Present Weather Codes", width: columnWidth },
    { field: "precipitableWater", headerName: "Precipitable Water", width: columnWidth },
    { field: "aerosolOpticalDepth", headerName: "Aerosol Optical Depth", width: columnWidth },
    { field: "snowDepth", headerName: "Snow Depth", width: columnWidth },
    { field: "daysSinceLastSnowfall", headerName: "Days Since Last Snowfall", width: columnWidth },
    { field: "albedo", headerName: "Albedo", width: columnWidth },
    { field: "liquidPrecipitationDepth", headerName: "Liquid Precipitation Depth", width: columnWidth },
    { field: "liquidPrecipitationQuantity", headerName: "Liquid Precipitation Quantity", width: columnWidth },
  ];

  return (
    <div data-testid="epw-table" style={{ height: "50vh" }}>
      <DataGrid
        density="compact"
        components={{ Toolbar: TableToolbar, LoadingOverlay: LinearProgress }}
        loading={isLoading}
        rows={data || []}
        columns={columns}
        getRowId={(row) => `${row.year}-${row.month}-${row.day}-${row.hour}`}
        columnVisibilityModel={{
          year: false,
          month: false,
          day: false,
          hour: false,
          minute: false,
          uncertainty: false,
          dewPointTemperature: false,
          ceilingHeight: false,
          visibility: false,
          zenithLuminance: false,
          extraterrestrialHorizontalRadiation: false,
          extraterrestrialDirectNormalRadiation: false,
          horizontalInfraredRadiationIntensity: false,
          globalHorizontalIlluminance: false,
          directNormalIlluminance: false,
          diffuseHorizontalIlluminance: false,
          totalSkyCover: false,
          presentWeatherObservation: false,
          presentWeatherCodes: false,
          precipitableWater: false,
          aerosolOpticalDepth: false,
          snowDepth: false,
          daysSinceLastSnowfall: false,
          albedo: false,
          liquidPrecipitationDepth: false,
          liquidPrecipitationQuantity: false,
        }}
      />
    </div>
  );
};
