import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import SiteFooter from "@/components/SiteFooter";
import MobileTabs from "@/components/MobileTabs";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IMT Engineers — Air Conditioners, Installation & Service",
  description:
    "Air conditioning sales, installation and after-sales service across Sri Lanka. Authorised dealer for leading inverter brands.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <TopNav />
        <main className="pb-16 md:pb-0">{children}</main>
        <SiteFooter />
        <MobileTabs />
      </body>
    </html>
  );
}
