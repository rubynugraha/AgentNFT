import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: 'AI Agent NFT - Mint Now',
  description: 'Mint unique AI-generated NFTs on Base Mainnet. First-Come-First-Serve minting for the Cloud Painter Bot collection with 5 rarity tiers.',
  generator: 'AINFT.app',
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                console.warn('Global error caught:', e.error);
                // Prevent the error from breaking the page
                if (e.error && e.error.message && e.error.message.includes('Invalid regular expression')) {
                  e.preventDefault();
                  console.warn('Suppressed invalid regex error from extension');
                }
              });
              window.addEventListener('unhandledrejection', function(e) {
                console.warn('Unhandled promise rejection:', e.reason);
                // Prevent rejections from breaking the page
                if (e.reason && e.reason.message && e.reason.message.includes('Invalid regular expression')) {
                  e.preventDefault();
                  console.warn('Suppressed invalid regex rejection from extension');
                }
              });
            `,
          }}
        />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
