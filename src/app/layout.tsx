import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import UserSync from "@/components/UserSync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dentalize - Booking Dental Appointment",
  description: "Professional dental care for a healthy, confident smile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
        appearance={{
          variables: {
            colorPrimary: "#1e9df1",
            colorBackground: "#f3f4f6",
            colorText: "#111827",
            colorTextSecondary: "#6b7280",
            colorInputBackground: "#f3f4f6",
          },
        }}
      >
        <html lang="en">
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased dark`} suppressHydrationWarning={true}>
          
            <UserSync />
            {children}
          </body>
        </html>
      </ClerkProvider>
  );
}
