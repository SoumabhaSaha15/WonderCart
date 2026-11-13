import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";

import { routeTree } from "@/routeTree.gen";
import ErrorPage from "@/shared/Error";
import LoadingPage from "@/shared/Loader";
import NotFoundPage from "@/shared/NotFound";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000,
    },
  },
});

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPendingMs: 0,
  // defaultPendingMinMs: 500,
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
  defaultViewTransition: true,
  defaultErrorComponent: ErrorPage,
  defaultPendingComponent: LoadingPage,
  defaultNotFoundComponent: NotFoundPage,
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
