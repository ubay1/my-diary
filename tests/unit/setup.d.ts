/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// / <reference types="@testing-library/jest-dom" />

import "@testing-library/jest-dom";

// pastikan extend matchers dikenali
declare module "vitest" {
  interface Assertion<T = any> {
    toBeInTheDocument(): void;
    toHaveValue(value: any): void;
    toHaveTextContent(text: string | RegExp): void;
    // bisa tambahin matcher lain kalau masih error
  }
}
