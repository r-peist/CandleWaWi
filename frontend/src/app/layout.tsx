
import { UserProvider } from "@auth0/nextjs-auth0/client";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Lade benutzerdefinierte Schriften
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Setze Metadaten
export const metadata: Metadata = {
  title: "WaWi - Geruchsmanufaktur",
  description: "WaWi der Geruchsmanufaktur",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <html lang="de">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </UserProvider>
  );
}
