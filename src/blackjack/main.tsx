import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BlackjackApp } from "./BlackjackApp";
import "../index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BlackjackApp />
  </StrictMode>,
);
