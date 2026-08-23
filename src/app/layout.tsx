import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { AuthSessionProvider } from "@/components/providers/AuthSessionProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "IMT Engineers | Air Conditioners Sri Lanka",
  description:
    "IMT Engineers (Pvt) Ltd — air conditioner sales, installation and after-sales service across Sri Lanka since 2006.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0"
        />
      </head>
      <body className={`${poppins.variable} bg-imt-bg font-sans text-slate-900 antialiased`}>
        <AuthSessionProvider>
          <CartProvider>{children}</CartProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
