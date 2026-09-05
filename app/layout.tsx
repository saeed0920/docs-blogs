import { Provider } from "@/components/provider";
import { inter, playwrite, vazirmatn } from "@/lib/font";
import type { CSSProperties } from "react";
import "./global.css";

export default function Layout({ children }: LayoutProps<"/">) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${playwrite.variable} ${vazirmatn.variable}`}
      style={
        {
          "--dots-image": `url("${basePath}/dots.png")`,
        } as CSSProperties
      }
    >
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
