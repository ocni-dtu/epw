import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { MapPage } from "./MapPage";
import { MemoryRouter } from "react-router-dom";

test("Should render MapPage", () => {
  render(
    <MemoryRouter>
      <MapPage />
    </MemoryRouter>
  );

  expect(screen.getByTestId("map-element")).toBeTruthy();
  expect(screen.getByTestId("epw-map")).toBeTruthy();
});
