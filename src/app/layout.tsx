import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchBox from "@/components/SearchBox";
import SessionWrapper from "@/components/providers"; // ✅

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "سوق المستعمل السوري",
  description: "منصة لتسهيل بيع كافة انواع المستعمل",
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-200`}>
        <SessionWrapper>
          <Header />
          <SearchBox />
          <main className="min-h-screen p-4">{children}</main>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
