import "./globals.css";
import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";

const font = Source_Sans_3({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JavaScript operation",
  description: "JavaScript operation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`bg-gradient-to-r from-cyan-500 to-blue-500 ${font.className}`}>{children}</body>
    </html>
  );
}
