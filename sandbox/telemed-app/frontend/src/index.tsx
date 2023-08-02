import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import ErrorBoundary from "./Providers/ErrorBoundary.tsx";
import NotificationProvider from "./Providers/NotificationProvider.tsx";
import "./css/global.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <BrowserRouter>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>
);
