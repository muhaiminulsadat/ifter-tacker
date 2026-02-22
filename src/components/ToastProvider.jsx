"use client";

import {Toaster} from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "var(--color-base-200)",
          color: "var(--color-base-content)",
          border: "1px solid var(--color-base-300)",
          borderRadius: "12px",
          fontFamily: "var(--font-nunito), sans-serif",
          fontWeight: 600,
          fontSize: "14px",
        },
        success: {
          iconTheme: {primary: "var(--color-success)", secondary: "#14532d"},
        },
        error: {
          iconTheme: {primary: "var(--color-error)", secondary: "#450a0a"},
        },
      }}
    />
  );
}
