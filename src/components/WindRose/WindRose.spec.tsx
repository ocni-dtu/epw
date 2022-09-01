import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { WindRose } from "./index";
import cphEpwData from "../EpwTable/test.data.json";

test("Should render WindRose", () => {
  render(<WindRose isLoading={false} data={cphEpwData.data}/>);

  expect(screen.getByTestId("wind-rose")).toBeInTheDocument();
  //expect(screen.getByText("Date")).toBeInTheDocument();
  //expect(screen.getByText("Temperature")).toBeInTheDocument();
  //expect(screen.getByText("Relative Humidity")).toBeInTheDocument();
});
