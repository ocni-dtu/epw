import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { LineChart } from "./index";
import cphEpwData from "../EpwTable/test.data.json";

test("Should render Line Chart", () => {
  render(<LineChart isLoading={false} data={cphEpwData.data}/>);

  expect(screen.getByTestId("temp-rh-chart")).toBeInTheDocument();
  expect(screen.getByTestId("temp-curve")).toBeInTheDocument();
});


test("Should render the loading spinner", () => {
  render(<LineChart isLoading={true}/>);

  expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
});

test("Should render an error", () => {
  render(<LineChart isLoading={false} error={new Error("Error Message")}/>);

  expect(screen.getByTestId("error-message")).toBeInTheDocument();
});