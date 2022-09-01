import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Footer } from "./Footer";

test("Should render Footer", async () => {
    render(
      <Footer />
    );

    expect(screen.getByTestId("footer")).toBeDefined()
    expect(await screen.findByText("Developed by Christian Kongsgaard")).toBeInTheDocument()
  },
);