import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import ReactQueryProvider from "./providers/react-query-provider.tsx";
import About from "./pages/about.tsx";
import AddNote from "./pages/add-note.tsx";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import EditNote from "./pages/edit-note.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ReactQueryProvider>
        <Toaster position="top-center" richColors />
        <ThemeProvider>
          <Routes>
            <Route index element={<App />} />
            <Route path="about" element={<About />} />
            <Route path="add-note" element={<AddNote />} />
            <Route path="edit-note/:id" element={<EditNote />} />
          </Routes>
        </ThemeProvider>
      </ReactQueryProvider>
    </BrowserRouter>
  </StrictMode>
);
