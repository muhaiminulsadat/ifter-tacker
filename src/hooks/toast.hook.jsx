import {Toaster} from "react-hot-toast";

const useToast = () => {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#0d1a35",
            color: "#e8d48b",
            border: "1px solid #c9a84c44",
            borderRadius: 12,
            fontFamily: "var(--font-nunito), sans-serif",
            fontWeight: 600,
            fontSize: 14,
          },
          success: {iconTheme: {primary: "#4ade80", secondary: "#14532d"}},
          error: {iconTheme: {primary: "#f87171", secondary: "#450a0a"}},
        }}
      />
    </>
  );
};
export default useToast;
