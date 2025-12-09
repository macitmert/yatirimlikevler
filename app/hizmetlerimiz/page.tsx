"use client";

import Header from "../components/Header";

export default function HizmetlerimizPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      <Header />
      
      {/* PDF Viewer - Full Screen */}
      <div className="fixed inset-0 top-[60px] sm:top-[80px] bg-white">
        <iframe
          src="/sunum.pdf#page=6"
          className="w-full h-full border-0"
          title="Hizmetlerimiz"
          allow="popups"
        />
      </div>
    </main>
  );
}

