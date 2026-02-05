import React from "react";
import "./globals.css";
import { Toaster } from "sonner";
import { Header } from "@/components/global/header";
import { ThemeProvider } from "@/components/global/theme-provider";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import Footer from "@/components/global/footer";

const montserrat = Montserrat({
  subsets: ["cyrillic"],
  variable: "--font-montserrat",
});

export const metadata = {
  description: "A blank template using Payload in a Next.js app.",
  title: "Payload Blank Template",
};

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          montserrat.className,
          marlet.variable,
          "**:leading-[1.1] bg-foreground",
        )}
      >
        {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem> */}
        <Header />
        <main className="rounded-b-2xl bg-background">{children}</main>
        <Footer />
        <Toaster />
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
