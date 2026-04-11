import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { NotificationBadgeProvider } from "@/contexts/notification-badge-context";
import { ChatBadgeProvider } from "@/contexts/chat-badge-context";
import SiteHeader from "./_components/site-header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "lalabits.art — Türkiye'nin İçerik Platformu",
  description:
    "Türkiye'nin içerik üreticisi platformu. Üyelik, dijital ürün ve içerik ile destekçilerinden doğrudan kazan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[var(--font-inter)]">
        <AuthProvider>
          <NotificationBadgeProvider>
            <ChatBadgeProvider>
              <SiteHeader />
              <div className="flex-1">{children}</div>
              <Footer />
            </ChatBadgeProvider>
          </NotificationBadgeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
