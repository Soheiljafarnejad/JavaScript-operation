import "./globals.css";
import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "simplebar-react/dist/simplebar.min.css";
import { Toaster } from "react-hot-toast";

const font = Source_Sans_3({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "javascript operation",
  description: "javascript operation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`bg-gradient-to-r from-cyan-500 to-blue-500 ${font.className}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
