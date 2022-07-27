import React from 'react'
import { Grid, Typography } from "@mui/material";
import CloudIcon from '@mui/icons-material/Cloud';

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
      <Grid item>
        <Typography variant="h2" sx={{ textAlign: "center" }}>
          Hello from the MapPage
        </Typography>
      </Grid>
      <Grid item>
        <CloudIcon color="info" sx={{fontSize: "20rem"}}/>
      </Grid>
    </Grid>
  );
};
