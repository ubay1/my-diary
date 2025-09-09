/* eslint-disable @typescript-eslint/no-unused-vars */
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { getQueryClient } from "../../src/lib/react-query/query-client";
import type { AppRouter } from "server/routers";
import { createTRPCReact } from "@trpc/react-query";
import { TRPCProvider as TrpcProvider } from "../../src/lib/trpc";
import { MemoryRouter } from "react-router";

const trpc = createTRPCReact<AppRouter>();

export function renderWithTRPC(ui: React.ReactElement) {
  const queryClient = getQueryClient();
  const client = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: "http://localhost:3000/api/trpc",
      }),
    ],
  });

  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <TrpcProvider trpcClient={client} queryClient={queryClient}>
          {ui}
        </TrpcProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
}
