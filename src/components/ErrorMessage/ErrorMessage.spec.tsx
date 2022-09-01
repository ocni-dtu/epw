import { expect, test } from "vitest";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ErrorMessage } from "./index";
import React from "react";

test("Should render an error", () => {
  render(<ErrorMessage error={new Error("Error Message")}/>);

  expect(screen.getByTestId("error-message")).toBeInTheDocument();
});