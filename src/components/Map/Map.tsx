import React from "react";
import { Mercator, Graticule } from '@visx/geo';
import * as topojson from 'topojson-client';
import worldTopology from '../../assets/world.json';
import epwTopology from '../../assets/epws.json';
import { ParsedFeature } from "@visx/geo/lib/projections/Projection";
import { GeoPath, GeoProjection, geoMercator } from "d3-geo";
import { Zoom } from '@visx/zoom';

interface FeatureShape {
  type: 'Feature';
  id: string;
  geometry: { coordinates: [number, number][][]; type: 'Polygon' | "Point" };
  properties: { name: string };
}

interface FeatureCollection {
  type: 'FeatureCollection';
  features: FeatureShape[];
}

const world = topojson.feature(worldTopology, worldTopology.objects.units) as FeatureCollection

const epwLocations = epwTopology as FeatureCollection;

interface MapProps {
  height: number;
  width: number;
}
export const Map: React.FC<MapProps> = ({height= 500, width = 800}) => {

  const centerX = width / 2;

  const centerY = height / 2;

  const translate: [number, number] = [centerX, height / 1.77];

  const scale = (width / 630) * 100;

  const background = '#f9f7e8';

  const projection = geoMercator().translate(translate).scale(scale);

  return (
    <svg width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
      <Mercator<FeatureShape>
        data={world.features}
        scale={scale}
        translate={[centerX, centerY + 50]}
      >
        {(mercator) => (
          <CountryOutline background={background} mercator={mercator}/>
        )}
      </Mercator>
      <EpwLocations projection={projection} locations={epwLocations}/>
    </svg>
  );
};

interface CountryOutlineProps {
  background: string;
  mercator: {
    features: (ParsedFeature<FeatureShape>)[];
    path: GeoPath;
  }
}
const CountryOutline: React.FC<CountryOutlineProps> = ({mercator, background}) => {
  return (
    <g>
      <Graticule graticule={(g) => mercator.path(g) || ''} stroke="rgba(33,33,33,0.05)" />
      {mercator.features.map(({ feature, path }, i) => (
        <path
          key={`map-feature-${i}`}
          d={path || ''}
          fill={'#5a714a'}
          stroke={background}
          strokeWidth={0.5}
        />
      ))}
    </g>
  )
}

interface EpwLocationsProps {
  locations: FeatureCollection
  projection: GeoProjection
}
const EpwLocations: React.FC<EpwLocationsProps> = ({locations, projection}) => {

  return (
    <g>
      {locations.features?.map((location, index) => (
        <circle
          key={index}
          r={3}
          fill="none"
          stroke="#333"
          strokeWidth={3}
          transform={`translate(${projection([
            location.geometry.coordinates[0],
            location.geometry.coordinates[1],
          ])})`}
        />
      ))}
    </g>
  )
}
