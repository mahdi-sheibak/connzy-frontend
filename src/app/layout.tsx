import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToast } from "@/components/ui/sonner";
import "@/styles/globals.css";

import { Provider } from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Connzy",
  description: "Connzy Web App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Provider>{children}</Provider>
        <Toaster />
        <SonnerToast />
      </body>
    </html>
  );
}
