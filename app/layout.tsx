import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CIE Daily — Innovation & Technology Journal",
  description: "Join the community of readers and creators exploring the frontiers of technology, AI, and innovation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
