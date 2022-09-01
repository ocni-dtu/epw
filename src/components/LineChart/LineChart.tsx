import { Loading } from "../Loading";
import { ErrorMessage } from "../ErrorMessage";
import React from "react";
import { WeatherData } from "../../dataProcessing/fetchEpw";
import { scaleTime, scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { GridRows, GridColumns } from "@visx/grid";
import { curveBasis } from "@visx/curve";
import { LinePath } from "@visx/shape";
import moment from "moment";
import { useTheme } from "@mui/material";

interface LineChartProps {
  isLoading: boolean;
  error?: Error | unknown;
  data?: WeatherData[];
  width?: number;
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = (props) => {
  const { isLoading, error, data, width = 800, height = 500 } = props;

  const theme = useTheme();

  const background = theme.palette.backgroundColor;

  const xMax = width - 120;

  const yMax = height - 60;

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorMessage error={error} />;
  }
  if (!data) {
    return <div>No Data</div>;
  }

  // scales
  const timeScale = scaleTime<number>({
    domain: [moment("20220101", "YYYYMMDD").unix(), moment("20230101", "YYYYMMDD").unix()],
  });

  const temperatureScale = scaleLinear<number>({
    domain: [
      Math.min(...data.map((elem) => elem.dryBulbTemperature)),
      Math.max(...data.map((elem) => elem.dryBulbTemperature)),
    ],
    nice: true,
  });

  timeScale.range([0, xMax]);
  temperatureScale.range([yMax, 0]);

  return (
    <div data-testid="temp-rh-chart">
      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
        <Group left={60} top={20}>
          <GridRows scale={temperatureScale} width={xMax} height={yMax} stroke={theme.palette.gridLines} />
          <GridColumns scale={timeScale} width={xMax} height={yMax} stroke={theme.palette.gridLines} />
          <AxisBottom
            top={yMax}
            scale={timeScale}
            numTicks={width > 520 ? 10 : 5}
            tickFormat={(date) => moment.unix(date as number).format("DD-MMM")}
            tickLabelProps={() => ({
              fill: theme.palette.primary.main,
              fontSize: theme.typography.caption.fontSize,
              fontFamily: theme.typography.fontFamily,
              textAnchor: "middle",
            })}
          />
          <AxisLeft
            scale={temperatureScale}
            numTicks={5}
            tickLabelProps={() => ({
              fill: theme.palette.primary.main,
              fontSize: theme.typography.caption.fontSize,
              fontFamily: theme.typography.fontFamily,
              textAnchor: "end",
            })}
          />
          <text
            x={height / -2}
            y="-30"
            transform="rotate(-90)"
            fontSize={theme.typography.fontSize}
            fontFamily={theme.typography.fontFamily}
          >
            Temperature (°C)
          </text>
          <LinePath
            data-testid="temp-curve"
            data={data.map((weatherData, index) => ({
              date: moment("20220101", "YYYYMMDD").add(index, "hours").unix(),
              dryBulbTemperature: weatherData.dryBulbTemperature,
            }))}
            curve={curveBasis}
            x={(d) => timeScale(d.date) ?? 0}
            y={(d) => temperatureScale(d.dryBulbTemperature) ?? 0}
            stroke={theme.palette.primary.main}
            strokeWidth={1.5}
          />
        </Group>
      </svg>
    </div>
  );
};
