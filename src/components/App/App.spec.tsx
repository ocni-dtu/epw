import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react"
import { expect, test } from 'vitest'
import { App } from "./App";

test("Should render App", () => {
    render(
      <App />
    );

    expect(screen.getByText("Welcome to the EPW Visualizer App!")).toBeTruthy()
  },
);