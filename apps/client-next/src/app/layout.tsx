"use client";

import "@/styles/global.css";
import Header from "@/components/header";
import { AuthProvider } from "@/context/AuthProvider";
import Footer from "@/components/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SnackbarProvider maxSnack={5}>
      <QueryClientProvider client={queryClient}>
        <html lang="fr">
          <AuthProvider>
            <body>
              <header>
                <Header />
              </header>
              {children}
              <footer>
                <Footer />
              </footer>
            </body>
          </AuthProvider>
        </html>
      </QueryClientProvider>
    </SnackbarProvider>
  );
}
