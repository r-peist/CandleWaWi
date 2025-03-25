import type { Metadata } from "next";
import localFont from "next/font/local";
import AuthButtons from "./components/AuthButtons";
import AuthProviderWrapper from "./components/AuthProviderWrapper"; // Auth Provider
import "./globals.css";

// Schriften laden
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

// Metadaten setzen
export const metadata: Metadata = {
  title: "WaWi - Geruchsmanufaktur",
  description: "WaWi der Geruchsmanufaktur",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProviderWrapper>
      <html lang="de">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <h1 className="text-xl font-bold">WaWi - Geruchsmanufaktur</h1>
            <AuthButtons /> {/* Login-/Logout-Buttons hier anzeigen */}
          </nav>
          {children}
        </body>
      </html>
    </AuthProviderWrapper>
  );
}

