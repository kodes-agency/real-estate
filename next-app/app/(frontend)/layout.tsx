import React from "react";
import "./globals.css";
import { Toaster } from "sonner";
import { Header } from "@/components/global/header";
// import { ThemeProvider } from "@/components/global/theme-provider";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import Footer from "@/components/global/footer";
import PlausibleProvider from "next-plausible";

const montserrat = Montserrat({
  subsets: ["cyrillic"],
  variable: "--font-montserrat",
});

const marlet = localFont({
  src: [
    {
      path: "../../fonts/marlet-regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-marlet",
});

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="bg" suppressHydrationWarning>
      <body
        className={cn(
          montserrat.className,
          marlet.variable,
          "**:leading-[1.1] bg-foreground",
        )}
      >
        <PlausibleProvider
          selfHosted
          trackOutboundLinks
          customDomain="https://umami.kodes.agency"
          domain="hayatisestates.com"
        >
          <Header />
          <main className="rounded-b-2xl bg-background">{children}</main>
          <Footer />
          <Toaster />
        </PlausibleProvider>
      </body>
    </html>
  );
}
