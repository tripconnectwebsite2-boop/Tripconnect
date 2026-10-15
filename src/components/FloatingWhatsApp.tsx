export default function FloatingWhatsApp() {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <a
        aria-label="Chat with Trip Concierge on WhatsApp"
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-secondary text-white shadow-lg hover:shadow-xl hover:bg-on-secondary-container transition-all transform hover:-translate-y-0.5 active:scale-95"
        href="https://wa.me/919400886838"
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className="material-symbols-outlined text-[24px]">chat</span>
        <span className="font-label-md text-label-md hidden sm:inline-block pr-1 font-semibold text-white">
          WhatsApp Concierge
        </span>
      </a>
    </div>
  );
}
