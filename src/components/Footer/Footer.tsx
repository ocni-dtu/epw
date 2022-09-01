import React from "react";
import { Grid, Link, Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

export const Footer = () => {
  return (
    <Grid data-testid="footer" container spacing={0} direction="column" alignItems="center" justifyContent="center" sx={{mt: 3}}>
      <Grid item>
        <Link
          color="inherit"
          href="https://www.linkedin.com/in/christian-kongsgaard/"
          target="_blank"
          rel="noopener"
          underline="hover"
        >
          <Typography>Developed by Christian Kongsgaard</Typography>
        </Link>
      </Grid>
      <Grid item>
        <Link href="https://github.com/ocni-dtu/epw" target="_blank" rel="noopener" underline="hover">
          <GitHubIcon color="inherit" />
        </Link>
      </Grid>
    </Grid>
  );
};
