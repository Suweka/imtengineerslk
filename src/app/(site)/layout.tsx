import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Snowfall } from "@/components/ui/Snowfall";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Snowfall />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
