import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Map } from "./Map";
import { MemoryRouter } from "react-router-dom";

test("Should render Map", () => {
    render(
      <MemoryRouter>
        <Map />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("epw-map")).toBeTruthy();
    expect(screen.getByTestId("map-control-buttons")).toBeTruthy();
  },
);