import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { FavoritesProvider } from "./context/FavoritesContext.tsx";
import { SearchToggleProvider } from "./context/SearchToggleContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={new QueryClient()}>
        <FavoritesProvider>
          <ThemeProvider>
            <SearchToggleProvider>
              <App />
            </SearchToggleProvider>
          </ThemeProvider>
        </FavoritesProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
