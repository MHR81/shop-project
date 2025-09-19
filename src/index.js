// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ✅ Service Worker: فقط روی production فعال باشه
if (process.env.NODE_ENV === "production") {
  serviceWorkerRegistration.register({
    onUpdate: (registration) => {
      // وقتی نسخه جدید آماده شد، یه ایونت بفرست تا React بتونه پیام بده
      const updateEvent = new CustomEvent("swUpdated", { detail: registration });
      window.dispatchEvent(updateEvent);
    },
    onSuccess: (registration) => {
      console.log("✅ Service Worker registered:", registration);
      const successEvent = new CustomEvent("swRegistered", { detail: registration });
      window.dispatchEvent(successEvent);
    },
  });
} else {
  // 🚫 در حالت dev مطمئن باش هیچ SW فعال نیست
  serviceWorkerRegistration.unregister();
}

reportWebVitals();
