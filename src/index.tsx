import { ChakraProvider, ColorModeScript, createLocalStorageManager, theme } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";

const manager = createLocalStorageManager("8-bit-trip.color-mode");
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode="dark" storageKey="xchg-rax-rax.color-mode" />
    <ChakraProvider theme={theme} colorModeManager={manager}>
      <Router basename="/8-bit-trip">
        <App />
      </Router>
    </ChakraProvider>
  </React.StrictMode>
);
