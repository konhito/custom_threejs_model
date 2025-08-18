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

export const metadata = {
  title: "AquaMundi - Sacred Flowers & Biodiversity Guardians",
  description: "A cosmic journey through the world's most sacred flowers, connecting humanity with nature's wisdom and the pollinators that sustain life on Earth.",
  keywords: "AquaMundi, national flowers, pollinators, biodiversity, environmental protection, guardians, sustainability",
  authors: [{ name: "AquaMundi Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
