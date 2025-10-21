import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yatırımlık Evler",
  description: "Yatırımlık evleri keşfet & Evini hızlı sat",
  icons: {
    icon: [
      { url: '/favicon.ico?v=4', sizes: 'any' },
      { url: '/favicon.ico?v=4', type: 'image/x-icon' },
      { url: '/favicon.ico?v=4', sizes: '16x16', type: 'image/x-icon' },
      { url: '/favicon.ico?v=4', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.ico?v=4', sizes: '48x48', type: 'image/x-icon' }
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=4', sizes: '180x180' }
    ],
    shortcut: '/favicon.ico?v=4'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.ico?v=4" sizes="any" />
        <link rel="icon" href="/favicon.ico?v=4" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico?v=4" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=4" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="preload" href="/fonts/SFPRODISPLAYREGULAR.OTF" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/SFPRODISPLAYMEDIUM.OTF" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/SFPRODISPLAYBOLD.OTF" as="font" type="font/otf" crossOrigin="anonymous" />
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'SF Pro Display';
              src: url('/fonts/SFPRODISPLAYREGULAR.OTF') format('opentype');
              font-weight: 400;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: 'SF Pro Display';
              src: url('/fonts/SFPRODISPLAYMEDIUM.OTF') format('opentype');
              font-weight: 500;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: 'SF Pro Display';
              src: url('/fonts/SFPRODISPLAYBOLD.OTF') format('opentype');
              font-weight: 700;
              font-style: normal;
              font-display: swap;
            }
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{fontFamily: "'SF Pro Display', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"}}
      >
        {children}
      </body>
    </html>
  );
}
