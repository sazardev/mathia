import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/app/router";
import "@/styles/tokens.css";
import "@/styles/reset.css";
import { checkForUpdates } from "./lib/updater";

void checkForUpdates();

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
