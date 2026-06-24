// This file is the entry point for the frontend application. It sets up the error handling middleware and creates a start instance for the application using the `@tanstack/react-start` library. The error handling middleware catches any errors that occur during the request processing and renders an error page with a 500 status code if an unexpected error occurs. The start instance is created with the error handling middleware included in the request processing pipeline, ensuring that any errors are properly handled and displayed to the user.
import { createStart, createMiddleware } from "@tanstack/react-start";
import { renderErrorPage } from "./lib/error-page";

// this line explains the purpose of the errorMiddleware function. It is a middleware that catches any errors that occur during the request processing and renders an error page with a 500 status code if an unexpected error occurs. It also logs the error to the console for debugging purposes. If the error has a statusCode property, it rethrows the error to be handled by other middleware or the default error handler.
const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
}));
