import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// this file sets up the router for the frontend application using the `@tanstack/react-router` library. It creates a QueryClient instance for managing server state and caching, and then creates a router instance with the defined route tree, context, scroll restoration, and default preload settings. The `getRouter` function returns the configured router instance for use in the application.
export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  return router;
};
