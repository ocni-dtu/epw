import React from "react";
import { Grid } from "@mui/material";
import { Navigation } from "../../components/Navigation";
import { LineChart } from "../../components/LineChart";
import { EpwTable } from "../../components/EpwTable";
import { Footer } from "../../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchEpwData } from "../../dataProcessing/fetchEpw";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import ParentSize from "@visx/responsive/lib/components/ParentSize";

export const VisualizationPage = () => {
  const { epwId } = useParams();

  const { isLoading, error, data } = useQuery(["epwData", epwId], () => fetchEpwData(epwId));

  const width = "75%"

  return (
    <>
      <Navigation epwName={epwId}/>
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item sx={{ height: "50vh", width}} >
          <ErrorBoundary>
            <ParentSize>
              {({ width, height }) => <LineChart width={width} height={height} isLoading={isLoading} error={error} data={data?.data}/>}
            </ParentSize>
          </ErrorBoundary>
        </Grid>

        <Grid item sx={{ height: "50vh", width}} >
          <ErrorBoundary>
          <EpwTable isLoading={isLoading} error={error} data={data?.data}/>
          </ErrorBoundary>
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};


