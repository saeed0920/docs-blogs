/* ============================================================
   FONT IMPORTS
   ============================================================ */

import localFont from "next/font/local";

export const inter = localFont({
  src: [
    {
      path: "../public/fonts/Inter-Regular.ttf",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "../public/fonts/Inter-Italic.ttf",
      style: "italic",
      weight: "100 900",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const playwrite = localFont({
  src: [
    {
      path: "../public/fonts/Playwrite-Regular.ttf",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "../public/fonts/Playwrite-Italic.ttf",
      style: "italic",
      weight: "100 900",
    },
  ],
  variable: "--font-playwrite",
  display: "swap",
});

export const vazirmatn = localFont({
  src: [
    {
      path: "../public/fonts/Vazirmatn-regular.ttf",
      style: "normal",
      weight: "100 900",
    },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
});
