import React from "react";
import { ButtonGroup, IconButton } from "@mui/material";
import { CenterFocusWeak, RestartAltRounded, ZoomIn, ZoomOut } from "@mui/icons-material";

interface ScaleProps {
  scaleX: number;
  scaleY: number;
}

interface ControlButtonsProps {
  zoom: {
    scale: (arg0: ScaleProps) => void;
    center: () => void;
    reset: () => void;
  };
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({ zoom }) => {
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
