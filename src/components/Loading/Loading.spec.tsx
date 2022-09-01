import { expect, test } from "vitest";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Loading } from "./index";
import React from "react";

test("Should render the loading spinner", () => {
  render(<Loading />);

  expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
});