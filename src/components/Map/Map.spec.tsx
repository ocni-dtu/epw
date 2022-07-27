import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react"
import { expect, test } from 'vitest'
import { Map } from "./Map";

test("Should render Map", () => {
    render(
      <Map />
    );

    expect(screen.getByText("Welcome to the EPW Visualizer App!")).toBeTruthy()
  },
);