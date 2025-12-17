import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./css/App.css";
import { CartProvider } from "./pages/CartContext";
import { NotificationProvider } from "./components/NotificationProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <NotificationProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </NotificationProvider>
  </React.StrictMode>
);