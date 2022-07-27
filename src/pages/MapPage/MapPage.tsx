import React from "react";
import { Grid } from "@mui/material";
import { Map } from "../../components/Map";
import ParentSize from "@visx/responsive/lib/components/ParentSize";

export const MapPage = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item sx={{ height: "80vh", width: "100%" }}>
        <ParentSize>
          {({ width, height }) => <Map width={width} height={height} />}
        </ParentSize>
      </Grid>
    </Grid>
  );
};
