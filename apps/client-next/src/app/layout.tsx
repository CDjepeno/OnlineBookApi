"use client";

import "@/styles/global.css";
import Header from "@/components/header";
import { AuthProvider } from "@/context/AuthProvider";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="fr">
        <body>
          <header>
            <Header />
          </header>
          {children}
          <footer>
            <Footer/>
          </footer>
        </body>
      </html>
    </AuthProvider>
  );
}
