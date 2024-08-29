// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./global.css";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes/router.tsx";
import { ThemeProvider } from "./providers/theme-provider.tsx";
import { Toaster } from "./components/ui/toaster.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <Router />
      <Toaster />
    </ThemeProvider>
  </BrowserRouter>
);
