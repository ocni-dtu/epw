import React from "react";
import { Route, Routes } from "react-router-dom";
import { MapPage } from "../../pages/MapPage";
import { VisualizationPage } from "../../pages/VisualizationPage";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MapPage />} />
      <Route path="/visualization" element={<VisualizationPage />} />
    </Routes>
  );
};
