import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRoutes from "./routes";

import { ThemeProvider } from "./providers/ThemeProvider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>

      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>

  </StrictMode>
);
