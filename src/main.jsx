import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "react-calendar/dist/Calendar.css"; // 👈 library base
import "./index.css";                      // 👈 your overrides

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
