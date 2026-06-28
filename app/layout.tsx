import { RootProvider } from "fumadocs-ui/provider/next";
import { inter, playwrite, vazirmatn } from "@/lib/font";
import "./global.css";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${playwrite.variable} ${vazirmatn.variable}`}
    >
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
