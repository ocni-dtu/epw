import React from "react";
import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loading } from "../Loading";

const MapPage = React.lazy(() => import("../../pages/MapPage"));
const VisualizationPage = React.lazy(() => import("../../pages/VisualizationPage"));

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <React.Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/visualization/:epwId" element={<VisualizationPage />} />
        </Routes>
      </React.Suspense>
    </QueryClientProvider>
  );
};
