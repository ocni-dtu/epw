import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { VisualizationPage } from "./VisualizationPage";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setupServer } from "msw/node";
import { rest } from "msw";

// Polyfill "window.fetch" used in the React component.
import "whatwg-fetch"

test("Should render VisualizationPage", async () => {
  const cphEpwData = `
LOCATION,COPENHAGEN,-,DNK,IWEC Data,061800,55.63,12.67,1.0,5.0
DESIGN CONDITIONS,1,Climate Design Data 2009 ASHRAE Handbook,,Heating,2,-9.2,-6.7,-12,1.3,-7.6,-10,1.6,-4.9,14.7,4.1,13.3,3.4,4.8,50,Cooling,7,8,25.5,17.9,24,17.3,22.2,16.5,19.3,23.4,18.4,22.3,17.5,21.2,4.6,160,17.9,12.9,20.8,16.9,12.1,20,15.9,11.3,19.3,54.8,23.1,51.8,22.1,49.2,21.1,1044,Extremes,12.7,11.4,10.3,22.4,-11,27.9,3.6,1.7,-13.6,29.1,-15.6,30,-17.6,31,-20.2,32.2
TYPICAL/EXTREME PERIODS,6,Summer - Week Nearest Max Temperature For Period,Extreme,8/ 3,8/ 9,Summer - Week Nearest Average Temperature For Period,Typical,7/ 6,7/12,Winter - Week Nearest Min Temperature For Period,Extreme,2/10,2/16,Winter - Week Nearest Average Temperature For Period,Typical,12/15,12/21,Autumn - Week Nearest Average Temperature For Period,Typical,9/22,9/28,Spring - Week Nearest Average Temperature For Period,Typical,4/ 5,4/11
GROUND TEMPERATURES,3,.5,,,,3.98,1.38,0.68,1.29,4.79,8.71,12.40,15.07,15.85,14.59,11.57,7.76,2,,,,6.31,3.88,2.72,2.68,4.53,7.21,10.09,12.57,13.84,13.60,11.90,9.28,4,,,,7.83,5.94,4.78,4.43,5.11,6.67,8.61,10.51,11.79,12.10,11.37,9.84
HOLIDAYS/DAYLIGHT SAVINGS,No,0,0,0
COMMENTS 1,"IWEC- WMO#061800 - Europe -- Original Source Data (c) 2001 American Society of Heating, Refrigerating and Air-Conditioning Engineers (ASHRAE), Inc., Atlanta, GA, USA.  www.ashrae.org  All rights reserved as noted in the License Agreement and Additional Conditions. DISCLAIMER OF WARRANTIES: The data is provided 'as is' without warranty of any kind, either expressed or implied. The entire risk as to the quality and performance of the data is with you. In no event will ASHRAE or its contractors be liable to you for any damages, including without limitation any lost profits, lost savings, or other incidental or consequential damages arising out of the use or inability to use this data."
COMMENTS 2, -- Ground temps produced with a standard soil diffusivity of 2.3225760E-03 {m**2/day}
DATA PERIODS,1,1,Data,Sunday, 1/ 1,12/31
1984,1,1,1,60,C9C9C9C9*0?9?9?9?9?9?9?9A7A7A7A7A7A7*0E8*0*0,7.0,4.6,85,99500,0,1415,322,0,0,0,0,0,0,0,250,11.3,10,10,8.0,360,0,999999099,0,0.0680,0,88,0.000,0.0,0.0
1984,1,1,2,60,C9C9C9C9*0?9?9?9?9?9?9?9*0B8B8B8B8*0*0E8*0*0,7.1,4.5,84,99400,0,1415,323,0,0,0,0,0,0,0,250,12.7,10,10,8.7,360,9,999999999,0,0.0680,0,88,0.000,0.0,0.0
1984,1,1,3,60,C9C9C9C9*0?9?9?9?9?9?9?9*0B8B8B8B8*0*0E8*0*0,7.2,4.5,83,99300,0,1415,323,0,0,0,0,0,0,0,250,14.0,10,10,9.3,360,9,999999999,0,0.0680,0,88,0.000,0.0,0.0
1984,1,1,4,60,C9C9C9C9*0?9?9?9?9?9?9?9A7A7A7A7A7A7*0E8*0*0,7.4,4.5,82,99200,0,1415,324,0,0,0,0,0,0,0,260,15.4,10,10,10.0,480,0,909999999,0,0.0680,0,88,0.000,0.0,0.0`;

  const restHandlers = [
    rest.get("http://data.kongsgaard.eu/DNK_Copenhagen.061800_IWEC.epw", (req, res, ctx) => {
      return res(ctx.status(200), ctx.text(cphEpwData));
    }),
  ];

  const server = setupServer(...restHandlers);

  server.listen();
  const queryClient = new QueryClient();

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/visualization/DNK_Copenhagen.061800_IWEC"]}>
        <Routes>
          <Route path="/visualization/:epwId" element={<VisualizationPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );

  //expect(await screen.getByTestId("temp-rh-chart")).toBeInTheDocument();
  expect(screen.getByTestId("epw-table")).toBeInTheDocument();
  expect(screen.getByTestId("page-navigation")).toBeInTheDocument();

  server.close();
});
