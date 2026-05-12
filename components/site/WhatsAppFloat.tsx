"use client";

const WA_LINK = `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || "5511940825120"}?text=${encodeURIComponent("Olá! Quero declarar meu IRPF.")}`;

export default function WhatsAppFloat() {
  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <div className="relative">
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-green-500/30 animate-ping" />
        {/* Button */}
        <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:scale-105 transition-transform">
          {/* Ícone oficial do WhatsApp */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 175.216 175.552"
            className="w-8 h-8"
            aria-hidden="true"
          >
            <path
              d="M87.6 0C39.3 0 0 39.3 0 87.6c0 15.3 4 29.7 10.9 42.2L0 175.6l46.9-10.7c12.1 6.3 25.8 9.9 40.6 9.9 48.3 0 87.6-39.3 87.6-87.6C175.2 39.3 135.9 0 87.6 0zm0 160.1c-13.4 0-25.9-3.6-36.7-9.9l-2.6-1.5-27.8 6.4 6.6-26.9-1.7-2.7C19 114.5 15.1 101.5 15.1 87.6c0-40.1 32.7-72.7 72.6-72.7 40.1 0 72.6 32.7 72.6 72.7-.1 40.1-32.6 72.5-72.7 72.5z"
              fill="white"
            />
            <path
              d="M127.5 104.8c-2.2-1.1-13-6.4-15-7.1-2-0.7-3.5-1.1-4.9 1.1-1.5 2.2-5.6 7.1-6.9 8.6-1.3 1.5-2.5 1.7-4.7 0.6-2.2-1.1-9.3-3.4-17.7-10.9-6.5-5.8-10.9-13-12.2-15.2-1.3-2.2-0.1-3.4 1-4.5 1-1 2.2-2.5 3.3-3.8 1.1-1.3 1.5-2.2 2.2-3.7 0.7-1.5 0.4-2.7-0.2-3.8-0.6-1.1-4.9-11.9-6.7-16.2-1.8-4.3-3.6-3.7-4.9-3.7-1.3 0-2.7-0.2-4.2-0.2-1.5 0-3.8 0.6-5.8 2.7-2 2.2-7.6 7.4-7.6 18.1s7.8 21 8.8 22.5c1.1 1.5 15.3 23.3 37 32.7 5.2 2.2 9.2 3.5 12.4 4.5 5.2 1.6 9.9 1.4 13.6 0.8 4.2-0.6 13-5.3 14.8-10.4 1.8-5.1 1.8-9.5 1.3-10.4-0.6-1-2-1.6-4.2-2.7z"
              fill="white"
            />
          </svg>
        </div>
      </div>
      {/* Tooltip - desktop only */}
      <span className="hidden md:block absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-preto text-white text-xs px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Declarar IRPF agora
      </span>
    </a>
  );
}
