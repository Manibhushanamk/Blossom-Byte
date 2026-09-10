import { Inter } from "next/font/google";
import "@/styles/globals.css";
import SmoothScrollWrapper from "@/components/global/SmoothScrollWrapper";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import Providers from "@/context/Providers";
import SetupGuard from "@/components/global/SetupGuard";

// Initialize Inter font as secondary font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-secondary",
  display: "swap",
});

export const metadata = {
  title: "Blossom Byte | A Premium Floral Experience",
  description: "Experience nature, technology, and luxury shopping combined into one seamless cinematic journey.",
  keywords: ["luxury flowers", "premium floral", "floral gifts", "blossom byte", "online florist"],
  authors: [{ name: "Blossom Byte Team" }],
  metadataBase: new URL('https://blossombyte.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Blossom Byte | A Premium Floral Experience",
    description: "Experience nature, technology, and luxury shopping combined into one seamless cinematic journey.",
    url: 'https://blossombyte.com',
    siteName: 'Blossom Byte',
    images: [
      {
        url: '/images/logos/primary_logo.png',
        width: 800,
        height: 600,
        alt: 'Blossom Byte Logo',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Blossom Byte | A Premium Floral Experience",
    description: "Experience nature, technology, and luxury shopping combined into one seamless cinematic journey.",
    images: ['/images/logos/primary_logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* We will load Satoshi or General Sans via CDN or local font if needed, for now we fall back to system fonts in CSS */}
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <SetupGuard>
            <SmoothScrollWrapper>
              <Navbar />
              {children}
              <Footer />
            </SmoothScrollWrapper>
          </SetupGuard>
        </Providers>
      </body>
    </html>
  );
}
