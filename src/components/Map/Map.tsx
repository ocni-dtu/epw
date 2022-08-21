import React, { useCallback } from "react";
import { Graticule, Mercator } from "@visx/geo";
import * as topojson from "topojson-client";
import worldTopology from "../../assets/world.json";
import epwTopology from "../../assets/epws.json";
import { ParsedFeature } from "@visx/geo/lib/projections/Projection";
// eslint-disable-next-line import/named
import { geoMercator, GeoPath, GeoProjection } from "d3-geo";
import { Zoom } from "@visx/zoom";
import { RectClipPath } from "@visx/clip-path";
import { localPoint } from "@visx/event";
import { Tooltip, useTooltip } from "@visx/tooltip";
import { ButtonGroup, IconButton, Typography, useTheme } from "@mui/material";
import { CenterFocusWeak, RestartAltRounded, ZoomIn, ZoomOut } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface FeatureShape {
  type: "Feature";
  id: string;
  geometry: { coordinates: [number, number][][]; type: "Polygon" | "Point" };
  properties: { name: string };
}

interface FeatureCollection {
  type: "FeatureCollection";
  features: FeatureShape[];
}

const world = topojson.feature(worldTopology, worldTopology.objects.units) as FeatureCollection;

const epwLocations = epwTopology as FeatureCollection;

let tooltipTimeout: number;

interface MapProps {
  height?: number;
  width?: number;
}

export const Map: React.FC<MapProps> = ({ height = 500, width = 800 }) => {
  const {hideTooltip, showTooltip, tooltipData, tooltipLeft, tooltipTop} = useTooltip();

  const theme = useTheme();

  const centerX = width / 2;

  const centerY = height / 2;

  const translate: [number, number] = [centerX, height / 1.77];

  const scale = (width / 630) * 100;

  const background = theme.palette.backgroundColor;

  const projection = geoMercator().translate(translate).scale(scale);

  const initialTransform = {
    scaleX: 1,
    scaleY: 1,
    translateX: 0,
    translateY: 0,
    skewX: 0,
    skewY: 0,
  };

  return (
    <>
      <Zoom<SVGSVGElement>
        width={width}
        height={height}
        scaleXMin={1 / 2}
        scaleXMax={4}
        scaleYMin={1 / 2}
        scaleYMax={4}
        initialTransformMatrix={initialTransform}
      >
        {(zoom) => (
          <div data-testid="epw-map">
            <svg
              width={width}
              height={height}
              style={{ cursor: zoom.isDragging ? "grabbing" : "grab", touchAction: "none" }}
              ref={zoom.containerRef}
            >
              <RectClipPath id="zoom-clip" width={width} height={height} />
              <rect width={width} height={height} rx={14} fill={background} />
              <rect
                width={width}
                height={height}
                rx={14}
                fill="transparent"
                onTouchStart={zoom.dragStart}
                onTouchMove={zoom.dragMove}
                onTouchEnd={zoom.dragEnd}
                onMouseDown={zoom.dragStart}
                onMouseMove={zoom.dragMove}
                onMouseUp={zoom.dragEnd}
                onMouseLeave={() => {
                  if (zoom.isDragging) zoom.dragEnd();
                }}
                onDoubleClick={(event) => {
                  const point = localPoint(event) || { x: 0, y: 0 };

                  zoom.scale({ scaleX: 1.1, scaleY: 1.1, point });
                }}
              />
              <Mercator<FeatureShape> data={world.features} scale={scale} translate={[centerX, centerY + 50]}>
                {(mercator) => (
                  <CountryOutline background={background} mercator={mercator} transform={zoom.toString()} />
                )}
              </Mercator>
              <EpwLocations
                projection={projection}
                locations={epwLocations}
                transform={zoom.toString()}
                scale={zoom.transformMatrix.scaleX}
                hideTooltip={hideTooltip}
                showTooltip={showTooltip}
              />
            </svg>
            <ControlButtons zoom={zoom} />
            {tooltipData && (
              <Tooltip left={tooltipLeft} top={tooltipTop +125}>
                <Typography variant="caption" color="primary">
                  {tooltipData}
                </Typography>
              </Tooltip>
            )}
          </div>
        )}
      </Zoom>
    </>
  );
};

interface CountryOutlineProps {
  background: string;
  mercator: {
    features: ParsedFeature<FeatureShape>[];
    path: GeoPath;
  };
  transform: string;
}

const CountryOutline: React.FC<CountryOutlineProps> = ({ mercator, background, transform }) => {
  const theme = useTheme()

  return (
    <g transform={transform}>
      <Graticule graticule={(g) => mercator.path(g) || ""} stroke={theme.palette.gridLines} />
      {mercator.features.map(({ path }, i) => (
        <path key={`map-feature-${i}`} d={path || ""} fill={theme.palette.countryColor} stroke={background} strokeWidth={0.5} />
      ))}
    </g>
  );
};

interface TooltipProps {
  tooltipLeft: number
  tooltipTop: number
  tooltipData: string
}

interface EpwLocationsProps {
  locations: FeatureCollection;
  projection: GeoProjection;
  transform: string;
  scale: number;
  showTooltip: (TooltipProps) => void;
  hideTooltip: () => void;
}

const EpwLocations: React.FC<EpwLocationsProps> = ({
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

      const point = localPoint(event)

      showTooltip({
        tooltipLeft: point.x,
        tooltipTop: point.y,
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

  return (
    <g transform={transform}>
      {locations.features?.map((location, index) => (
        <circle
          onMouseEnter={(e) =>
            handleMouseEnter(e, {
              x: location.geometry.coordinates[0],
              y: location.geometry.coordinates[1],
            }, location.properties.title)
          }
          data-testid="map-epw-location"
          style={{cursor: "pointer"}}
          onMouseLeave={handleMouseLeave}
          onClick={() => navigate(`/visualization/${location.properties.title}`)}
          key={index}
          r={3 - scale / 2}
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth={3 - scale / 2}
          transform={`translate(${projection([location.geometry.coordinates[0], location.geometry.coordinates[1]])})`}
        />
      ))}
    </g>
  );
};

interface ControlButtonsProps {
  zoom: {
    scale: ({ scaleX: number, scaleY: number }) => void;
    center: () => void;
    reset: () => void;
  };
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ zoom }) => {
  return (
    <ButtonGroup data-testid="map-control-buttons" variant="contained" aria-label="outlined primary button group">
      <IconButton onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })}>
        <ZoomIn />
      </IconButton>
      <IconButton onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}>
        <ZoomOut />
      </IconButton>
      <IconButton onClick={zoom.center}>
        <CenterFocusWeak />
      </IconButton>
      <IconButton onClick={zoom.reset}>
        <RestartAltRounded />
      </IconButton>
    </ButtonGroup>
  );
};
