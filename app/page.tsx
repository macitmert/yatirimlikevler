"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      
      // Mobilde direkt PDF'e yönlendir
      if (window.innerWidth < 768) {
        window.location.href = '/sunum.pdf';
        return;
      }
    }
  }, []);

  // SSR sırasında hiçbir şey render etme
  if (!mounted) {
    return null;
  }

  // Mobilde hiçbir şey render etme (yönlendirme yapılıyor)
  if (isMobile) {
    return null;
  }

  // Desktop'ta header + iframe
  return (
    <>
      <Header />
      <iframe
        src="/sunum.pdf"
        width="100%"
        height="100%"
        style={{ 
          border: 'none', 
          position: 'fixed', 
          top: '60px',
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: 'calc(100vh - 60px)'
        }}
        title="Yatırımlık Evler Sunumu"
      />
    </>
  );
}
