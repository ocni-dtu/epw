import React from 'react'
import '@testing-library/jest-dom'
import { render } from "@testing-library/react"
import { expect, test } from 'vitest'
import { App } from "./App";
import { MemoryRouter } from "react-router-dom";

test("Should render App", () => {
    const element = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(element).toBeTruthy()
  },
);