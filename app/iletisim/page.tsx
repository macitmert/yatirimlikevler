"use client";

import Header from "../components/Header";

export default function IletisimPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      <Header />
      
      {/* PDF Viewer - Full Screen */}
      <div className="fixed inset-0 top-[60px] sm:top-[80px] bg-white overflow-auto" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
        <div className="pdf-container">
          <iframe
            src="/sunum.pdf#page=16"
            className="w-full border-0"
            style={{ minHeight: '100vh', height: 'auto', display: 'block' }}
            title="İletişim"
            allow="popups"
          />
        </div>
      </div>
    </main>
  );
}

