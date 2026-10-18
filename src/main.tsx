import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./AppRouter/AppRouter";
import CounterContextProvider from "./Context/CounterContext/CounterContext";
import UserAuthProvider from "./Context/UserAuthProvider/UserAuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const myClient = new QueryClient()
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={myClient}>
      <UserAuthProvider>
        <CounterContextProvider>
          <RouterProvider router={router} />
        </CounterContextProvider>
      </UserAuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
