import {Amiri, Nunito} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ToastProvider from "@/components/ToastProvider";

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Noor | نور — Ramadan Iftar Manager",
  description:
    "Illuminating shared iftar at BUET Hall. Track contributions, expenses and attendance together.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌙</text></svg>",
  },
};

export default function RootLayout({children}) {
  return (
    <html lang="en" suppressHydrationWarning data-theme={"noor"}>
      <body
        className={`${amiri.variable} ${nunito.variable}`}
        suppressHydrationWarning
      >
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
