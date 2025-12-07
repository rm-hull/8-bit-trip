import { RouterProvider, createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "@/components/ui/provider";
import "./main.css";
import { routeTree } from "./routeTree.gen";
import { downloadModel } from "./llm";

// Create a new router instance
const router = createRouter({
  routeTree,
  basepath: "/8-bit-trip",
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);