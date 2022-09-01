import React from "react";
import { Route, Routes } from "react-router-dom";
import { MapPage } from "../../pages/MapPage";
import { VisualizationPage } from "../../pages/VisualizationPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/visualization/:epwId" element={<VisualizationPage />} />
      </Routes>
    </QueryClientProvider>
  );
};
