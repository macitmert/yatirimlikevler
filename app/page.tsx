"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      window.location.href = '/sunum.pdf';
    }
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        src="/sunum.pdf"
        width="100%"
        height="100%"
        style={{ 
          border: 'none', 
          margin: 0,
          padding: 0,
          display: 'block'
        }}
        title="Yatırımlık Evler Sunumu"
      />
    </div>
  );
}
