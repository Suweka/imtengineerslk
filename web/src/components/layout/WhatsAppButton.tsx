import { siteSettings } from "@/data/testimonials";

export function WhatsAppButton() {
  const digits = siteSettings.whatsapp.replace(/^0/, "94");
  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5.06-1.36A10 10 0 1012 2zm0 18.2a8.16 8.16 0 01-4.17-1.14l-.3-.18-3 .8.8-2.92-.19-.3A8.2 8.2 0 1120.2 12 8.21 8.21 0 0112 20.2zm4.5-6.14c-.25-.12-1.45-.72-1.68-.8s-.39-.12-.56.12-.64.8-.79.97-.29.19-.54.06a6.7 6.7 0 01-1.97-1.22 7.4 7.4 0 01-1.36-1.7c-.14-.25 0-.38.11-.5s.25-.29.37-.44a1.7 1.7 0 00.25-.42.46.46 0 000-.44c-.06-.12-.56-1.35-.77-1.85s-.4-.42-.56-.43h-.48a.92.92 0 00-.67.31 2.8 2.8 0 00-.87 2.08 4.86 4.86 0 001 2.58 11.1 11.1 0 004.27 3.77 4.83 4.83 0 003 .63 2.56 2.56 0 001.68-1.18 1.94 1.94 0 00.14-1.18c-.06-.1-.23-.17-.48-.29z" />
      </svg>
    </a>
  );
}
