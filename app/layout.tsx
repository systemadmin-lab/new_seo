import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteConfig } from "./config/site";
import "./globals.css";

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const oswald = localFont({
  src: "./fonts/oswald-latin.woff2",
  variable: "--font-oswald",
  weight: "200 700",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`${siteConfig.url}/`),
  applicationName: siteConfig.name,
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${inter.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[#07546f] focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-white focus:outline-none focus:ring-2 focus:ring-[#73d7f1] focus:ring-offset-2"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
