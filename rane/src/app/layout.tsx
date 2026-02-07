import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Auth0Provider } from "@auth0/nextjs-auth0";
import AppShell from "@/components/AppShell";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rane — Inner Weather for Emotional Clarity",
  description:
    "Rane helps you understand your emotions as passing inner weather — turning journaling into clarity, not self-blame.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Auth0Provider>
          <AppShell>{children}</AppShell>
        </Auth0Provider>
      </body>
    </html>
  );
}
