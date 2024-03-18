import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { ContextProvider } from "./SocketContext";

createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ContextProvider>
);
