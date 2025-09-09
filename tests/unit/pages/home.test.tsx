/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "../../../src/App";
import { renderWithTRPC } from "../utils";

describe("Home page", () => {
  it("greeting home page", () => {
    const { getByTestId } = renderWithTRPC(<HomePage />);
    expect(getByTestId("heading-greet").textContent).toBe(
      "TypeScript, Tailwind + shadcn/ui, React Query (TanStack), React Router (declarative mode) tRPC, React Hook Form + Zod, Vitest + React Testing Library, dan Playwright.",
    );
  });

  it("example form: display validation error message when submitting empty form", async () => {
    const { getByTestId, queryByTestId, findByTestId } = renderWithTRPC(
      <HomePage />,
    );

    // error message return null
    expect(queryByTestId("home-example-error-msg")).toBeNull();

    const input = getByTestId("home-example-form-input");
    const button = getByTestId("home-example-btn-submit");

    // input with empty value & click btn submit then show error message
    expect(input).toHaveValue("");
    fireEvent.click(button);
    const errorMessage = await findByTestId("home-example-error-msg");
    expect(errorMessage).toBeInTheDocument();
  });

  it("example: display validation error message when submitting less than 3 char", async () => {
    const { getByTestId } = renderWithTRPC(<HomePage />);
    const input = getByTestId("home-example-form-input");
    const button = getByTestId("home-example-btn-submit");

    await userEvent.clear(input); // Pastikan input benar-benar kosong
    await userEvent.type(input, "te"); // Contoh input valid
    await userEvent.click(button);
    expect(getByTestId("home-example-error-msg").textContent).toBe(
      "Username must be at least 3 characters long",
    );
  });
});
