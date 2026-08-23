import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "IMT Engineers | Air Conditioners Sri Lanka",
  description:
    "IMT Engineers (Pvt) Ltd — air conditioner sales, installation and after-sales service across Sri Lanka since 2006.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-imt-bg font-sans text-slate-900 antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
