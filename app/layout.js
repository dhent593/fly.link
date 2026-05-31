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
  title: "fly.link | Premium URL Shortener Platform",
  description: "Platform penyingkat URL modern yang ringan, cepat, dan aman. Lacak klik tautan secara real-time, buat QR Code, dan amankan tautan dengan proteksi sandi kustom.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
