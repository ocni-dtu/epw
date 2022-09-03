import { afterAll, afterEach, beforeAll, expect, test } from "vitest";
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { fetchEpwData, parseEpwData } from "./fetchEpw";

// Polyfill "window.fetch" used in the React component.
import "whatwg-fetch"

const cphEpwData = `LOCATION,COPENHAGEN,-,DNK,IWEC Data,061800,55.63,12.67,1.0,5.0
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
1984,1,1,4,60,C9C9C9C9*0?9?9?9?9?9?9?9A7A7A7A7A7A7*0E8*0*0,7.4,4.5,82,99200,0,1415,324,0,0,0,0,0,0,0,260,15.4,10,10,10.0,480,0,909999999,0,0.0680,0,88,0.000,0.0,0.0
1984,1,1,5,60,C9C9C9C9*0?9?9?9?9?9?9?9*0B8B8B8B8*0*0E8*0*0,7.6,4.5,81,99200,0,1415,325,0,0,0,0,0,0,0,260,15.4,10,10,10.7,480,9,999999999,0,0.0680,0,88,0.000,0.0,0.0
1984,1,1,6,60,C9C9C9C9*0?9?9?9?9?9?9?9*0B8B8B8B8*0*0E8*0*0,7.8,4.6,80,99100,0,1415,326,0,0,0,0,0,0,0,260,15.4,10,10,11.3,480,9,999999999,0,0.0680,0,88,0.000,0.0,0.0
1984,1,1,7,60,A7A7E8E8*0?9?9?9?9?9?9?9A7A7A7A7A7A7*0E8*0*0,7.9,4.6,80,99100,0,1415,326,0,0,0,0,0,0,0,260,15.4,10,10,12.0,480,9,999999999,0,0.0680,0,88,0.000,0.0,0.0
1984,1,1,8,60,B8C8E8B8*0?9?9?9?9?9?9?9*0B8B8B8B8*0*0E8*0*0,8.1,4.8,79,99100,0,1415,328,0,0,0,0,0,0,0,260,15.1,10,10,10.7,480,9,999999999,0,0.0680,0,88,0.000,0.0,0.0
1984,1,1,9,60,B8C8E8B8*0H9H9H9I9I9I9I9*0B8B8B8B8*0*0E8*0*0,8.4,5.0,79,99100,4,1415,329,0,0,0,100,0,100,20,260,14.7,10,10,9.3,480,9,999999999,0,0.0680,0,88,0.000,0.0,0.0
1984,1,1,10,60,A7A7E8E8*0G9G9G9I9I9I9I9A7A7A7A7A7A7*0E8*0*0,8.6,5.1,79,99100,99,1415,330,10,0,10,1200,0,1200,380,270,14.4,10,10,8.0,480,0,909999999,0,0.0680,0,88,0.000,0.0,0.0
1984,1,1,11,60,B8C8E8B8*0H9H9H9I9I9I9I9*0B8B8B8B8*0*0E8*0*0,8.3,3.9,74,99300,204,1415,312,55,38,50,6100,2600,5700,1210,270,14.4,8,8,12.0,480,9,999999999,0,0.0680,0,88,0.000,0.0,0.0
1984,1,1,12,60,B8C8E8B8*0H9H9H9I9I9I9I9*0B8B8B8B8*0*0E8*0*0,8.1,2.7,69,99400,263,1415,301,107,163,77,11300,10700,9500,1500,270,14.4,6,6,16.0,480,9,999999999,0,0.0680,0,88,0.000,0.0,0.0
1984,1,1,13,60,A7A7E8E8*0G9G9G9I9I9I9I9A7A7A7A7A7A7*0E8*0*0,7.8,1.3,63,99500,273,1415,294,130,334,65,13600,23300,8800,1180,280,14.4,4,4,20.0,22000,9,999999999,0,0.0680,0,88,0.000,0.0,0.0
1984,1,1,14,60,B8C8E8B8*0H9H9H9I9I9I9I9*0B8B8B8B8*0*0E8*0*0,7.0,1.0,65,99500,234,1415,288,105,211,70,11000,13000,8600,1370,280,12.7,3,3,20.7,22000,9,999999999,0,0.0680,0,88,0.000,0.0,0.0
1984,1,1,15,60,B8C8E8B8*0H9H9H9I9I9I9I9*0B8B8B8B8*0*0E8*0*0,6.3,0.7,67,99600,147,1415,285,53,148,38,5600,6500,4800,700,280,11.0,3,3,21.3,22000,9,999999999,0,0.0680,0,88,0.000,0.0,0.0
1984,1,1,16,60,A7A7E8E8*0G9G9G9I9I9I9I9A7A7A7A7A7A7*0E8*0*0,5.5,0.4,70,99700,29,1415,278,10,0,10,1100,0,1100,310,270,9.3,2,2,22.0,22000,9,999999999,0,0.0680,0,88,0.000,0.0,0.0
1984,1,1,17,60,B8C8E8B8*0?9?9?9?9?9?9?9*0B8B8B8B8*0*0E8*0*0,5.3,0.7,72,99700,0,1415,278,0,0,0,0,0,0,0,270,9.6,2,2,21.3,22000,9,999999999,0,0.0680,0,88,0.000,0.0,0.0
1984,1,1,18,60,B8C8E8B8*0?9?9?9?9?9?9?9*0B8B8B8B8*0*0E8*0*0,5.1,0.9,74,99700,0,1415,277,0,0,0,0,0,0,0,270,10.0,2,2,20.7,22000,9,999999999,0,0.0680,0,88,0.000,0.0,0.0
1984,1,1,19,60,A7A7E8E8*0?9?9?9?9?9?9?9A7A7A7A7A7A7*0E8*0*0,4.9,1.2,77,99600,0,1415,273,0,0,0,0,0,0,0,260,10.3,2,1,20.0,22000,9,999999999,0,0.0680,0,88,0.000,0.0,0.0
1984,1,1,20,60,B8C8E8B8*0?9?9?9?9?9?9?9*0B8B8B8B8*0*0E8*0*0,4.8,1.5,79,99600,0,1415,277,0,0,0,0,0,0,0,260,9.6,3,2,19.3,22000,9,999999999,0,0.0680,0,88,0.000,0.0,0.0
`

export const restHandlers = [
  rest.get("http://data.kongsgaard.eu/europe_wmo_region_6/DNK/DNK_Copenhagen.061800_IWEC/DNK_Copenhagen.061800_IWEC.epw", (req, res, ctx) => {
    return res(ctx.status(200), ctx.text(cphEpwData))
  }),
]

const server = setupServer(...restHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())

test("Should fetch and parse EPW", async () => {

    const epwId = "DNK_Copenhagen.061800_IWEC";

    const data = await fetchEpwData(epwId)

    expect(data).toBeTruthy()
  },
);

test("Should parse EPW", () => {
  const epw = parseEpwData(cphEpwData);

  expect(epw).toBeTruthy()
})