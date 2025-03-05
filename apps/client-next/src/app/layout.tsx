"use client";

import "@/styles/global.css";
import Header from "@/components/header";
import { AuthProvider } from "@/context/AuthProvider";

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
        </body>
      </html>
    </AuthProvider>
  );
}
