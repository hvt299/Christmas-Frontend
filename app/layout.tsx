import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MusicPlayer from "@/components/MusicPlayer";
import WelcomeScreen from "@/components/WelcomeScreen";
import SnowfallBackground from "@/components/SnowfallBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Christmas Wishes",
  description: "Gửi những lời chúc Giáng Sinh ấm áp đến người thân yêu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SnowfallBackground />
        
        <WelcomeScreen />
        {children}
        <MusicPlayer />
      </body>
    </html>
  );
}