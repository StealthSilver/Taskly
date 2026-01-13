import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import NavbarShell from "./components/NavbarShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taskly",
  description: "Taskly – the only place to manage your tasks efficiently",
  icons: {
    icon: "/todo.svg",
    shortcut: "/todo.svg",
    apple: "/todo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <NavbarShell />
            <main className="flex flex-1 items-center justify-center px-4 py-6 sm:px-6 sm:py-10 md:px-8 md:py-12">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
