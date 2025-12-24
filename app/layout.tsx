import type { Metadata } from "next";
import { Inter, Dancing_Script } from "next/font/google";
import "./globals.css";
import MusicPlayer from "@/components/MusicPlayer";
import WelcomeScreen from "@/components/WelcomeScreen";
import SnowfallBackground from "@/components/SnowfallBackground";

const inter = Inter({ subsets: ["latin"] });

const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-dancing'
});

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
      <body className={`${inter.className} ${dancingScript.variable}`}>
        <SnowfallBackground />   
        <WelcomeScreen />
        {children}
        <MusicPlayer />
      </body>
    </html>
  );
}