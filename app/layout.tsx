import { Provider } from "@/components/provider";
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
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
