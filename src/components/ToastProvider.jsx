"use client";

import {Toaster} from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000, // ← this is what was missing
        style: {
          background: "var(--color-base-200)",
          color: "var(--color-base-content)",
          border: "1px solid var(--color-base-300)",
          borderRadius: "12px",
          fontFamily: "var(--font-nunito), sans-serif",
          fontWeight: 600,
          fontSize: "14px",
          zIndex: 9999, // ← stays above modals/sidebar
        },
        success: {
          duration: 3000,
          iconTheme: {primary: "var(--color-success)", secondary: "#14532d"},
        },
        error: {
          duration: 4000, // errors stay a bit longer
          iconTheme: {primary: "var(--color-error)", secondary: "#450a0a"},
        },
      }}
    />
  );
}
