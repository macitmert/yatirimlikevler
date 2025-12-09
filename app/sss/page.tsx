"use client";

import Header from "../components/Header";

export default function SSSPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      <Header />
      
      {/* PDF Viewer - Full Screen */}
      <div className="fixed inset-0 top-[60px] sm:top-[80px] bg-white">
        <iframe
          src="/sunum.pdf#page=10"
          className="w-full h-full border-0"
          title="Sık Sorulan Sorular"
          allow="popups"
        />
      </div>
    </main>
  );
}

