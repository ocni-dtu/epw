import React, { useEffect, useState } from "react";
import { Graticule, Mercator } from "@visx/geo";
import * as topojson from "topojson-client";
import { ParsedFeature } from "@visx/geo/lib/projections/Projection";
// eslint-disable-next-line import/named
import { geoMercator, GeoPath } from "d3-geo";
import { Zoom } from "@visx/zoom";
import { RectClipPath } from "@visx/clip-path";
import { localPoint } from "@visx/event";
import { Tooltip, useTooltip } from "@visx/tooltip";
import { Typography, useTheme } from "@mui/material";
import { ControlButtons } from "./controlButtons";
import { EpwLocationCollection, EpwLocations } from "./epwLocations";
import { Loading } from "../Loading";

interface CountryShape {
  type: "Feature";
  id: string;
  geometry: { coordinates: [number, number][][]; type: "Polygon" | "Point" };
  properties: { name: string };
}

interface CountryCollection {
  type: "FeatureCollection";
  features: CountryShape[];
}

interface MapProps {
  height?: number;
  width?: number;
}

export const Map: React.FC<MapProps> = ({ height = 500, width = 800 }) => {
  const [epwLocations, setEpwLocations] = useState<EpwLocationCollection>();
  const [world, setWorld] = useState<CountryCollection>();

  useEffect(() => {
    const getLocations = async () => {
      const locations = (await import("../../assets/epws.json")).default as EpwLocationCollection
      setEpwLocations(locations);
    };
    getLocations();
  }, []);

  useEffect(() => {
    const getWorld = async () => {
      const worldTopology = (await import("../../assets/world.json")).default
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const _world = topojson.feature(worldTopology, worldTopology.objects.units) as unknown as CountryCollection;
      setWorld(_world);
    };
    getWorld();
  }, []);

  const { hideTooltip, showTooltip, tooltipData, tooltipLeft, tooltipTop } = useTooltip();

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

  if (!world){return <Loading />}

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
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
              <Mercator<CountryShape> data={world.features} scale={scale} translate={[centerX, centerY + 50]}>
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
              <Tooltip left={tooltipLeft} top={(tooltipTop || 0) + 125}>
                <Typography variant="caption" color="primary">
                  {tooltipData as string}
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
    features: ParsedFeature<CountryShape>[];
    path: GeoPath;
  };
  transform: string;
}

const CountryOutline: React.FC<CountryOutlineProps> = ({ mercator, background, transform }) => {
  const theme = useTheme();

  return (
    <g transform={transform}>
      <Graticule graticule={(g) => mercator.path(g) || ""} stroke={theme.palette.gridLines} />
      {mercator.features.map(({ path }, i) => (
        <path
          key={`map-feature-${i}`}
          d={path || ""}
          fill={theme.palette.countryColor}
          stroke={background}
          strokeWidth={0.5}
        />
      ))}
    </g>
  );
};
