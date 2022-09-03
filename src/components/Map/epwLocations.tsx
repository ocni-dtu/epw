import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { localPoint } from "@visx/event";

interface EpwLocationShape {
  type: "Feature";
  id: string;
  geometry: {
    coordinates: [number, number];
    type: "Polygon" | "Point"
  };
  properties: { title: string };
}

export interface EpwLocationCollection {
  type: "FeatureCollection";
  features: EpwLocationShape[];
}

interface TooltipProps {
  tooltipLeft: number;
  tooltipTop: number;
  tooltipData: string;
}

interface EpwLocationsProps {
  locations?: EpwLocationCollection;
  projection: (arg0: [number, number]) => [number, number] | null;
  transform: string;
  scale: number;
  showTooltip: (arg0: TooltipProps) => void;
  hideTooltip: () => void;
}

let tooltipTimeout: number;

export const EpwLocations: React.FC<EpwLocationsProps> = ({
  locations,
  projection,
  transform,
  scale,
  showTooltip,
  hideTooltip,
}) => {
  const navigate = useNavigate();

  const theme = useTheme();

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent, location: { x: number; y: number }, title: string) => {
      if (tooltipTimeout) clearTimeout(tooltipTimeout);

      const point = localPoint(event);

      showTooltip({
        tooltipLeft: point? point.x: 0,
        tooltipTop: point? point.y: 0,
        tooltipData: title,
      });
    },
    [location]
  );

  const handleMouseLeave = useCallback(() => {
    tooltipTimeout = window.setTimeout(() => {
      hideTooltip();
    }, 300);
  }, [hideTooltip]);

  if (!locations){return null}

  return (
    <g transform={transform}>
      {locations.features?.map((location, index) => (
        <circle
          onMouseEnter={(e) =>
            handleMouseEnter(
              e,
              {
                x: location.geometry.coordinates[0],
                y: location.geometry.coordinates[1],
              },
              location.properties.title
            )
          }
          data-testid="map-epw-location"
          style={{ cursor: "pointer" }}
          onMouseLeave={handleMouseLeave}
          onClick={() => navigate(`/visualization/${location.properties.title}`)}
          key={index}
          r={3 - scale / 2}
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth={3 - scale / 2}
          /* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */
          transform={`translate(${projection([location.geometry.coordinates[0], location.geometry.coordinates[1]])})`}
        />
      ))}
    </g>
  );
};
