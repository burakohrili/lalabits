import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { NotificationBadgeProvider } from "@/contexts/notification-badge-context";
import { ChatBadgeProvider } from "@/contexts/chat-badge-context";
import SiteHeader from "./_components/site-header";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "lalabits.art",
  description: "Yaratıcılar için dijital içerik ve üyelik platformu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[var(--font-geist-sans)]">
        <AuthProvider>
          <NotificationBadgeProvider>
            <ChatBadgeProvider>
              <SiteHeader />
              {children}
            </ChatBadgeProvider>
          </NotificationBadgeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
