import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { EpwTable } from "./index";
import cphEpwData from "./test.data.json";

test("Should render EpwTable", () => {
  render(<EpwTable isLoading={false} data={cphEpwData.data}/>);

  expect(screen.getByTestId("epw-table")).toBeInTheDocument();
  expect(screen.getByText("Date")).toBeInTheDocument();
  expect(screen.getByText("Temperature")).toBeInTheDocument();
  expect(screen.getByText("Relative Humidity")).toBeInTheDocument();
});
