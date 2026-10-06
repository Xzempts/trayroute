import type { Metadata } from "next";
import { Fraunces, Geist_Mono, Outfit } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Trayroute — Pharmacy technology",
    template: "%s — Trayroute",
  },
  description:
    "Trayroute is a pharmacy technology company. The counting tray keeps the number on the bench. Route scans the bags and plans the delivery round.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
