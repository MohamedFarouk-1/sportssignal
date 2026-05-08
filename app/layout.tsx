import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SportsSignal",
  description: "AI research terminal for NBA creators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#08090d] text-zinc-100">{children}</body>
    </html>
  );
}
