import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "BeHireable - AI Resume Optimization",
  description: "Optimize your resume with AI to match your dream job perfectly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={poppins.className}>
        <body>
          {children}
          <Toaster className={poppins.className} theme="dark" position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
