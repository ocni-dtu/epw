import { Breadcrumbs, Link, Paper } from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import React from "react";

interface NavigationProps {
  epwName?: string
}

export const Navigation: React.FC<NavigationProps> = ({epwName}) => {
  return (
    <Paper sx={{p: 2, mb: 2}} elevation={3}>
      <Breadcrumbs aria-label="breadcrumb" data-testid="page-navigation">
        <Link underline="hover" color="inherit" to="/" component={RouterLink as any}>
          EPW Map
        </Link>
        {epwName? <Link
          color="inherit"
          aria-disabled={true}
        >
          Visualization: {epwName}
        </Link>: null}
      </Breadcrumbs>
    </Paper>

  )
}