import { ErrorFallback } from "@rm-hull/chakra-error-fallback";
import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "@/components/ui/provider";
import { App } from "./App";
import "./main.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider>
      <Router basename="/8-bit-trip">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <App />
        </ErrorBoundary>
      </Router>
    </Provider>
  </React.StrictMode>
);
